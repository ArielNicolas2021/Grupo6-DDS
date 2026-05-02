package com.example.app.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

/**
 * DTO de salida para POST /auth/login
 * Contiene el token JWT y metadata útil para el cliente.
 */
@Data
@Builder
public class LoginResponseDTO {

    private String token;

    /** Siempre "Bearer" — el cliente lo usa como prefijo en el header. */
    private String tipo;

    private String email;
    private Long userId;

    /** Fecha exacta de vencimiento del token. */
    private Date expiracion;
}
