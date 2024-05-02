package ca.qc.bdeb.tp1.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ExceptionController {
    @ExceptionHandler(ApiError.class)
    public ResponseEntity<Map<String, Object>> handleApiError(ApiError error) {
        HashMap<String, Object> responseBody = new HashMap<>();
        responseBody.put("code", error.getCode());
        responseBody.put("message", error.getMessage());
        responseBody.put("reason", error.getReason());

        error.printStackTrace();

        return ResponseEntity.status(error.getStatus()).body(responseBody);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleIOException(Exception ex) {
        ex.printStackTrace();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }
}
