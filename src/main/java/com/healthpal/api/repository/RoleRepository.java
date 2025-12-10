package com.healthpal.api.repository;

import com.healthpal.api.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * RoleRepository - Data Access Layer for Role entity
 * 
 * This repository is part of the MVC Layered Architecture (Repository/DAO Layer)
 * It extends JpaRepository to provide CRUD operations for Role entity
 * 
 * @author HealthPal Team - Person A (Authentication + Admin + Core Architecture)
 * @version 1.0
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Find a role by name
     * @param name The name of the role
     * @return Optional containing the role if found
     */
    Optional<Role> findByName(String name);

    /**
     * Check if a role exists by name
     * @param name The name of the role
     * @return true if the role exists, false otherwise
     */
    Boolean existsByName(String name);
}
