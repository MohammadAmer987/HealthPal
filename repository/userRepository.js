const User = require('../models/User');
const logger = require('../utils/logger');

class UserRepository {
    async save(userData) {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            logger.error(`Error saving user: ${error.message}`);
            throw error;
        }
    }

    async findById(id) {
        try {
            return await User.findById(id)
                .populate('roles', 'name description')
                .select('-password');
        } catch (error) {
            logger.error(`Error finding user by ID ${id}: ${error.message}`);
            throw error;
        }
    }

    async findAll() {
        try {
            return await User.find()
                .populate('roles', 'name description')
                .select('-password')
                .sort({ createdAt: -1 });
        } catch (error) {
            logger.error(`Error finding all users: ${error.message}`);
            throw error;
        }
    }

    async findByUsername(username) {
        try {
            return await User.findOne({ username })
                .populate('roles', 'name description')
                .select('+password');
        } catch (error) {
            logger.error(`Error finding user by username ${username}: ${error.message}`);
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            return await User.findOne({ email })
                .populate('roles', 'name description')
                .select('+password');
        } catch (error) {
            logger.error(`Error finding user by email ${email}: ${error.message}`);
            throw error;
        }
    }

    async findByUsernameOrEmail(username, email) {
        try {
            return await User.findOne({
                $or: [
                    { username },
                    { email }
                ]
            })
            .populate('roles', 'name description')
            .select('+password');
        } catch (error) {
            logger.error(`Error finding user by username/email ${username}/${email}: ${error.message}`);
            throw error;
        }
    }

    async existsByUsername(username) {
        try {
            const count = await User.countDocuments({ username });
            return count > 0;
        } catch (error) {
            logger.error(`Error checking username existence ${username}: ${error.message}`);
            throw error;
        }
    }

    async existsByEmail(email) {
        try {
            const count = await User.countDocuments({ email });
            return count > 0;
        } catch (error) {
            logger.error(`Error checking email existence ${email}: ${error.message}`);
            throw error;
        }
    }

    async findAllActiveUsers() {
        try {
            return await User.find({ isActive: true })
                .populate('roles', 'name description')
                .select('-password')
                .sort({ createdAt: -1 });
        } catch (error) {
            logger.error(`Error finding all active users: ${error.message}`);
            throw error;
        }
    }

    async findAllAdmins() {
        try {
            return await User.find({ isAdmin: true })
                .populate('roles', 'name description')
                .select('-password')
                .sort({ createdAt: -1 });
        } catch (error) {
            logger.error(`Error finding all admins: ${error.message}`);
            throw error;
        }
    }

    async findByEmailVerificationStatus(isVerified) {
        try {
            return await User.find({ isEmailVerified: isVerified })
                .populate('roles', 'name description')
                .select('-password')
                .sort({ createdAt: -1 });
        } catch (error) {
            logger.error(`Error finding users by email verification status ${isVerified}: ${error.message}`);
            throw error;
        }
    }

    async findUsersByRole(roleName) {
        try {
            return await User.find()
                .populate({
                    path: 'roles',
                    match: { name: roleName },
                    select: 'name description'
                })
                .select('-password')
                .sort({ createdAt: -1 })
                .then(users => users.filter(user => user.roles && user.roles.length > 0));
        } catch (error) {
            logger.error(`Error finding users by role ${roleName}: ${error.message}`);
            throw error;
        }
    }

    async update(id, updateData) {
        try {
            return await User.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: Date.now() },
                { new: true, runValidators: true }
            )
            .populate('roles', 'name description')
            .select('-password');
        } catch (error) {
            logger.error(`Error updating user ${id}: ${error.message}`);
            throw error;
        }
    }

    async delete(id) {
        try {
            const result = await User.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            logger.error(`Error deleting user ${id}: ${error.message}`);
            throw error;
        }
    }

    async deleteAll() {
        try {
            const result = await User.deleteMany({});
            return result.deletedCount;
        } catch (error) {
            logger.error(`Error deleting all users: ${error.message}`);
            throw error;
        }
    }

    async count(filter = {}) {
        try {
            return await User.countDocuments(filter);
        } catch (error) {
            logger.error(`Error counting users: ${error.message}`);
            throw error;
        }
    }

    async findWithFields(filter, fields) {
        try {
            return await User.find(filter)
                .select(fields)
                .populate('roles', 'name description')
                .sort({ createdAt: -1 });
        } catch (error) {
            logger.error(`Error finding users with fields: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new UserRepository();