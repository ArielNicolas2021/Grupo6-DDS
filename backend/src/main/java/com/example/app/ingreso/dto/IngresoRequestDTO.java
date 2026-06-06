package com.example.app.ingreso.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO de entrada para POST /api/ingresos
 * El usuario NO viene en este DTO — se obtiene del token JWT en el Service.
 */
@Data
public class IngresoRequestDTO {

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    @Digits(integer = 13, fraction = 2, message = "Formato de monto inválido")
    private BigDecimal monto;

    @NotNull(message = "La fecha es obligatoria")
    @PastOrPresent(message = "La fecha no puede ser futura")
    private LocalDate fecha;

    @Size(max = 300, message = "La descripción no puede superar 300 caracteres")
    private String descripcion;

    @NotNull(message = "La categoría es obligatoria")
    private Long categoriaId;

    @Size(max = 150, message = "La fuente no puede superar 150 caracteres")
    private String fuente;
}
