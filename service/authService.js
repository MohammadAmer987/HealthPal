const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const jwtTokenProvider = require('../utils/jwtTokenProvider');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const AuthResponse = require('../dtos/AuthResponse');

class AuthService {
    async signUp(signUpRequest) {
        try {
            logger.info(`Attempting to register user with username: ${signUpRequest.username}`);
            if (signUpRequest.password !== signUpRequest.confirmPassword) {
                logger.warn(`Password mismatch for user: ${signUpRequest.username}`);
                throw new Error('Passwords do not match');
            }

            const usernameExists = await userRepository.existsByUsername(signUpRequest.username);
            if (usernameExists) {
                logger.warn(`Username already exists: ${signUpRequest.username}`);
                throw new Error('Username is already taken');
            }

            const emailExists = await userRepository.existsByEmail(signUpRequest.email);
            if (emailExists) {
                logger.warn(`Email already exists: ${signUpRequest.email}`);
                throw new Error('Email is already registered');
            }

            const userType = signUpRequest.userType.toUpperCase();
            const roleName = `ROLE_${userType}`;
            const role = await roleRepository.findByName(roleName);
            if (!role) {
                throw new Error(`Role not found: ${roleName}`);
            }

            const hashedPassword = await bcrypt.hash(signUpRequest.password, 10);
            const userData = {
                username: signUpRequest.username,
                email: signUpRequest.email,
                password: hashedPassword,
                firstName: signUpRequest.firstName,
                lastName: signUpRequest.lastName,
                phoneNumber: signUpRequest.phoneNumber,
                isActive: true,
                isEmailVerified: false,
                isPhoneVerified: false,
                isAdmin: userType === 'ADMIN',
                roles: [role._id]
            };

            const savedUser = await userRepository.save(userData);
            logger.info(`User registered successfully: ${savedUser.username}`);

            return AuthResponse.success({
                userId: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                message: 'User registered successfully. Please verify your email.'
            });
        } catch (error) {
            logger.error(`Sign up error: ${error.message}`, error);
            throw error;
        }
    }

    async login(loginRequest) {
        try {
            logger.info(`Attempting to login user: ${loginRequest.usernameOrEmail}`);
            const user = await userRepository.findByUsernameOrEmail(
                loginRequest.usernameOrEmail,
                loginRequest.usernameOrEmail
            );

            if (!user) {
                logger.warn(`User not found: ${loginRequest.usernameOrEmail}`);
                throw new Error('Invalid username/email or password');
            }

            if (!user.isActive) {
                logger.warn(`User account is inactive: ${loginRequest.usernameOrEmail}`);
                throw new Error('User account is inactive');
            }

            const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
            if (!isPasswordValid) {
                logger.warn(`Invalid password for user: ${loginRequest.usernameOrEmail}`);
                throw new Error('Invalid username/email or password');
            }

            const tokenData = jwtTokenProvider.generateTokenPair(user);
            await userRepository.update(user._id, { lastLoginAt: new Date() });
            const roles = user.roles ? user.roles.map(role => role.name) : [];
            logger.info(`User logged in successfully: ${user.username}`);

            return AuthResponse.fromUserAndToken(user, tokenData);
        } catch (error) {
            logger.error(`Login failed for user: ${loginRequest.usernameOrEmail}`, error);
            throw new Error('Invalid username or password');
        }
    }

    async refreshToken(refreshToken) {
        try {
            logger.info('Attempting to refresh token');
            const decoded = jwtTokenProvider.validateToken(refreshToken);
            if (!decoded || decoded.tokenType !== 'refresh') {
                logger.warn('Invalid refresh token');
                throw new Error('Invalid refresh token');
            }

            const username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            if (!username) {
                throw new Error('Invalid refresh token');
            }

            const user = await userRepository.findByUsername(username);
            if (!user) {
                throw new Error('User not found');
            }

            const newToken = jwtTokenProvider.generateTokenFromUsername(username);
            const newRefreshToken = jwtTokenProvider.generateRefreshToken(user);
            const roles = user.roles ? user.roles.map(role => role.name) : [];
            logger.info(`Token refreshed successfully for user: ${username}`);

            return AuthResponse.success({
                token: newToken,
                refreshToken: newRefreshToken,
                userId: user._id,
                username: user.username,
                email: user.email,
                roles: roles,
                message: 'Token refreshed successfully'
            });
        } catch (error) {
            logger.error(`Token refresh failed: ${error.message}`, error);
            throw new Error('Invalid refresh token');
        }
    }

    async getCurrentUser(userId) {
        try {
            const user = await userRepository.findById(userId);
            if (!user) {
                throw new Error('Current user not found');
            }
            return user;
        } catch (error) {
            logger.error(`Get current user error: ${error.message}`, error);
            throw error;
        }
    }

    async authenticate(usernameOrEmail, password) {
        try {
            const user = await userRepository.findByUsernameOrEmail(
                usernameOrEmail,
                usernameOrEmail
            );

            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }

            if (!user.isActive) {
                throw new Error('User account is inactive');
            }

            return user;
        } catch (error) {
            logger.error(`Authentication error: ${error.message}`, error);
            throw error;
        }
    }

    async logout(userId) {
        try {
            logger.info(`Logging out user ID: ${userId}`);
            return { 
                success: true, 
                message: 'Logged out successfully' 
            };
        } catch (error) {
            logger.error(`Logout error: ${error.message}`, error);
            throw error;
        }
    }

    hasRequiredRoles(user, requiredRoles) {
        if (!user || !user.roles) {
            return false;
        }

        const userRoles = user.roles.map(role => role.name);
        return requiredRoles.some(role => userRoles.includes(role));
    }

    isAdmin(user) {
        return user && (user.isAdmin || this.hasRequiredRoles(user, ['ROLE_ADMIN']));
    }
}

module.exports = new AuthService();