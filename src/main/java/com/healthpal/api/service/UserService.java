package com.healthpal.api.service;

import com.healthpal.api.model.User;
import com.healthpal.api.model.Role;
import com.healthpal.api.repository.UserRepository;
import com.healthpal.api.repository.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * UserService - Business Logic Layer for User Management
 * 
 * This service is part of the MVC Layered Architecture (Service/Business Logic Layer)
 * It handles:
 * - User profile management
 * - User role assignment
 * - User activation/deactivation
 * - User data retrieval
 * 
 * @author HealthPal Team - Person A (Authentication + Admin + Core Architecture)
 * @version 1.0
 */
@Slf4j
@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get user by ID
     * @param userId The ID of the user
     * @return Optional containing the user if found
     */
    public Optional<User> getUserById(Long userId) {
        log.debug("Fetching user with ID: {}", userId);
        return userRepository.findById(userId);
    }

    /**
     * Get user by username
     * @param username The username
     * @return Optional containing the user if found
     */
    public Optional<User> getUserByUsername(String username) {
        log.debug("Fetching user with username: {}", username);
        return userRepository.findByUsername(username);
    }

    /**
     * Get user by email
     * @param email The email
     * @return Optional containing the user if found
     */
    public Optional<User> getUserByEmail(String email) {
        log.debug("Fetching user with email: {}", email);
        return userRepository.findByEmail(email);
    }

    /**
     * Get all active users
     * @return List of all active users
     */
    public List<User> getAllActiveUsers() {
        log.debug("Fetching all active users");
        return userRepository.findAllActiveUsers();
    }

    /**
     * Get all admin users
     * @return List of all admin users
     */
    public List<User> getAllAdmins() {
        log.debug("Fetching all admin users");
        return userRepository.findAllAdmins();
    }

    /**
     * Get users by role
     * @param roleName The name of the role
     * @return List of users with the specified role
     */
    public List<User> getUsersByRole(String roleName) {
        log.debug("Fetching users with role: {}", roleName);
        return userRepository.findUsersByRole(roleName);
    }

    /**
     * Update user profile
     * @param userId The ID of the user to update
     * @param user The updated user information
     * @return Updated user
     * @throws RuntimeException if user not found
     */
    public User updateUserProfile(Long userId, User user) {
        log.info("Updating user profile for user ID: {}", userId);

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        if (user.getFirstName() != null) {
            existingUser.setFirstName(user.getFirstName());
        }
        if (user.getLastName() != null) {
            existingUser.setLastName(user.getLastName());
        }
        if (user.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(user.getPhoneNumber());
        }
        if (user.getProfilePicture() != null) {
            existingUser.setProfilePicture(user.getProfilePicture());
        }

        return userRepository.save(existingUser);
    }

    /**
     * Change user password
     * @param userId The ID of the user
     * @param oldPassword The old password
     * @param newPassword The new password
     * @return Updated user
     * @throws RuntimeException if user not found or old password is incorrect
     */
    public User changePassword(Long userId, String oldPassword, String newPassword) {
        log.info("Changing password for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            log.warn("Invalid old password for user ID: {}", userId);
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    /**
     * Assign role to user
     * @param userId The ID of the user
     * @param roleName The name of the role to assign
     * @return Updated user
     * @throws RuntimeException if user or role not found
     */
    public User assignRoleToUser(Long userId, String roleName) {
        log.info("Assigning role {} to user ID: {}", roleName, userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.addRole(role);
        return userRepository.save(user);
    }

    /**
     * Remove role from user
     * @param userId The ID of the user
     * @param roleName The name of the role to remove
     * @return Updated user
     * @throws RuntimeException if user or role not found
     */
    public User removeRoleFromUser(Long userId, String roleName) {
        log.info("Removing role {} from user ID: {}", roleName, userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.removeRole(role);
        return userRepository.save(user);
    }

    /**
     * Activate user account
     * @param userId The ID of the user to activate
     * @return Updated user
     * @throws RuntimeException if user not found
     */
    public User activateUser(Long userId) {
        log.info("Activating user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        user.setIsActive(true);
        return userRepository.save(user);
    }

    /**
     * Deactivate user account
     * @param userId The ID of the user to deactivate
     * @return Updated user
     * @throws RuntimeException if user not found
     */
    public User deactivateUser(Long userId) {
        log.info("Deactivating user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        user.setIsActive(false);
        return userRepository.save(user);
    }

    /**
     * Verify user email
     * @param userId The ID of the user
     * @return Updated user
     * @throws RuntimeException if user not found
     */
    public User verifyUserEmail(Long userId) {
        log.info("Verifying email for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        user.setIsEmailVerified(true);
        return userRepository.save(user);
    }

    /**
     * Delete user
     * @param userId The ID of the user to delete
     * @throws RuntimeException if user not found
     */
    public void deleteUser(Long userId) {
        log.info("Deleting user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        userRepository.delete(user);
    }
}
