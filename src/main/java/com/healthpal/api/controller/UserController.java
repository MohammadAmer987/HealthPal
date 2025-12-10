package com.healthpal.api.controller;

import com.healthpal.api.model.User;
import com.healthpal.api.service.UserService;
import com.healthpal.api.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * UserController - REST API Controller for User Management
 * 
 * This controller is part of the MVC Layered Architecture (Controller/Presentation Layer)
 * It handles HTTP requests related to:
 * - User profile management
 * - User role assignment
 * - User activation/deactivation
 * - User data retrieval
 * 
 * Base URL: /api/users
 * 
 * @author HealthPal Team - Person A (Authentication + Admin + Core Architecture)
 * @version 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    /**
     * Get current authenticated user profile
     * 
     * @return ResponseEntity with current user information
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getCurrentUser() {
        log.info("Fetching current user profile");

        try {
            User currentUser = authService.getCurrentUser();
            return ResponseEntity.ok(currentUser);
        } catch (Exception e) {
            log.error("Error fetching current user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Get user by ID
     * 
     * @param userId The ID of the user to fetch
     * @return ResponseEntity with user information
     */
    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        log.info("Fetching user with ID: {}", userId);

        Optional<User> user = userService.getUserById(userId);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Get user by username
     * 
     * @param username The username to search for
     * @return ResponseEntity with user information
     */
    @GetMapping("/username/{username}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        log.info("Fetching user with username: {}", username);

        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Get all active users (Admin only)
     * 
     * @return ResponseEntity with list of active users
     */
    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllActiveUsers() {
        log.info("Fetching all active users");

        List<User> users = userService.getAllActiveUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Get all admin users (Admin only)
     * 
     * @return ResponseEntity with list of admin users
     */
    @GetMapping("/admins")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllAdmins() {
        log.info("Fetching all admin users");

        List<User> admins = userService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    /**
     * Get users by role (Admin only)
     * 
     * @param roleName The name of the role
     * @return ResponseEntity with list of users with the specified role
     */
    @GetMapping("/role/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String roleName) {
        log.info("Fetching users with role: {}", roleName);

        List<User> users = userService.getUsersByRole("ROLE_" + roleName.toUpperCase());
        return ResponseEntity.ok(users);
    }

    /**
     * Update user profile
     * 
     * @param userId The ID of the user to update
     * @param user The updated user information
     * @return ResponseEntity with updated user information
     */
    @PutMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> updateUserProfile(@PathVariable Long userId, @RequestBody User user) {
        log.info("Updating user profile for user ID: {}", userId);

        try {
            User updatedUser = userService.updateUserProfile(userId, user);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            log.error("Error updating user profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Change user password
     * 
     * @param userId The ID of the user
     * @param passwordChangeRequest Request containing old and new passwords
     * @return ResponseEntity with success message
     */
    @PostMapping("/{userId}/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> passwordChangeRequest) {

        log.info("Changing password for user ID: {}", userId);

        try {
            String oldPassword = passwordChangeRequest.get("oldPassword");
            String newPassword = passwordChangeRequest.get("newPassword");

            userService.changePassword(userId, oldPassword, newPassword);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error changing password: {}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Assign role to user (Admin only)
     * 
     * @param userId The ID of the user
     * @param roleRequest Request containing role name
     * @return ResponseEntity with updated user information
     */
    @PostMapping("/{userId}/assign-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> assignRoleToUser(
            @PathVariable Long userId,
            @RequestBody Map<String, String> roleRequest) {

        log.info("Assigning role to user ID: {}", userId);

        try {
            String roleName = roleRequest.get("roleName");
            User updatedUser = userService.assignRoleToUser(userId, "ROLE_" + roleName.toUpperCase());
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            log.error("Error assigning role: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Activate user account (Admin only)
     * 
     * @param userId The ID of the user to activate
     * @return ResponseEntity with updated user information
     */
    @PostMapping("/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> activateUser(@PathVariable Long userId) {
        log.info("Activating user ID: {}", userId);

        try {
            User activatedUser = userService.activateUser(userId);
            return ResponseEntity.ok(activatedUser);
        } catch (RuntimeException e) {
            log.error("Error activating user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Deactivate user account (Admin only)
     * 
     * @param userId The ID of the user to deactivate
     * @return ResponseEntity with updated user information
     */
    @PostMapping("/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> deactivateUser(@PathVariable Long userId) {
        log.info("Deactivating user ID: {}", userId);

        try {
            User deactivatedUser = userService.deactivateUser(userId);
            return ResponseEntity.ok(deactivatedUser);
        } catch (RuntimeException e) {
            log.error("Error deactivating user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Delete user (Admin only)
     * 
     * @param userId The ID of the user to delete
     * @return ResponseEntity with success message
     */
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long userId) {
        log.info("Deleting user ID: {}", userId);

        try {
            userService.deleteUser(userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error deleting user: {}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
