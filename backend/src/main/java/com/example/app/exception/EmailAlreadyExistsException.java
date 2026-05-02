package com.example.app.exception;

/**
 * Se lanza cuando se intenta registrar un email que ya existe en la BD.
 * Resulta en HTTP 409 Conflict.
 */
public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String email) {
        super("El email ya está registrado: " + email);
    }
}
