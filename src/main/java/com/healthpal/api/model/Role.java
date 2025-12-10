package com.healthpal.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Role Entity - Represents user roles in the HealthPal system
 * 
 * This entity is part of the MVC Layered Architecture (Model Layer)
 * It maps to the 'roles' table in the MySQL database
 * 
 * Supported Roles:
 * - ROLE_PATIENT: Regular patient user
 * - ROLE_DOCTOR: Healthcare professional
 * - ROLE_ADMIN: System administrator
 * - ROLE_NGO: Non-governmental organization representative
 * - ROLE_DONOR: Donor user
 * 
 * @author HealthPal Team - Person A (Authentication + Admin + Core Architecture)
 * @version 1.0
 */
@Entity
@Table(name = "roles", uniqueConstraints = {
    @UniqueConstraint(columnNames = "name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Many-to-Many relationship with User
     * A role can be assigned to multiple users
     */
    @ManyToMany(mappedBy = "roles", cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();

    /**
     * Pre-persist lifecycle callback
     * Sets creation and update timestamps before saving to database
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    /**
     * Pre-update lifecycle callback
     * Updates the modification timestamp before updating in database
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
