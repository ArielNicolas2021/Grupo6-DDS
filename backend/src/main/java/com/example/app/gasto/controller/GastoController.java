package com.example.app.gasto.controller;

import com.example.app.gasto.dto.GastoRequestDTO;
import com.example.app.gasto.dto.GastoUpdateRequestDTO;
import com.example.app.gasto.dto.GastoResponseDTO;
import com.example.app.gasto.service.GastoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para gestión de Gastos.
 *
 * Todos los endpoints requieren autenticación JWT.
 * El usuario se obtiene del token, NO del request body.
 *
 * Header requerido en todos los endpoints:
 *   Authorization: Bearer {token}
 */
@RestController
@RequestMapping("/api/gastos")
@RequiredArgsConstructor
public class GastoController {

    private final GastoService gastoService;

    /**
     * POST /api/gastos
     *
     * Registra un nuevo gasto para el usuario autenticado.
     *
     * Request body:
     * {
     *   "monto": 1500.00,
     *   "descripcion": "Supermercado Día",
     *   "fecha": "2024-05-01",
     *   "categoriaId": 1,
     *   "numeroReferencia": "TKT-0042"   (opcional)
     * }
     *
     * Responses:
     *   201 Created     → gasto guardado correctamente
     *   400 Bad Request → validaciones fallidas (monto <= 0, descripción vacía, etc.)
     *   401 Unauthorized→ token ausente o inválido
     *   404 Not Found   → categoría inexistente
     */
    @PostMapping
    public ResponseEntity<GastoResponseDTO> crear(@Valid @RequestBody GastoRequestDTO request) {
        GastoResponseDTO response = gastoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/gastos
     * Lista todos los gastos del usuario autenticado.
     */
    @GetMapping
    public ResponseEntity<List<GastoResponseDTO>> listar() {
        return ResponseEntity.ok(gastoService.listarPropios());
    }

    /**
     * PUT /api/gastos/{id}
     *
     * Actualiza un gasto existente del usuario autenticado.
     * Solo se modifican los campos enviados (los null se ignoran).
     *
     * Responses:
     *   200 OK          -> gasto actualizado correctamente
     *   400 Bad Request -> validaciones fallidas
     *   401 Unauthorized-> token ausente o invalido
     *   403 Forbidden   -> el gasto pertenece a otro usuario
     *   404 Not Found   -> gasto o categoria inexistente
     */
    @PutMapping("/{id}")
    public ResponseEntity<GastoResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody GastoUpdateRequestDTO request) {
        return ResponseEntity.ok(gastoService.actualizar(id, request));
    }

    /**
     * GET /api/gastos/{id}
     * Obtiene un gasto por ID (solo si pertenece al usuario autenticado).
     */
    @GetMapping("/{id}")
    public ResponseEntity<GastoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(gastoService.buscarPorId(id));
    }
}
