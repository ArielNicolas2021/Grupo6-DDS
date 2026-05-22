package com.example.app.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO de salida para el endpoint POST /auth/register.
 * NUNCA incluye la contraseña (ni hasheada).
 */
@Data
@Builder
public class RegisterResponseDTO {

    private Long id;
    private String nombre;
    private String email;
    private LocalDateTime fechaRegistro;
    private String mensaje;
}
