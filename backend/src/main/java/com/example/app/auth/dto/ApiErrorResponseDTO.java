package com.example.app.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO estándar para todas las respuestas de error de la API.
 * Garantiza un formato consistente en todos los endpoints.
 */
@Data
@Builder
public class ApiErrorResponseDTO {

    private int status;
    private String error;
    private String mensaje;
    private List<String> detalles;   // lista de errores de validación (puede ser null)
    private LocalDateTime timestamp;
    private String path;
}
