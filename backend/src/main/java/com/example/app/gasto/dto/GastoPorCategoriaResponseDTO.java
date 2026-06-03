package com.example.app.gasto.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO de salida para GET /api/gastos/categoria/{categoriaId}
 *
 * Incluye la lista de gastos de esa categoría más un resumen
 * con el total acumulado, evitando que el cliente tenga que calcularlo.
 */
@Data
@Builder
public class GastoPorCategoriaResponseDTO {

    private Long categoriaId;
    private String categoriaNombre;
    private long cantidad;
    private BigDecimal total;
    private List<GastoResponseDTO> gastos;
}
