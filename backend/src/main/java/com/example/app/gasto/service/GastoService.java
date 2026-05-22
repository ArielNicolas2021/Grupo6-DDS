package com.example.app.gasto.service;

import com.example.app.exception.ResourceNotFoundException;
import com.example.app.exception.UnauthorizedAccessException;
import com.example.app.gasto.dto.GastoUpdateRequestDTO;
import com.example.app.gasto.dto.GastoRequestDTO;
import com.example.app.gasto.dto.GastoResponseDTO;
import com.example.app.models.Categoria;
import com.example.app.models.Gasto;
import com.example.app.models.Usuario;
import com.example.app.repositories.CategoriaRepository;
import com.example.app.repositories.GastoRepository;
import com.example.app.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio de negocio para Gastos.
 *
 * Flujo de creación:
 *   1. Obtener email del usuario autenticado desde SecurityContext
 *   2. Cargar entidad Usuario desde BD
 *   3. Validar que la Categoría exista
 *   4. Construir y persistir el Gasto
 *   5. Mapear a GastoResponseDTO
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GastoService {

    private final GastoRepository gastoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;

    // ── Crear ────────────────────────────────────────────────────────────────

    public GastoResponseDTO crear(GastoRequestDTO request) {

        // 1. Obtener usuario autenticado desde el token JWT (via SecurityContext)
        Usuario usuario = getUsuarioAutenticado();
        log.debug("Creando gasto para usuario: {}", usuario.getEmail());

        // 2. Validar y cargar la categoría
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria", request.getCategoriaId()));

        // 3. Construir la entidad (monto validado por @DecimalMin en el DTO)
        Gasto gasto = Gasto.builder()
                .monto(request.getMonto())
                .descripcion(request.getDescripcion())
                .fecha(request.getFecha())
                .numeroReferencia(request.getNumeroReferencia())
                .usuario(usuario)
                .categoria(categoria)
                .build();

        // 4. Persistir
        Gasto guardado = gastoRepository.save(gasto);
        log.info("Gasto creado → id: {}, monto: {}, usuario: {}",
                guardado.getId(), guardado.getMonto(), usuario.getEmail());

        // 5. Mapear y retornar
        return toResponseDTO(guardado);
    }

    public GastoResponseDTO actualizar(Long id, GastoUpdateRequestDTO request) {
        Usuario usuario = getUsuarioAutenticado();

        // 1. Verificar existencia
        Gasto gasto = gastoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gasto", id));

        // 2. Verificar ownership — 403 si el gasto pertenece a otro usuario
        if (!gasto.getUsuario().getId().equals(usuario.getId())) {
            throw new UnauthorizedAccessException("Gasto", id);
        }

        // 3. Actualizar solo los campos que vienen con valor (patch parcial)
        if (request.getMonto() != null) {
            gasto.setMonto(request.getMonto());
        }
        if (request.getDescripcion() != null) {
            gasto.setDescripcion(request.getDescripcion());
        }
        if (request.getFecha() != null) {
            gasto.setFecha(request.getFecha());
        }
        if (request.getNumeroReferencia() != null) {
            gasto.setNumeroReferencia(request.getNumeroReferencia());
        }
        if (request.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Categoria", request.getCategoriaId()));
            gasto.setCategoria(categoria);
        }

        // 4. JPA detecta cambios automaticamente en contexto transaccional
        Gasto actualizado = gastoRepository.save(gasto);
        log.info("Gasto actualizado -> id: {}, usuario: {}", actualizado.getId(), usuario.getEmail());

        return toResponseDTO(actualizado);
    }

    // -- Consultas --
    // ── Consultas ────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<GastoResponseDTO> listarPropios() {
        Usuario usuario = getUsuarioAutenticado();
        return gastoRepository.findByUsuarioIdOrderByFechaDesc(usuario.getId())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public GastoResponseDTO buscarPorId(Long id) {
        Usuario usuario = getUsuarioAutenticado();
        Gasto gasto = gastoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gasto", id));

        // Un usuario solo puede ver sus propios gastos
        if (!gasto.getUsuario().getId().equals(usuario.getId())) {
            throw new ResourceNotFoundException("Gasto", id);
        }
        return toResponseDTO(gasto);
    }

    // Eliminar

    public void eliminar(Long id) {
        Usuario usuario = getUsuarioAutenticado();

        Gasto gasto = gastoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gasto", id));

        if (!gasto.getUsuario().getId().equals(usuario.getId())) {
            throw new UnauthorizedAccessException("Gasto", id);
        }

        gastoRepository.delete(gasto);
        log.info("Gasto eliminado -> id: {}, usuario: {}", id, usuario.getEmail());
    }

    // Helpers ──────────────────────────────────────────────────────────────

    /**
     * Extrae el email del principal autenticado (cargado por JwtAuthenticationFilter)
     * y lo usa para cargar la entidad Usuario completa desde la BD.
     */
    private Usuario getUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // getName() retorna el username = email

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario autenticado no encontrado: " + email));
    }

    /**
     * Mapea entidad Gasto → GastoResponseDTO.
     * Centralizado para reutilizar en todos los métodos del servicio.
     */
    private GastoResponseDTO toResponseDTO(Gasto gasto) {
        return GastoResponseDTO.builder()
                .id(gasto.getId())
                .monto(gasto.getMonto())
                .descripcion(gasto.getDescripcion())
                .fecha(gasto.getFecha())
                .numeroReferencia(gasto.getNumeroReferencia())
                .fechaRegistro(gasto.getFechaRegistro())
                .usuarioId(gasto.getUsuario().getId())
                .usuarioNombre(gasto.getUsuario().getNombre())
                .categoriaId(gasto.getCategoria().getId())
                .categoriaNombre(gasto.getCategoria().getNombre())
                .build();
    }
}
