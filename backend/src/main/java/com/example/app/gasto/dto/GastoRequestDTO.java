package com.example.app.gasto.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO de entrada para POST /gastos
 *
 * IMPORTANTE: el usuario NO viene en este DTO.
 * Se obtiene del SecurityContext (token JWT) en el Service.
 */
@Data
public class GastoRequestDTO {

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    @Digits(integer = 13, fraction = 2, message = "Formato de monto inválido")
    private BigDecimal monto;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 300, message = "La descripción no puede superar 300 caracteres")
    private String descripcion;

    @NotNull(message = "La fecha es obligatoria")
    @PastOrPresent(message = "La fecha no puede ser futura")
    private LocalDate fecha;

    @NotNull(message = "La categoría es obligatoria")
    private Long categoriaId;

    private String numeroReferencia;
}
