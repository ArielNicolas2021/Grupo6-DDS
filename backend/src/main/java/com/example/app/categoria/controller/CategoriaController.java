package com.example.app.categoria.controller;

import com.example.app.categoria.dto.CategoriaRequestDTO;
import com.example.app.categoria.dto.CategoriaResponseDTO;
import com.example.app.categoria.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para gestión de Categorías.
 * Todos los endpoints requieren autenticación JWT.
 *
 * Header requerido: Authorization: Bearer {token}
 */
@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    /**
     * POST /api/categorias
     * Crea una nueva categoría personal para el usuario autenticado.
     *
     * 201 Created      → categoría creada correctamente
     * 400 Bad Request  → nombre vacío o tipo inválido
     * 401 Unauthorized → token ausente o inválido
     * 409 Conflict     → ya existe una categoría con ese nombre
     */
    @PostMapping
    public ResponseEntity<CategoriaResponseDTO> crear(
            @Valid @RequestBody CategoriaRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoriaService.crear(request));
    }

    /**
     * GET /api/categorias
     * Lista todas las categorías disponibles para el usuario:
     * sus categorías personales + las globales del sistema.
     */
    @GetMapping
    public ResponseEntity<List<CategoriaResponseDTO>> listar() {
        return ResponseEntity.ok(categoriaService.listarDisponibles());
    }

    /**
     * DELETE /api/categorias/{id}
     * Elimina una categoría personal (no se pueden eliminar las globales).
     *
     * 204 No Content   → eliminada correctamente
     * 401 Unauthorized → token ausente o inválido
     * 403 Forbidden    → intento de eliminar una categoría global o de otro usuario
     * 404 Not Found    → categoría inexistente
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
