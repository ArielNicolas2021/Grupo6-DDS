package com.example.app.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO de salida para GET /api/dashboard/balance
 *
 * Expone el resumen financiero del usuario autenticado:
 *   balance = totalIngresos - totalGastos
 */
@Data
@Builder
public class BalanceResponseDTO {

    private BigDecimal totalIngresos;
    private BigDecimal totalGastos;

    /** Balance neto. Positivo = superávit. Negativo = déficit. */
    private BigDecimal balance;

    /** Cantidad de movimientos considerados en el cálculo. */
    private long cantidadIngresos;
    private long cantidadGastos;
}
