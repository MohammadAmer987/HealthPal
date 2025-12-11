const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class UserService {
    async getUserById(userId) {
        try {
            logger.debug(`Fetching user with ID: ${userId}`);
            const user = await userRepository.findById(userId);
            if (!user) {
                logger.debug(`User not found with ID: ${userId}`);
                return null;
            }
            return user;
        } catch (error) {
            logger.error(`Error in getUserById: ${error.message}`);
            throw error;
        }
    }

    async getUserByUsername(username) {
        try {
            logger.debug(`Fetching user with username: ${username}`);
            const user = await userRepository.findByUsername(username);
            if (!user) {
                logger.debug(`User not found with username: ${username}`);
                return null;
            }
            return user;
        } catch (error) {
            logger.error(`Error in getUserByUsername: ${error.message}`);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            logger.debug(`Fetching user with email: ${email}`);
            const user = await userRepository.findByEmail(email);
            if (!user) {
                logger.debug(`User not found with email: ${email}`);
                return null;
            }
            return user;
        } catch (error) {
            logger.error(`Error in getUserByEmail: ${error.message}`);
            throw error;
        }
    }

    async getAllActiveUsers() {
        try {
            logger.debug('Fetching all active users');
            return await userRepository.findAllActiveUsers();
        } catch (error) {
            logger.error(`Error in getAllActiveUsers: ${error.message}`);
            throw error;
        }
    }

    async getAllAdmins() {
        try {
            logger.debug('Fetching all admin users');
            return await userRepository.findAllAdmins();
        } catch (error) {
            logger.error(`Error in getAllAdmins: ${error.message}`);
            throw error;
        }
    }

    async getUsersByRole(roleName) {
        try {
            logger.debug(`Fetching users with role: ${roleName}`);
            return await userRepository.findUsersByRole(roleName);
        } catch (error) {
            logger.error(`Error in getUsersByRole: ${error.message}`);
            throw error;
        }
    }

    async updateUserProfile(userId, userData) {
        try {
            logger.info(`Updating user profile for user ID: ${userId}`);
            const existingUser = await userRepository.findById(userId);
            if (!existingUser) {
                throw new Error(`User not found with ID: ${userId}`);
            }

            const updates = {};
            if (userData.firstName !== undefined) {
                updates.firstName = userData.firstName;
            }
            if (userData.lastName !== undefined) {
                updates.lastName = userData.lastName;
            }
            if (userData.phoneNumber !== undefined) {
                updates.phoneNumber = userData.phoneNumber;
            }
            if (userData.profilePicture !== undefined) {
                updates.profilePicture = userData.profilePicture;
            }

            if (Object.keys(updates).length === 0) {
                logger.warn(`No valid fields to update for user ID: ${userId}`);
                return existingUser;
            }

            const updatedUser = await userRepository.update(userId, updates);
            logger.info(`User profile updated successfully for user ID: ${userId}`);
            return updatedUser;
        } catch (error) {
            logger.error(`Error updating user profile: ${error.message}`);
            throw error;
        }
    }

    async changePassword(userId, oldPassword, newPassword) {
        try {
            logger.info(`Changing password for user ID: ${userId}`);
            const user = await userRepository.findById(userId);
            if (!user) {
                throw new Error(`User not found with ID: ${userId}`);
            }

            const userWithPassword = await userRepository.findByUsername(user.username);
            if (!userWithPassword) {
                throw new Error(`User not found with username: ${user.username}`);
            }

            const isPasswordValid = await bcrypt.compare(oldPassword, userWithPassword.password);
            if (!isPasswordValid) {
                logger.warn(`Invalid old password for user ID: ${userId}`);
                throw new Error('Old password is incorrect');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updatedUser = await userRepository.update(userId, { password: hashedPassword });
            logger.info(`Password changed successfully for user ID: ${userId}`);
            return updatedUser;
        } catch (error) {
            logger.error(`Error changing password: ${error.message}`);
            throw error;
        }
    }

    async assignRoleToUser(userId, roleName) {
        try {
            logger.info(`Assigning role ${roleName} to user ID: ${userId}`);
            const [user, role] = await Promise.all([
                userRepository.findById(userId),
                roleRepository.findByName(roleName)
            ]);

            if (!user) {
                throw new Error(`User not found with ID: ${userId}`);
            }
            if (!role) {
                throw new Error(`Role not found: ${roleName}`);
            }

            const hasRole = user.roles.some(r => r._id.toString() === role._id.toString());
            if (!hasRole) {
                await user.addRole(role);
                logger.info(`Role ${roleName} assigned to user ID: ${userId}`);
            } else {
                logger.debug(`User already has role ${roleName}`);
            }

            return await userRepository.findById(userId);
        } catch (error) {
            logger.error(`Error assigning role: ${error.message}`);
            throw error;
        }
    }

    async removeRoleFromUser(userId, roleName) {
        try {
            logger.info(`Removing role ${roleName} from user ID: ${userId}`);
            const [user, role] = await Promise.all([
                userRepository.findById(userId),
                roleRepository.findByName(roleName)
            ]);

            if (!user) {
                throw new Error(`User not found with ID: ${userId}`);
            }
            if (!role) {
                throw new Error(`Role not found: ${roleName}`);
            }

            const hasRole = user.roles.some(r => r._id.toString() === role._id.toString());
            if (hasRole) {
                await user.removeRole(role);
                logger.info(`Role ${roleName} removed from user ID: ${userId}`);
            } else {
                logger.debug(`User does not have role ${roleName}`);
            }

            return await userRepository.findById(userId);
        } catch (error) {
            logger.error(`Error removing role: ${error.message}`);
            throw error;
        }
    }

    async activateUser(userId) {
        try {
            logger.info(`Activating user ID: ${userId}`);
            const user = await userRepository.findById(userId);
            if (!user) {
                throw new Error(`User not found with ID: ${userId}`);
            }

            const updatedUser = await userRepository.update(userId, { isActive: true });
            logger.info(`User activated successfully: ${userId}`);
            return updatedUser;
        } catch (error) {
            logger.error(`Error activating user: ${error.message}`);
            throw error;
        }
    }

    async deactivateUser(userId) {
        try {
            logger.info(`Deactivating user ID: ${userId}`);
            const user = await userRepository.findById(userId);
            if (!user) {
                throw new Error(`User not found with ID: ${userId}`);
            }

            const updatedUser = await userRepository.update(userId, { isActive: false });
            logger.info(`User deactivated successfully: ${userId}`);
            return updatedUser;
        } catch (error) {
            logger.error(`Error deactivating user: ${error.message}`);
            throw error;
        }
    }

    async verifyUserEmail(userId) {
        try {
            logger.info(`Verifying email for user ID: ${userId}`);
            const user = await userRepository.findById(userId);
            if (!user) {
                throw new Error(`User not found with ID: ${userId}`);
            }

            const updatedUser = await userRepository.update(userId, { isEmailVerified: true });
            logger.info(`Email verified successfully for user ID: ${userId}`);
            return updatedUser;
        } catch (error) {
            logger.error(`Error verifying email: ${error.message}`);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            logger.info(`Deleting user ID: ${userId}`);
            const user = await userRepository.findById(userId);
            if (!user) {
                throw new Error(`User not found with ID: ${userId}`);
            }

            const deleted = await userRepository.delete(userId);
            if (!deleted) {
                throw new Error(`Failed to delete user with ID: ${userId}`);
            }
            logger.info(`User deleted successfully: ${userId}`);
        } catch (error) {
            logger.error(`Error deleting user: ${error.message}`);
            throw error;
        }
    }

    async getUserByUsernameOrEmail(identifier) {
        try {
            logger.debug(`Loading user details for: ${identifier}`);
            const user = await userRepository.findByUsernameOrEmail(identifier, identifier);
            if (!user) {
                logger.warn(`User not found: ${identifier}`);
                throw new Error(`User not found with identifier: ${identifier}`);
            }

            if (!user.isActive) {
                logger.warn(`User account is inactive: ${identifier}`);
                throw new Error('User account is inactive');
            }

            return user;
        } catch (error) {
            logger.error(`Error in getUserByUsernameOrEmail: ${error.message}`);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            if (userData.password) {
                userData.password = await bcrypt.hash(userData.password, 10);
            }

            const user = await userRepository.save(userData);
            logger.info(`User created successfully: ${user.username}`);
            return user;
        } catch (error) {
            logger.error(`Error in createUser: ${error.message}`);
            throw error;
        }
    }

    async updateLastLogin(userId) {
        try {
            return await userRepository.update(userId, { lastLoginAt: new Date() });
        } catch (error) {
            logger.error(`Error in updateLastLogin: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new UserService();