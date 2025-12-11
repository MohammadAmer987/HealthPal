const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

exports.authenticateJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.getUserByUsernameOrEmail(decoded.username);
        
        if (!user || !user.isActive) {
            throw new Error('User not found or inactive');
        }

        req.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles
        };
        
        next();
    } catch (error) {
        next(error);
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'Authentication required'
            });
        }

        const hasRole = req.user.roles.some(role => 
            roles.includes(role.name) || roles.includes(role)
        );

        if (!hasRole) {
            return res.status(403).json({
                status: 403,
                error: 'Forbidden',
                message: 'You do not have permission to access this resource'
            });
        }

        next();
    };
};

exports.requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 401,
            error: 'Unauthorized',
            message: 'Full authentication is required to access this resource',
            path: req.path
        });
    }
    next();
};