package com.example.app.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO de entrada para el endpoint POST /auth/register.
 * Las anotaciones de validación son procesadas por @Valid en el Controller.
 */
@Data
public class RegisterRequestDTO {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email no es válido")
    private String email;

    /**
     * Reglas de seguridad básicas:
     *  - Mínimo 8 caracteres
     *  - Al menos una letra mayúscula
     *  - Al menos una letra minúscula
     *  - Al menos un número
     *  - Al menos un carácter especial
     */
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&._-])[A-Za-z\\d@$!%*?&._-]{8,}$",
        message = "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&._-)"
    )
    private String password;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
}
