package com.example.app.auth.service;

import com.example.app.auth.dto.RegisterRequestDTO;
import com.example.app.auth.dto.RegisterResponseDTO;
import com.example.app.exception.EmailAlreadyExistsException;
import com.example.app.models.Usuario;
import com.example.app.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio de autenticación.
 * Contiene la lógica de negocio para registro (y en el futuro, login).
 *
 * Flujo de registro:
 *   1. Verificar que el email no esté registrado → 409 si existe
 *   2. Hashear la contraseña con BCrypt
 *   3. Persistir el nuevo Usuario
 *   4. Retornar RegisterResponseDTO (sin contraseña)
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param request DTO con email, password y nombre ya validados por @Valid
     * @return DTO de respuesta con datos básicos del usuario creado
     * @throws EmailAlreadyExistsException si el email ya está registrado (HTTP 409)
     */
    public RegisterResponseDTO register(RegisterRequestDTO request) {

        log.debug("Intentando registrar usuario con email: {}", request.getEmail());

        // 1. Verificar unicidad del email
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            log.warn("Registro rechazado: email ya existente → {}", request.getEmail());
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        // 2. Hashear la contraseña con BCrypt (nunca guardar en texto plano)
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // 3. Construir y persistir la entidad
        Usuario nuevoUsuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail().toLowerCase().trim())
                .password(hashedPassword)
                .activo(true)
                .build();

        Usuario guardado = usuarioRepository.save(nuevoUsuario);
        log.info("Usuario registrado exitosamente → id: {}, email: {}", guardado.getId(), guardado.getEmail());

        // 4. Mapear a DTO de respuesta (sin contraseña)
        return RegisterResponseDTO.builder()
                .id(guardado.getId())
                .nombre(guardado.getNombre())
                .email(guardado.getEmail())
                .fechaRegistro(guardado.getFechaRegistro())
                .mensaje("Usuario registrado exitosamente")
                .build();
    }
}
