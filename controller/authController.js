const AuthService = require('../services/authService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async signUp(req, res) {
        logger.info(`Received sign up request for user: ${req.body.username}`);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        try {
            const signUpRequest = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                userType: req.body.userType
            };

            const response = await this.authService.signUp(signUpRequest);
            res.status(201).json(response.toResponse());
        } catch (error) {
            logger.error(`Sign up failed: ${error.message}`);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async login(req, res) {
        logger.info(`Received login request for user: ${req.body.usernameOrEmail}`);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        try {
            const loginRequest = {
                usernameOrEmail: req.body.usernameOrEmail,
                password: req.body.password
            };

            const response = await this.authService.login(loginRequest);
            res.status(200).json(response.toResponse());
        } catch (error) {
            logger.error(`Login failed: ${error.message}`);
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    async refreshToken(req, res) {
        logger.info('Received token refresh request');
        try {
            const { refreshToken } = req.body;
            const response = await this.authService.refreshToken(refreshToken);
            res.status(200).json(response.toResponse());
        } catch (error) {
            logger.error(`Token refresh failed: ${error.message}`);
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    health(req, res) {
        res.status(200).json({ message: 'Authentication service is running' });
    }
}

module.exports = AuthController;