package com.example.app.gasto.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO de salida para operaciones sobre Gasto.
 * Nunca expone la entidad directamente ni datos sensibles del usuario.
 */
@Data
@Builder
public class GastoResponseDTO {

    private Long id;
    private BigDecimal monto;
    private String descripcion;
    private LocalDate fecha;
    private String numeroReferencia;
    private LocalDateTime fechaRegistro;

    // Datos resumidos de relaciones (evita exponer entidades completas)
    private Long usuarioId;
    private String usuarioNombre;

    private Long categoriaId;
    private String categoriaNombre;
}
