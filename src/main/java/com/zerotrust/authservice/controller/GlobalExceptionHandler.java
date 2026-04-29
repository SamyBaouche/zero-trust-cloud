package com.zerotrust.authservice.controller;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * GlobalExceptionHandler centralizes error handling for all controllers.
 * <p>
 * Instead of returning raw stack traces, we convert exceptions into simple HTTP responses
 * that the frontend can understand.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** Returns HTTP 409 (Conflict) when the database rejects an insert/update (example: duplicate email). */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use");
    }

    /** Catch-all mapping for validation/business errors in this project. */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage();
        if (message != null && message.toLowerCase().contains("already")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(message != null ? message : "Request failed");
    }
}


