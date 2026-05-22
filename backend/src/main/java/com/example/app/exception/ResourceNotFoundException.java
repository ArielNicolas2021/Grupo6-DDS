package com.example.app.exception;

/**
 * Se lanza cuando un recurso no es encontrado en la BD.
 * Resulta en HTTP 404 Not Found.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " no encontrado con id: " + id);
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
