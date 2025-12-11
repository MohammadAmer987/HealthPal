const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { body } = require('express-validator');

const authController = new AuthController();

const signUpValidation = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
];

const loginValidation = [
    body('usernameOrEmail').notEmpty().withMessage('Username or email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

router.post('/signup', signUpValidation, authController.signUp.bind(authController));
router.post('/login', loginValidation, authController.login.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.get('/health', authController.health.bind(authController));

module.exports = router;