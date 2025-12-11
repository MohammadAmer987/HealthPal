const { authenticateJWT, authorize, requireAuth } = require('./authMiddleware');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

exports.securityMiddlewares = [
    helmet(),
    cors(corsOptions),
    limiter,
    authenticateJWT
];

exports.routePermissions = (app) => {
    app.use('/api/auth', require('../routes/authRoutes'));
    app.use('/api/public', require('../routes/publicRoutes'));
    app.use('/api/health', (req, res) => res.json({ status: 'OK' }));
    app.use('/api/admin', requireAuth, authorize('ROLE_ADMIN'), require('../routes/adminRoutes'));
    app.use('/api/users', requireAuth, require('../routes/userRoutes'));
    app.use('/api', requireAuth, require('../routes/protectedRoutes'));
    
    app.use((req, res) => {
        res.status(404).json({
            status: 404,
            error: 'Not Found',
            message: `Cannot ${req.method} ${req.path}`
        });
    });
    
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        
        res.status(statusCode).json({
            status: statusCode,
            error: statusCode === 500 ? 'Internal Server Error' : err.name || 'Error',
            message: message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    });
};