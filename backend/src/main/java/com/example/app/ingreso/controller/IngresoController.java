package com.example.app.ingreso.controller;

import com.example.app.ingreso.dto.IngresoRequestDTO;
import com.example.app.ingreso.dto.IngresoResponseDTO;
import com.example.app.ingreso.dto.IngresoUpdateRequestDTO;
import com.example.app.ingreso.service.IngresoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para gestión de Ingresos.
 *
 * Todos los endpoints requieren autenticación JWT.
 * El usuario se obtiene del token — nunca del request body.
 *
 * Header requerido: Authorization: Bearer {token}
 */
@RestController
@RequestMapping("/api/ingresos")
@RequiredArgsConstructor
public class IngresoController {

    private final IngresoService ingresoService;

    /**
     * POST /api/ingresos
     * Registra un nuevo ingreso para el usuario autenticado.
     *
     * 201 Created      → ingreso guardado correctamente
     * 400 Bad Request  → monto inválido, fecha futura, etc.
     * 401 Unauthorized → token ausente o inválido
     * 404 Not Found    → categoría inexistente
     */
    @PostMapping
    public ResponseEntity<IngresoResponseDTO> crear(@Valid @RequestBody IngresoRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ingresoService.crear(request));
    }

    /**
     * GET /api/ingresos
     * Lista todos los ingresos del usuario autenticado, ordenados por fecha descendente.
     */
    @GetMapping
    public ResponseEntity<List<IngresoResponseDTO>> listar() {
        return ResponseEntity.ok(ingresoService.listarPropios());
    }

    /**
     * GET /api/ingresos/{id}
     * Obtiene un ingreso por ID (solo si pertenece al usuario autenticado).
     */
    @GetMapping("/{id}")
    public ResponseEntity<IngresoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ingresoService.buscarPorId(id));
    }

    /**
     * PUT /api/ingresos/{id}
     * Actualiza un ingreso existente. Solo se modifican los campos enviados.
     *
     * 200 OK       → ingreso actualizado
     * 403 Forbidden→ el ingreso pertenece a otro usuario
     * 404 Not Found→ ingreso o categoría inexistente
     */
    @PutMapping("/{id}")
    public ResponseEntity<IngresoResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody IngresoUpdateRequestDTO request) {
        return ResponseEntity.ok(ingresoService.actualizar(id, request));
    }

    /**
     * DELETE /api/ingresos/{id}
     * Elimina un ingreso del usuario autenticado.
     *
     * 204 No Content → eliminado correctamente
     * 403 Forbidden  → el ingreso pertenece a otro usuario
     * 404 Not Found  → ingreso inexistente
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ingresoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
