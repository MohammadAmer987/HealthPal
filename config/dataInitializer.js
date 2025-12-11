const Role = require('../models/Role');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class DataInitializer {
    async initialize() {
        logger.info('Starting database initialization...');
        try {
            await this.initializeRoles();
            await this.initializeAdminUser();
            logger.info('Database initialization completed successfully');
        } catch (error) {
            logger.error('Database initialization failed:', error);
            throw error;
        }
    }

    async initializeRoles() {
        logger.info('Initializing default roles...');
        const roles = [
            { name: 'ROLE_PATIENT', description: 'Role for patient users' },
            { name: 'ROLE_DOCTOR', description: 'Role for doctor users' },
            { name: 'ROLE_ADMIN', description: 'Role for admin users' },
            { name: 'ROLE_NGO', description: 'Role for NGO users' },
            { name: 'ROLE_DONOR', description: 'Role for donor users' }
        ];

        for (const roleData of roles) {
            const existingRole = await Role.findOne({ name: roleData.name });
            if (!existingRole) {
                await Role.create({
                    ...roleData,
                    isActive: true
                });
                logger.info(`Role created: ${roleData.name}`);
            } else {
                logger.debug(`Role already exists: ${roleData.name}`);
            }
        }
    }

    async initializeAdminUser() {
        logger.info('Initializing default admin user...');
        const adminUsername = 'admin';
        const existingAdmin = await User.findOne({ username: adminUsername });
        
        if (!existingAdmin) {
            const adminRole = await Role.findOne({ name: 'ROLE_ADMIN' });
            if (!adminRole) {
                throw new Error('ROLE_ADMIN role not found');
            }

            const adminUser = await User.create({
                username: adminUsername,
                email: 'admin@healthpal.com',
                password: await bcrypt.hash('Admin@123', 10),
                firstName: 'System',
                lastName: 'Administrator',
                phoneNumber: '+1234567890',
                isActive: true,
                isEmailVerified: true,
                isPhoneVerified: true,
                isAdmin: true,
                roles: [adminRole._id]
            });

            logger.info(`Default admin user created: ${adminUsername}`);
            return adminUser;
        } else {
            logger.debug('Admin user already exists');
            return existingAdmin;
        }
    }
}

module.exports = new DataInitializer();