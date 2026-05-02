package com.example.app.exception;

import com.example.app.auth.dto.ApiErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Manejador global de excepciones.
 * Intercepta las excepciones lanzadas en cualquier Controller
 * y devuelve respuestas HTTP consistentes con ApiErrorResponseDTO.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 409 Conflict — email duplicado.
     */
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleEmailAlreadyExists(
            EmailAlreadyExistsException ex, HttpServletRequest request) {

        return ResponseEntity.status(HttpStatus.CONFLICT).body(
            ApiErrorResponseDTO.builder()
                .status(HttpStatus.CONFLICT.value())
                .error("Conflict")
                .mensaje(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build()
        );
    }

    /**
     * 400 Bad Request — errores de validación de @Valid.
     * Recopila TODOS los campos inválidos en una lista legible.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleValidationErrors(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        List<String> detalles = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .toList();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ApiErrorResponseDTO.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Bad Request")
                .mensaje("Error de validación en los datos enviados")
                .detalles(detalles)
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build()
        );
    }

    /**
     * 400 Bad Request — argumentos ilegales generales.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleIllegalArgument(
            IllegalArgumentException ex, HttpServletRequest request) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ApiErrorResponseDTO.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Bad Request")
                .mensaje(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build()
        );
    }

    /**
     * 401 Unauthorized — credenciales inválidas en el login.
     */
    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleBadCredentials(
            RuntimeException ex, HttpServletRequest request) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            ApiErrorResponseDTO.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .error("Unauthorized")
                .mensaje("Credenciales inválidas")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build()
        );
    }

    /**
     * 500 Internal Server Error — cualquier excepción no controlada.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponseDTO> handleGeneral(
            Exception ex, HttpServletRequest request) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ApiErrorResponseDTO.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .mensaje("Ocurrió un error inesperado. Intente nuevamente.")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build()
        );
    }
}
