package com.healthpal.api.controller;

import com.healthpal.api.model.dto.SignUpRequest;
import com.healthpal.api.model.dto.LoginRequest;
import com.healthpal.api.model.dto.AuthResponse;
import com.healthpal.api.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - REST API Controller for Authentication
 * 
 * This controller is part of the MVC Layered Architecture (Controller/Presentation Layer)
 * It handles HTTP requests related to:
 * - User registration (sign up)
 * - User login
 * - Token refresh
 * 
 * Base URL: /api/auth
 * 
 * @author HealthPal Team - Person A (Authentication + Admin + Core Architecture)
 * @version 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Register a new user
     * 
     * @param signUpRequest The registration request containing user details
     * @return ResponseEntity with AuthResponse containing user information
     * 
     * Example Request:
     * POST /api/auth/signup
     * {
     *   "username": "john_doe",
     *   "email": "john@example.com",
     *   "password": "SecurePassword123",
     *   "confirmPassword": "SecurePassword123",
     *   "firstName": "John",
     *   "lastName": "Doe",
     *   "phoneNumber": "+1234567890",
     *   "userType": "PATIENT"
     * }
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        log.info("Received sign up request for user: {}", signUpRequest.getUsername());

        try {
            AuthResponse response = authService.signUp(signUpRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Sign up failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(AuthResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        }
    }

    /**
     * Login user
     * 
     * @param loginRequest The login request containing username/email and password
     * @return ResponseEntity with AuthResponse containing JWT token and user information
     * 
     * Example Request:
     * POST /api/auth/login
     * {
     *   "usernameOrEmail": "john_doe",
     *   "password": "SecurePassword123"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Received login request for user: {}", loginRequest.getUsernameOrEmail());

        try {
            AuthResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        }
    }

    /**
     * Refresh JWT token
     * 
     * @param refreshToken The refresh token
     * @return ResponseEntity with AuthResponse containing new JWT token
     * 
     * Example Request:
     * POST /api/auth/refresh-token
     * {
     *   "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
     * }
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody String refreshToken) {
        log.info("Received token refresh request");

        try {
            AuthResponse response = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        }
    }

    /**
     * Health check endpoint
     * 
     * @return ResponseEntity with success message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Authentication service is running");
    }
}
