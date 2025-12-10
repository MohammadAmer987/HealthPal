package com.healthpal.api.repository;

import com.healthpal.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * UserRepository - Data Access Layer for User entity
 * 
 * This repository is part of the MVC Layered Architecture (Repository/DAO Layer)
 * It extends JpaRepository to provide CRUD operations and custom queries for User entity
 * 
 * @author HealthPal Team - Person A (Authentication + Admin + Core Architecture)
 * @version 1.0
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by username
     * @param username The username to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Find a user by email
     * @param email The email to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Find a user by username or email
     * @param username The username to search for
     * @param email The email to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByUsernameOrEmail(String username, String email);

    /**
     * Check if a username exists
     * @param username The username to check
     * @return true if the username exists, false otherwise
     */
    Boolean existsByUsername(String username);

    /**
     * Check if an email exists
     * @param email The email to check
     * @return true if the email exists, false otherwise
     */
    Boolean existsByEmail(String email);

    /**
     * Find all active users
     * @return List of active users
     */
    @Query("SELECT u FROM User u WHERE u.isActive = true ORDER BY u.createdAt DESC")
    List<User> findAllActiveUsers();

    /**
     * Find all admin users
     * @return List of admin users
     */
    @Query("SELECT u FROM User u WHERE u.isAdmin = true ORDER BY u.createdAt DESC")
    List<User> findAllAdmins();

    /**
     * Find users by email verification status
     * @param isVerified The verification status
     * @return List of users with the specified verification status
     */
    @Query("SELECT u FROM User u WHERE u.isEmailVerified = :isVerified ORDER BY u.createdAt DESC")
    List<User> findByEmailVerificationStatus(@Param("isVerified") Boolean isVerified);

    /**
     * Find users by a specific role
     * @param roleName The name of the role
     * @return List of users with the specified role
     */
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName ORDER BY u.createdAt DESC")
    List<User> findUsersByRole(@Param("roleName") String roleName);
}
