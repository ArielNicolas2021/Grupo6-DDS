package com.example.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuración de Spring Security.
 *
 * Política actual (base para futuro JWT):
 *  - /auth/**       → público (registro, login)
 *  - /h2-console/** → público (solo desarrollo)
 *  - /api/**        → protegido (requiere autenticación)
 *  - Sesiones deshabilitadas (stateless — preparado para JWT)
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF (API REST stateless no lo necesita)
            .csrf(AbstractHttpConfigurer::disable)

            // Política de sesiones: STATELESS (sin HttpSession)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Reglas de autorización
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos de autenticación
                .requestMatchers("/auth/**").permitAll()
                // Consola H2 (solo desarrollo — remover en producción)
                .requestMatchers("/h2-console/**").permitAll()
                // Health check
                .requestMatchers("/api/health").permitAll()
                // Todo lo demás requiere autenticación
                .anyRequest().authenticated()
            )

            // Permitir frames de H2 console (solo desarrollo)
            .headers(headers ->
                headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }

    /**
     * Bean de BCryptPasswordEncoder.
     * Inyectado en AuthService para hashear contraseñas.
     * BCrypt aplica salt automático y es resistente a ataques de fuerza bruta.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
