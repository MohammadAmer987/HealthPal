package com.healthpal.api.controller;

import com.healthpal.api.model.User;
import com.healthpal.api.model.Role;
import com.healthpal.api.service.UserService;
import com.healthpal.api.repository.RoleRepository;
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
 * AdminController - REST API Controller for Admin Operations
 * 
 * This controller is part of the MVC Layered Architecture (Controller/Presentation Layer)
 * It handles HTTP requests related to:
 * - System administration
 * - Role management
 * - User management (admin level)
 * - System statistics
 * 
 * Base URL: /api/admin
 * All endpoints require ADMIN role
 * 
 * @author HealthPal Team - Person A (Authentication + Admin + Core Architecture)
 * @version 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Get system statistics
     * 
     * @return ResponseEntity with system statistics
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSystemStatistics() {
        log.info("Fetching system statistics");

        try {
            Map<String, Object> statistics = new HashMap<>();
            
            // Get total users
            List<User> allUsers = userService.getAllActiveUsers();
            statistics.put("totalActiveUsers", allUsers.size());
            
            // Get total admins
            List<User> admins = userService.getAllAdmins();
            statistics.put("totalAdmins", admins.size());
            
            // Get role statistics
            List<Role> allRoles = roleRepository.findAll();
            statistics.put("totalRoles", allRoles.size());

            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            log.error("Error fetching system statistics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all roles
     * 
     * @return ResponseEntity with list of all roles
     */
    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Role>> getAllRoles() {
        log.info("Fetching all roles");

        try {
            List<Role> roles = roleRepository.findAll();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            log.error("Error fetching roles: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create new role
     * 
     * @param roleRequest Request containing role details
     * @return ResponseEntity with created role
     */
    @PostMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> createRole(@RequestBody Map<String, String> roleRequest) {
        log.info("Creating new role: {}", roleRequest.get("name"));

        try {
            String roleName = roleRequest.get("name");
            String description = roleRequest.get("description");

            // Check if role already exists
            if (roleRepository.existsByName(roleName)) {
                log.warn("Role already exists: {}", roleName);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            Role role = Role.builder()
                    .name(roleName)
                    .description(description)
                    .isActive(true)
                    .build();

            Role createdRole = roleRepository.save(role);
            log.info("Role created successfully: {}", roleName);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdRole);
        } catch (Exception e) {
            log.error("Error creating role: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get role by ID
     * 
     * @param roleId The ID of the role
     * @return ResponseEntity with role information
     */
    @GetMapping("/roles/{roleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> getRoleById(@PathVariable Long roleId) {
        log.info("Fetching role with ID: {}", roleId);

        Optional<Role> role = roleRepository.findById(roleId);
        return role.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Update role
     * 
     * @param roleId The ID of the role to update
     * @param roleRequest Request containing updated role details
     * @return ResponseEntity with updated role
     */
    @PutMapping("/roles/{roleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> updateRole(@PathVariable Long roleId, @RequestBody Map<String, String> roleRequest) {
        log.info("Updating role with ID: {}", roleId);

        try {
            Optional<Role> roleOptional = roleRepository.findById(roleId);
            if (roleOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Role role = roleOptional.get();
            if (roleRequest.containsKey("description")) {
                role.setDescription(roleRequest.get("description"));
            }
            if (roleRequest.containsKey("isActive")) {
                role.setIsActive(Boolean.parseBoolean(roleRequest.get("isActive")));
            }

            Role updatedRole = roleRepository.save(role);
            log.info("Role updated successfully: {}", roleId);

            return ResponseEntity.ok(updatedRole);
        } catch (Exception e) {
            log.error("Error updating role: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all users (Admin view)
     * 
     * @return ResponseEntity with list of all users
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        log.info("Fetching all users (admin view)");

        try {
            List<User> users = userService.getAllActiveUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Error fetching users: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get user details (Admin view)
     * 
     * @param userId The ID of the user
     * @return ResponseEntity with user information
     */
    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserDetails(@PathVariable Long userId) {
        log.info("Fetching user details for user ID: {}", userId);

        Optional<User> user = userService.getUserById(userId);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Verify user email (Admin action)
     * 
     * @param userId The ID of the user
     * @return ResponseEntity with updated user
     */
    @PostMapping("/users/{userId}/verify-email")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> verifyUserEmail(@PathVariable Long userId) {
        log.info("Verifying email for user ID: {}", userId);

        try {
            User verifiedUser = userService.verifyUserEmail(userId);
            return ResponseEntity.ok(verifiedUser);
        } catch (RuntimeException e) {
            log.error("Error verifying email: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * System health check (Admin only)
     * 
     * @return ResponseEntity with health status
     */
    @GetMapping("/health")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> healthCheck() {
        log.info("Admin health check requested");

        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("message", "HealthPal Admin API is running");
        health.put("timestamp", java.time.LocalDateTime.now().toString());

        return ResponseEntity.ok(health);
    }
}
