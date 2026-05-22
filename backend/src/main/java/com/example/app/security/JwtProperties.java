package com.example.app.security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Mapea las propiedades app.jwt.* del application.properties.
 * Centraliza toda la config JWT en un solo lugar.
 */
@Component
@ConfigurationProperties(prefix = "app.jwt")
@Data
public class JwtProperties {

    /** Clave secreta Base64 para firmar el token. */
    private String secret;

    /** Tiempo de vida del token en milisegundos (default: 24hs). */
    private long expiration = 86400000L;

    /** Prefijo del header: "Bearer". */
    private String tokenPrefix = "Bearer";

    /** Nombre del header HTTP: "Authorization". */
    private String headerName = "Authorization";
}
