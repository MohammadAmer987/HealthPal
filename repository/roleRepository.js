const Role = require('../models/Role');
const logger = require('../utils/logger');

class RoleRepository {
    async save(roleData) {
        try {
            const role = new Role(roleData);
            return await role.save();
        } catch (error) {
            logger.error(`Error saving role: ${error.message}`);
            throw error;
        }
    }

    async findById(id) {
        try {
            return await Role.findById(id);
        } catch (error) {
            logger.error(`Error finding role by ID ${id}: ${error.message}`);
            throw error;
        }
    }

    async findAll() {
        try {
            return await Role.find().sort({ createdAt: -1 });
        } catch (error) {
            logger.error(`Error finding all roles: ${error.message}`);
            throw error;
        }
    }

    async findByName(name) {
        try {
            return await Role.findOne({ name });
        } catch (error) {
            logger.error(`Error finding role by name ${name}: ${error.message}`);
            throw error;
        }
    }

    async existsByName(name) {
        try {
            const count = await Role.countDocuments({ name });
            return count > 0;
        } catch (error) {
            logger.error(`Error checking role existence ${name}: ${error.message}`);
            throw error;
        }
    }

    async findActiveRoles() {
        try {
            return await Role.find({ isActive: true }).sort({ name: 1 });
        } catch (error) {
            logger.error(`Error finding active roles: ${error.message}`);
            throw error;
        }
    }

    async update(id, updateData) {
        try {
            return await Role.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: Date.now() },
                { new: true, runValidators: true }
            );
        } catch (error) {
            logger.error(`Error updating role ${id}: ${error.message}`);
            throw error;
        }
    }

    async delete(id) {
        try {
            const result = await Role.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            logger.error(`Error deleting role ${id}: ${error.message}`);
            throw error;
        }
    }

    async deleteAll() {
        try {
            const result = await Role.deleteMany({});
            return result.deletedCount;
        } catch (error) {
            logger.error(`Error deleting all roles: ${error.message}`);
            throw error;
        }
    }

    async saveAll(rolesData) {
        try {
            return await Role.insertMany(rolesData);
        } catch (error) {
            logger.error(`Error saving multiple roles: ${error.message}`);
            throw error;
        }
    }

    async findRolesWithUserCount() {
        try {
            const roles = await Role.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'roles',
                        as: 'users'
                    }
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        isActive: 1,
                        createdAt: 1,
                        userCount: { $size: '$users' }
                    }
                },
                { $sort: { name: 1 } }
            ]);
            return roles;
        } catch (error) {
            logger.error(`Error finding roles with user count: ${error.message}`);
            throw error;
        }
    }

    async findRolesByUserId(userId) {
        try {
            const User = require('../models/User');
            const user = await User.findById(userId).populate('roles');
            return user ? user.roles : [];
        } catch (error) {
            logger.error(`Error finding roles for user ${userId}: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new RoleRepository();