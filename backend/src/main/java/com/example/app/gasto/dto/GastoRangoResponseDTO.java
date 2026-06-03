package com.example.app.gasto.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO de salida para GET /api/gastos/por-fecha
 *
 * Incluye la lista de gastos en el rango más un resumen
 * del total para que el cliente no tenga que sumarlo.
 */
@Data
@Builder
public class GastoRangoResponseDTO {

    private LocalDate desde;
    private LocalDate hasta;
    private long cantidad;
    private BigDecimal total;
    private List<GastoResponseDTO> gastos;
}
