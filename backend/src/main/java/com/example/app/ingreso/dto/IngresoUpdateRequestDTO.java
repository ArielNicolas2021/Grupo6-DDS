package com.example.app.ingreso.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO de entrada para PUT /api/ingresos/{id}
 * Todos los campos son opcionales — solo se actualizan los que vienen con valor.
 */
@Data
public class IngresoUpdateRequestDTO {

    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    @Digits(integer = 13, fraction = 2, message = "Formato de monto inválido")
    private BigDecimal monto;

    @Size(min = 1, max = 300, message = "La descripción debe tener entre 1 y 300 caracteres")
    private String descripcion;

    @PastOrPresent(message = "La fecha no puede ser futura")
    private LocalDate fecha;

    private Long categoriaId;

    @Size(max = 150, message = "La fuente no puede superar 150 caracteres")
    private String fuente;
}
