package com.example.app.exception;

/**
 * Se lanza cuando un usuario autenticado intenta operar
 * sobre un recurso que no le pertenece.
 * Resulta en HTTP 403 Forbidden.
 */
public class UnauthorizedAccessException extends RuntimeException {

    public UnauthorizedAccessException(String resource, Long id) {
        super("No tiene permisos para acceder a " + resource + " con id: " + id);
    }
}
