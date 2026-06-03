package com.example.app.dashboard.controller;

import com.example.app.dashboard.dto.BalanceResponseDTO;
import com.example.app.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller del dashboard financiero.
 * Todos los endpoints requieren autenticación JWT.
 *
 * Header requerido: Authorization: Bearer {token}
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * GET /api/dashboard/balance
     *
     * Retorna el balance financiero del usuario autenticado.
     *   balance = totalIngresos - totalGastos
     *
     * 200 OK           → balance calculado correctamente
     * 401 Unauthorized → token ausente o inválido
     */
    @GetMapping("/balance")
    public ResponseEntity<BalanceResponseDTO> balance() {
        return ResponseEntity.ok(dashboardService.calcularBalance());
    }
}
