package ca.qc.bdeb.tp1.controller;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.io.IOException;

@Getter
public class ApiError extends IOException {
    private final String code;
    private final String message;
    private final String reason;
    private final HttpStatus status;

    public ApiError(String code, String message, String reason, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.reason = reason;
        this.status = status;
    }

    public ApiError(String code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.reason = "None provided";
        this.status = status;
    }
}
