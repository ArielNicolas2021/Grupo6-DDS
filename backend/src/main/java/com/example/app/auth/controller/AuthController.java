package com.example.app.auth.controller;

import com.example.app.auth.dto.RegisterRequestDTO;
import com.example.app.auth.dto.RegisterResponseDTO;
import com.example.app.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador de autenticación.
 * Expone los endpoints públicos de auth (registro, y en el futuro login).
 *
 * Todos los endpoints bajo /auth son públicos (configurado en SecurityConfig).
 * El manejo de errores de validación y negocio está centralizado en GlobalExceptionHandler.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /auth/register
     *
     * Registra un nuevo usuario en el sistema.
     *
     * Request body:
     * {
     *   "nombre": "Juan Pérez",
     *   "email": "juan@example.com",
     *   "password": "Segura@123"
     * }
     *
     * Responses:
     *   201 Created       → registro exitoso
     *   400 Bad Request   → validaciones fallidas
     *   409 Conflict      → email ya registrado
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        RegisterResponseDTO response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
