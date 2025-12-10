package com.healthpal.api.config;

import com.healthpal.api.model.Role;
import com.healthpal.api.model.User;
import com.healthpal.api.repository.RoleRepository;
import com.healthpal.api.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * DataInitializer - Initialize Database with Default Data
 * 
 * This component runs when the application starts and initializes:
 * - Default roles (ROLE_PATIENT, ROLE_DOCTOR, ROLE_ADMIN, etc.)
 * - Default admin user
 * 
 * This is part of the application startup process
 * 
 * @author HealthPal Team - Person A (Authentication + Admin + Core Architecture)
 * @version 1.0
 */
@Slf4j
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Run initialization when application starts
     * @param args Command line arguments
     * @throws Exception If initialization fails
     */
    @Override
    public void run(String... args) throws Exception {
        log.info("Starting database initialization...");

        // Initialize default roles
        initializeRoles();

        // Initialize default admin user
        initializeAdminUser();

        log.info("Database initialization completed successfully");
    }

    /**
     * Initialize default roles
     */
    private void initializeRoles() {
        log.info("Initializing default roles...");

        String[] roleNames = {"ROLE_PATIENT", "ROLE_DOCTOR", "ROLE_ADMIN", "ROLE_NGO", "ROLE_DONOR"};

        for (String roleName : roleNames) {
            if (!roleRepository.existsByName(roleName)) {
                Role role = Role.builder()
                        .name(roleName)
                        .description("Role for " + roleName.replace("ROLE_", "").toLowerCase() + " users")
                        .isActive(true)
                        .build();

                roleRepository.save(role);
                log.info("Role created: {}", roleName);
            } else {
                log.debug("Role already exists: {}", roleName);
            }
        }
    }

    /**
     * Initialize default admin user
     */
    private void initializeAdminUser() {
        log.info("Initializing default admin user...");

        String adminUsername = "admin";
        if (!userRepository.existsByUsername(adminUsername)) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));

            User adminUser = User.builder()
                    .username(adminUsername)
                    .email("admin@healthpal.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .firstName("System")
                    .lastName("Administrator")
                    .phoneNumber("+1234567890")
                    .isActive(true)
                    .isEmailVerified(true)
                    .isPhoneVerified(true)
                    .isAdmin(true)
                    .build();

            adminUser.addRole(adminRole);
            userRepository.save(adminUser);
            log.info("Default admin user created: {}", adminUsername);
        } else {
            log.debug("Admin user already exists");
        }
    }
}
