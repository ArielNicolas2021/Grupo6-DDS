package com.example.app.ingreso.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO de salida para operaciones sobre Ingreso.
 * Nunca expone la entidad directamente ni datos sensibles del usuario.
 */
@Data
@Builder
public class IngresoResponseDTO {

    private Long id;
    private BigDecimal monto;
    private String descripcion;
    private LocalDate fecha;
    private String fuente;
    private LocalDateTime fechaRegistro;

    private Long usuarioId;
    private String usuarioNombre;

    private Long categoriaId;
    private String categoriaNombre;
}
