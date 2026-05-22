package com.example.app.auth.controller;

import com.example.app.auth.dto.LoginRequestDTO;
import com.example.app.auth.dto.LoginResponseDTO;
import com.example.app.auth.dto.RegisterRequestDTO;
import com.example.app.auth.dto.RegisterResponseDTO;
import com.example.app.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /auth/register
     * Registra un nuevo usuario.
     * 201 Created  -> registro exitoso
     * 400          -> validaciones fallidas
     * 409          -> email ya registrado
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    /**
     * POST /auth/login
     * Autentica un usuario y devuelve un JWT.
     * 200 OK       -> credenciales correctas, retorna token
     * 400          -> request inválido (campos faltantes/mal formato)
     * 401          -> credenciales incorrectas
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
