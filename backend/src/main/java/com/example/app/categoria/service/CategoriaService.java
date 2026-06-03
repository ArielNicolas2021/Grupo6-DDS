package com.example.app.categoria.service;

import com.example.app.categoria.dto.CategoriaRequestDTO;
import com.example.app.categoria.dto.CategoriaResponseDTO;
import com.example.app.exception.EmailAlreadyExistsException;
import com.example.app.exception.ResourceNotFoundException;
import com.example.app.exception.UnauthorizedAccessException;
import com.example.app.models.Categoria;
import com.example.app.models.Usuario;
import com.example.app.repositories.CategoriaRepository;
import com.example.app.repositories.GastoRepository;
import com.example.app.repositories.IngresoRepository;
import com.example.app.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio de negocio para Categorías personales.
 *
 * Flujo de creación:
 *   1. Obtener usuario autenticado del SecurityContext
 *   2. Verificar que no exista ya una categoría con ese nombre (global o personal)
 *   3. Crear y persistir la categoría asociada al usuario
 *   4. Retornar DTO
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final GastoRepository gastoRepository;
    private final IngresoRepository ingresoRepository;

    // ── Crear ────────────────────────────────────────────────────────────────

    public CategoriaResponseDTO crear(CategoriaRequestDTO request) {
        Usuario usuario = getUsuarioAutenticado();

        // Verificar duplicado: el usuario no puede crear una categoría
        // si ya existe una global o propia con el mismo nombre
        if (categoriaRepository.existsByNombreForUsuario(request.getNombre(), usuario.getId())) {
            log.warn("Categoria duplicada → nombre: '{}', usuario: {}",
                    request.getNombre(), usuario.getEmail());
            throw new CategoriaYaExisteException(request.getNombre());
        }

        Categoria categoria = Categoria.builder()
                .nombre(capitalizar(request.getNombre()))
                .descripcion(request.getDescripcion())
                .tipo(request.getTipo())
                .activa(true)
                .usuario(usuario)   // <- asociada al usuario, no es global
                .build();

        Categoria guardada = categoriaRepository.save(categoria);
        log.info("Categoria creada → id: {}, nombre: '{}', usuario: {}",
                guardada.getId(), guardada.getNombre(), usuario.getEmail());

        return toResponseDTO(guardada);
    }

    // ── Listar ───────────────────────────────────────────────────────────────

    /**
     * Devuelve todas las categorías disponibles para el usuario:
     * sus categorías personales + las globales del sistema.
     */
    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> listarDisponibles() {
        Usuario usuario = getUsuarioAutenticado();
        return categoriaRepository.findCategoriasDisponibles(usuario.getId())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // ── Eliminar ─────────────────────────────────────────────────────────────

    public void eliminar(Long id) {
        Usuario usuario = getUsuarioAutenticado();

        // 1. Verificar existencia
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", id));

        // 2. No se pueden eliminar categorias globales del sistema
        if (categoria.getUsuario() == null) {
            throw new UnauthorizedAccessException("Categoria global del sistema", id);
        }

        // 3. Solo el duenio puede eliminarla
        if (!categoria.getUsuario().getId().equals(usuario.getId())) {
            throw new UnauthorizedAccessException("Categoria", id);
        }

        // 4. Verificar si tiene gastos o ingresos asociados
        long totalGastos   = gastoRepository.countByCategoriaId(id);
        long totalIngresos = ingresoRepository.countByCategoriaId(id);

        if (totalGastos > 0 || totalIngresos > 0) {
            throw new CategoriaConMovimientosException(id, totalGastos, totalIngresos);
        }

        // 5. Eliminar
        categoriaRepository.delete(categoria);
        log.info("Categoria eliminada -> id: {}, usuario: {}", id, usuario.getEmail());
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario autenticado no encontrado: " + email));
    }

    private String capitalizar(String texto) {
        if (texto == null || texto.isBlank()) return texto;
        String trimmed = texto.trim();
        return Character.toUpperCase(trimmed.charAt(0)) + trimmed.substring(1).toLowerCase();
    }

    private CategoriaResponseDTO toResponseDTO(Categoria c) {
        return CategoriaResponseDTO.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .descripcion(c.getDescripcion())
                .tipo(c.getTipo())
                .activa(c.getActiva())
                .esGlobal(c.getUsuario() == null)
                .build();
    }

    // ── Excepción interna ─────────────────────────────────────────────────────

    /**
     * Excepción específica para categoría duplicada → HTTP 409 Conflict.
     * Se declara aquí por ser exclusiva de este dominio.
     */
    public static class CategoriaYaExisteException extends RuntimeException {
        public CategoriaYaExisteException(String nombre) {
            super("Ya existe una categoría con el nombre: '" + nombre + "'");
        }
    }

    /**
     * 409 Conflict - la categoria tiene gastos o ingresos asociados.
     * Se elige Opcion 1: no permitir eliminar (mas seguro que perder referencias).
     */
    public static class CategoriaConMovimientosException extends RuntimeException {
        public CategoriaConMovimientosException(Long id, long gastos, long ingresos) {
            super(String.format(
                "No se puede eliminar la categoria %d porque tiene %d gasto(s) y %d ingreso(s) asociados. " +
                "Reasigna o elimina esos movimientos primero.", id, gastos, ingresos));
        }
    }
}
