const UserService = require('../services/userService');
const AuthService = require('../services/authService');
const logger = require('../utils/logger');

class UserController {
    constructor() {
        this.userService = new UserService();
        this.authService = new AuthService();
    }

    async getCurrentUser(req, res) {
        logger.info('Fetching current user profile');
        try {
            const currentUser = await this.authService.getCurrentUser(req.user.id);
            res.status(200).json(currentUser);
        } catch (error) {
            logger.error(`Error fetching current user: ${error.message}`);
            res.status(404).json({ error: 'User not found' });
        }
    }

    async getUserById(req, res) {
        const { userId } = req.params;
        logger.info(`Fetching user with ID: ${userId}`);
        try {
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            logger.error(`Error fetching user: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getUserByUsername(req, res) {
        const { username } = req.params;
        logger.info(`Fetching user with username: ${username}`);
        try {
            const user = await this.userService.getUserByUsername(username);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            logger.error(`Error fetching user: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAllActiveUsers(req, res) {
        logger.info('Fetching all active users');
        try {
            const users = await this.userService.getAllActiveUsers();
            res.status(200).json(users);
        } catch (error) {
            logger.error(`Error fetching users: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAllAdmins(req, res) {
        logger.info('Fetching all admin users');
        try {
            const admins = await this.userService.getAllAdmins();
            res.status(200).json(admins);
        } catch (error) {
            logger.error(`Error fetching admins: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getUsersByRole(req, res) {
        const { roleName } = req.params;
        logger.info(`Fetching users with role: ${roleName}`);
        try {
            const users = await this.userService.getUsersByRole(`ROLE_${roleName.toUpperCase()}`);
            res.status(200).json(users);
        } catch (error) {
            logger.error(`Error fetching users by role: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateUserProfile(req, res) {
        const { userId } = req.params;
        logger.info(`Updating user profile for user ID: ${userId}`);
        try {
            const updatedUser = await this.userService.updateUserProfile(userId, req.body);
            res.status(200).json(updatedUser);
        } catch (error) {
            logger.error(`Error updating user profile: ${error.message}`);
            res.status(404).json({ error: error.message });
        }
    }

    async changePassword(req, res) {
        const { userId } = req.params;
        logger.info(`Changing password for user ID: ${userId}`);
        try {
            const { oldPassword, newPassword } = req.body;
            await this.userService.changePassword(userId, oldPassword, newPassword);
            const response = { message: 'Password changed successfully' };
            res.status(200).json(response);
        } catch (error) {
            logger.error(`Error changing password: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }

    async assignRoleToUser(req, res) {
        const { userId } = req.params;
        logger.info(`Assigning role to user ID: ${userId}`);
        try {
            const { roleName } = req.body;
            const updatedUser = await this.userService.assignRoleToUser(userId, `ROLE_${roleName.toUpperCase()}`);
            res.status(200).json(updatedUser);
        } catch (error) {
            logger.error(`Error assigning role: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }

    async activateUser(req, res) {
        const { userId } = req.params;
        logger.info(`Activating user ID: ${userId}`);
        try {
            const activatedUser = await this.userService.activateUser(userId);
            res.status(200).json(activatedUser);
        } catch (error) {
            logger.error(`Error activating user: ${error.message}`);
            res.status(404).json({ error: error.message });
        }
    }

    async deactivateUser(req, res) {
        const { userId } = req.params;
        logger.info(`Deactivating user ID: ${userId}`);
        try {
            const deactivatedUser = await this.userService.deactivateUser(userId);
            res.status(200).json(deactivatedUser);
        } catch (error) {
            logger.error(`Error deactivating user: ${error.message}`);
            res.status(404).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        const { userId } = req.params;
        logger.info(`Deleting user ID: ${userId}`);
        try {
            await this.userService.deleteUser(userId);
            const response = { message: 'User deleted successfully' };
            res.status(200).json(response);
        } catch (error) {
            logger.error(`Error deleting user: ${error.message}`);
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = UserController;