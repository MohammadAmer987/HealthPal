package com.healthpal.api.service;

import com.healthpal.api.model.User;
import com.healthpal.api.model.Role;
import com.healthpal.api.model.dto.SignUpRequest;
import com.healthpal.api.model.dto.LoginRequest;
import com.healthpal.api.model.dto.AuthResponse;
import com.healthpal.api.repository.UserRepository;
import com.healthpal.api.repository.RoleRepository;
import com.healthpal.api.util.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * AuthService - Business Logic Layer for Authentication
 * 
 * This service is part of the MVC Layered Architecture (Service/Business Logic Layer)
 * It handles:
 * - User registration (sign up)
 * - User login
 * - Token generation and validation
 * - User role assignment
 * 
 * @author HealthPal Team - Person A (Authentication + Admin + Core Architecture)
 * @version 1.0
 */
@Slf4j
@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Register a new user
     * @param signUpRequest The registration request containing user details
     * @return AuthResponse with success status and message
     * @throws RuntimeException if username or email already exists, or passwords don't match
     */
    public AuthResponse signUp(SignUpRequest signUpRequest) {
        log.info("Attempting to register user with username: {}", signUpRequest.getUsername());

        // Validate that passwords match
        if (!signUpRequest.getPassword().equals(signUpRequest.getConfirmPassword())) {
            log.warn("Password mismatch for user: {}", signUpRequest.getUsername());
            throw new RuntimeException("Passwords do not match");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            log.warn("Username already exists: {}", signUpRequest.getUsername());
            throw new RuntimeException("Username is already taken");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            log.warn("Email already exists: {}", signUpRequest.getEmail());
            throw new RuntimeException("Email is already registered");
        }

        // Create new user
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .firstName(signUpRequest.getFirstName())
                .lastName(signUpRequest.getLastName())
                .phoneNumber(signUpRequest.getPhoneNumber())
                .isActive(true)
                .isEmailVerified(false)
                .isPhoneVerified(false)
                .isAdmin(false)
                .build();

        // Assign default role based on user type
        String userType = signUpRequest.getUserType().toUpperCase();
        String roleName = "ROLE_" + userType;

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.addRole(role);

        // Save user to database
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getUsername());

        return AuthResponse.builder()
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .success(true)
                .message("User registered successfully. Please verify your email.")
                .build();
    }

    /**
     * Authenticate user and generate JWT token
     * @param loginRequest The login request containing username/email and password
     * @return AuthResponse with JWT token and user information
     * @throws RuntimeException if authentication fails
     */
    public AuthResponse login(LoginRequest loginRequest) {
        log.info("Attempting to login user: {}", loginRequest.getUsernameOrEmail());

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsernameOrEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authentication.getName());

            // Get user details
            User user = userRepository.findByUsernameOrEmail(
                    loginRequest.getUsernameOrEmail(),
                    loginRequest.getUsernameOrEmail()
            ).orElseThrow(() -> new RuntimeException("User not found"));

            // Update last login time
            user.setLastLoginAt(java.time.LocalDateTime.now());
            userRepository.save(user);

            // Extract roles
            Set<String> roles = user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toSet());

            log.info("User logged in successfully: {}", user.getUsername());

            return AuthResponse.builder()
                    .token(token)
                    .refreshToken(refreshToken)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .isAdmin(user.getIsAdmin())
                    .roles(roles)
                    .success(true)
                    .message("Login successful")
                    .build();

        } catch (Exception e) {
            log.error("Login failed for user: {}", loginRequest.getUsernameOrEmail(), e);
            throw new RuntimeException("Invalid username or password");
        }
    }

    /**
     * Refresh JWT token
     * @param refreshToken The refresh token
     * @return AuthResponse with new JWT token
     * @throws RuntimeException if refresh token is invalid
     */
    public AuthResponse refreshToken(String refreshToken) {
        log.info("Attempting to refresh token");

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            log.warn("Invalid refresh token");
            throw new RuntimeException("Invalid refresh token");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        String newToken = jwtTokenProvider.generateTokenFromUsername(username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        log.info("Token refreshed successfully for user: {}", username);

        return AuthResponse.builder()
                .token(newToken)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .success(true)
                .message("Token refreshed successfully")
                .build();
    }

    /**
     * Get current authenticated user
     * @return User object of the current authenticated user
     * @throws RuntimeException if no user is authenticated
     */
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }
}
