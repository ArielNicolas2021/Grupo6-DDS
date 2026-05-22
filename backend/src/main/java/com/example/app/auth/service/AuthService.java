package com.example.app.auth.service;

import com.example.app.auth.dto.LoginRequestDTO;
import com.example.app.auth.dto.LoginResponseDTO;
import com.example.app.auth.dto.RegisterRequestDTO;
import com.example.app.auth.dto.RegisterResponseDTO;
import com.example.app.exception.EmailAlreadyExistsException;
import com.example.app.models.Usuario;
import com.example.app.repositories.UsuarioRepository;
import com.example.app.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public RegisterResponseDTO register(RegisterRequestDTO request) {
        log.debug("Intentando registrar usuario con email: {}", request.getEmail());

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            log.warn("Registro rechazado: email ya existente -> {}", request.getEmail());
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        Usuario nuevoUsuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail().toLowerCase().trim())
                .password(hashedPassword)
                .activo(true)
                .build();

        Usuario guardado = usuarioRepository.save(nuevoUsuario);
        log.info("Usuario registrado -> id: {}, email: {}", guardado.getId(), guardado.getEmail());

        return RegisterResponseDTO.builder()
                .id(guardado.getId())
                .nombre(guardado.getNombre())
                .email(guardado.getEmail())
                .fechaRegistro(guardado.getFechaRegistro())
                .mensaje("Usuario registrado exitosamente")
                .build();
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO request) {
        log.debug("Intento de login para email: {}", request.getEmail());

        // Email no encontrado y password incorrecta devuelven el mismo error
        // para no revelar si el email existe en el sistema
        Usuario usuario = usuarioRepository
                .findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> {
                    log.warn("Login fallido: email no encontrado -> {}", request.getEmail());
                    return new BadCredentialsException("Credenciales invalidas");
                });

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            log.warn("Login fallido: password incorrecta para -> {}", request.getEmail());
            throw new BadCredentialsException("Credenciales invalidas");
        }

        if (!usuario.getActivo()) {
            log.warn("Login fallido: usuario inactivo -> {}", request.getEmail());
            throw new BadCredentialsException("Credenciales invalidas");
        }

        String token = jwtTokenProvider.generateToken(usuario.getId(), usuario.getEmail());
        log.info("Login exitoso -> id: {}, email: {}", usuario.getId(), usuario.getEmail());

        return LoginResponseDTO.builder()
                .token(token)
                .tipo("Bearer")
                .email(usuario.getEmail())
                .userId(usuario.getId())
                .expiracion(jwtTokenProvider.getExpirationFromToken(token))
                .build();
    }
}
