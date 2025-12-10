package com.healthpal.api.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

/**
 * AuthResponse DTO - Data Transfer Object for authentication response
 * 
 * This DTO is used to transfer authentication response data from the server to the client
 * It includes the JWT token, user information, and roles
 * 
 * @author HealthPal Team - Person A (Authentication + Admin + Core Architecture)
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;

    private String refreshToken;

    private Long userId;

    private String username;

    private String email;

    private String firstName;

    private String lastName;

    private Boolean isAdmin;

    private Set<String> roles;

    private String message;

    private Boolean success;
}
