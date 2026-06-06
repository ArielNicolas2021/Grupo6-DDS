package com.example.app.ingreso.service;

import com.example.app.exception.ResourceNotFoundException;
import com.example.app.exception.UnauthorizedAccessException;
import com.example.app.ingreso.dto.IngresoRequestDTO;
import com.example.app.ingreso.dto.IngresoResponseDTO;
import com.example.app.ingreso.dto.IngresoUpdateRequestDTO;
import com.example.app.models.Categoria;
import com.example.app.models.Ingreso;
import com.example.app.models.Usuario;
import com.example.app.repositories.CategoriaRepository;
import com.example.app.repositories.IngresoRepository;
import com.example.app.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class IngresoService {

    private final IngresoRepository ingresoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;

    // ── Crear ────────────────────────────────────────────────────────────────

    public IngresoResponseDTO crear(IngresoRequestDTO request) {
        Usuario usuario = getUsuarioAutenticado();

        // Validar que la categoría exista
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria", request.getCategoriaId()));

        Ingreso ingreso = Ingreso.builder()
                .monto(request.getMonto())
                .descripcion(request.getDescripcion())
                .fecha(request.getFecha())
                .fuente(request.getFuente())
                .usuario(usuario)       // ← se obtiene del JWT, no del request
                .categoria(categoria)   // ← se valida que exista
                .build();

        Ingreso guardado = ingresoRepository.save(ingreso);
        log.info("Ingreso creado → id: {}, monto: {}, usuario: {}",
                guardado.getId(), guardado.getMonto(), usuario.getEmail());

        return toResponseDTO(guardado);
    }

    // ── Listar ───────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<IngresoResponseDTO> listarPropios() {
        Usuario usuario = getUsuarioAutenticado();
        return ingresoRepository.findByUsuarioIdOrderByFechaDesc(usuario.getId())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // ── Buscar por ID ────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public IngresoResponseDTO buscarPorId(Long id) {
        Usuario usuario = getUsuarioAutenticado();

        Ingreso ingreso = ingresoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingreso", id));

        if (!ingreso.getUsuario().getId().equals(usuario.getId())) {
            throw new ResourceNotFoundException("Ingreso", id);
        }

        return toResponseDTO(ingreso);
    }

    // ── Actualizar ───────────────────────────────────────────────────────────

    public IngresoResponseDTO actualizar(Long id, IngresoUpdateRequestDTO request) {
        Usuario usuario = getUsuarioAutenticado();

        Ingreso ingreso = ingresoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingreso", id));

        if (!ingreso.getUsuario().getId().equals(usuario.getId())) {
            throw new UnauthorizedAccessException("Ingreso", id);
        }

        // Solo actualizar campos enviados (no sobreescribir con null)
        if (request.getMonto() != null)       ingreso.setMonto(request.getMonto());
        if (request.getDescripcion() != null) ingreso.setDescripcion(request.getDescripcion());
        if (request.getFecha() != null)       ingreso.setFecha(request.getFecha());
        if (request.getFuente() != null)      ingreso.setFuente(request.getFuente());
        if (request.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Categoria", request.getCategoriaId()));
            ingreso.setCategoria(categoria);
        }

        Ingreso actualizado = ingresoRepository.save(ingreso);
        log.info("Ingreso actualizado → id: {}, usuario: {}", actualizado.getId(), usuario.getEmail());

        return toResponseDTO(actualizado);
    }

    // ── Eliminar ─────────────────────────────────────────────────────────────

    public void eliminar(Long id) {
        Usuario usuario = getUsuarioAutenticado();

        Ingreso ingreso = ingresoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingreso", id));

        if (!ingreso.getUsuario().getId().equals(usuario.getId())) {
            throw new UnauthorizedAccessException("Ingreso", id);
        }

        ingresoRepository.delete(ingreso);
        log.info("Ingreso eliminado → id: {}, usuario: {}", id, usuario.getEmail());
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario autenticado no encontrado: " + email));
    }

    private IngresoResponseDTO toResponseDTO(Ingreso ingreso) {
        return IngresoResponseDTO.builder()
                .id(ingreso.getId())
                .monto(ingreso.getMonto())
                .descripcion(ingreso.getDescripcion())
                .fecha(ingreso.getFecha())
                .fuente(ingreso.getFuente())
                .fechaRegistro(ingreso.getFechaRegistro())
                .usuarioId(ingreso.getUsuario().getId())
                .usuarioNombre(ingreso.getUsuario().getNombre())
                .categoriaId(ingreso.getCategoria().getId())
                .categoriaNombre(ingreso.getCategoria().getNombre())
                .build();
    }
}
