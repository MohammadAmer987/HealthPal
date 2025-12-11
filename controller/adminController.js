const UserService = require('../services/userService');
const RoleService = require('../services/roleService');
const logger = require('../utils/logger');

class AdminController {
    constructor() {
        this.userService = new UserService();
        this.roleService = new RoleService();
    }

    async getSystemStatistics(req, res) {
        logger.info('Fetching system statistics');
        try {
            const statistics = {};
            const allUsers = await this.userService.getAllActiveUsers();
            statistics.totalActiveUsers = allUsers.length;
            const admins = await this.userService.getAllAdmins();
            statistics.totalAdmins = admins.length;
            const allRoles = await this.roleService.getAllRoles();
            statistics.totalRoles = allRoles.length;
            res.status(200).json(statistics);
        } catch (error) {
            logger.error(`Error fetching system statistics: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAllRoles(req, res) {
        logger.info('Fetching all roles');
        try {
            const roles = await this.roleService.getAllRoles();
            res.status(200).json(roles);
        } catch (error) {
            logger.error(`Error fetching roles: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createRole(req, res) {
        logger.info(`Creating new role: ${req.body.name}`);
        try {
            const { name, description } = req.body;
            const existingRole = await this.roleService.getRoleByName(name);
            if (existingRole) {
                logger.warn(`Role already exists: ${name}`);
                return res.status(400).json({ error: 'Role already exists' });
            }

            const roleData = { name, description, isActive: true };
            const createdRole = await this.roleService.createRole(roleData);
            logger.info(`Role created successfully: ${name}`);
            res.status(201).json(createdRole);
        } catch (error) {
            logger.error(`Error creating role: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getRoleById(req, res) {
        const { roleId } = req.params;
        logger.info(`Fetching role with ID: ${roleId}`);
        try {
            const role = await this.roleService.getRoleById(roleId);
            if (!role) {
                return res.status(404).json({ error: 'Role not found' });
            }
            res.status(200).json(role);
        } catch (error) {
            logger.error(`Error fetching role: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateRole(req, res) {
        const { roleId } = req.params;
        logger.info(`Updating role with ID: ${roleId}`);
        try {
            const role = await this.roleService.getRoleById(roleId);
            if (!role) {
                return res.status(404).json({ error: 'Role not found' });
            }

            const updates = {};
            if (req.body.description !== undefined) {
                updates.description = req.body.description;
            }
            if (req.body.isActive !== undefined) {
                updates.isActive = req.body.isActive;
            }

            const updatedRole = await this.roleService.updateRole(roleId, updates);
            logger.info(`Role updated successfully: ${roleId}`);
            res.status(200).json(updatedRole);
        } catch (error) {
            logger.error(`Error updating role: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAllUsers(req, res) {
        logger.info('Fetching all users (admin view)');
        try {
            const users = await this.userService.getAllActiveUsers();
            res.status(200).json(users);
        } catch (error) {
            logger.error(`Error fetching users: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getUserDetails(req, res) {
        const { userId } = req.params;
        logger.info(`Fetching user details for user ID: ${userId}`);
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

    async verifyUserEmail(req, res) {
        const { userId } = req.params;
        logger.info(`Verifying email for user ID: ${userId}`);
        try {
            const verifiedUser = await this.userService.verifyUserEmail(userId);
            res.status(200).json(verifiedUser);
        } catch (error) {
            logger.error(`Error verifying email: ${error.message}`);
            res.status(404).json({ error: error.message });
        }
    }

    healthCheck(req, res) {
        logger.info('Admin health check requested');
        const health = {
            status: 'UP',
            message: 'HealthPal Admin API is running',
            timestamp: new Date().toISOString()
        };
        res.status(200).json(health);
    }
}

module.exports = AdminController;