require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { securityMiddlewares, routePermissions } = require('./config/securityConfig');
const dataInitializer = require('./config/dataInitializer');
const logger = require('./utils/logger');

class HealthPalApiApplication {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthpal';
        this.initializeData = process.env.INITIALIZE_DATA === 'true';
    }

    async initialize() {
        try {
            this.initializeMiddleware();
            await this.connectDatabase();
            if (this.initializeData) {
                await this.initializeSystemData();
            }
            this.initializeRoutes();
            this.initializeErrorHandling();
            logger.info('HealthPal API application initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize application:', error);
            process.exit(1);
        }
    }

    initializeMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(securityMiddlewares);
        
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            next();
        });
        
        this.app.use((req, res, next) => {
            const start = Date.now();
            res.on('finish', () => {
                const duration = Date.now() - start;
                logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
            });
            next();
        });
        
        logger.debug('Middleware initialized');
    }

    async connectDatabase() {
        try {
            await mongoose.connect(this.mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
                maxPoolSize: 10
            });
            
            logger.info(`Connected to MongoDB at ${this.mongoUri}`);
            
            mongoose.connection.on('error', (err) => {
                logger.error('MongoDB connection error:', err);
            });
            
            mongoose.connection.on('disconnected', () => {
                logger.warn('MongoDB disconnected. Attempting to reconnect...');
            });
            
            mongoose.connection.on('reconnected', () => {
                logger.info('MongoDB reconnected successfully');
            });
            
        } catch (error) {
            logger.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }

    async initializeSystemData() {
        try {
            await dataInitializer.initialize();
            logger.info('System data initialized successfully');
        } catch (error) {
            logger.warn('Failed to initialize system data:', error.message);
        }
    }

    initializeRoutes() {
        routePermissions(this.app);
        
        this.app.get('/', (req, res) => {
            res.json({
                message: 'Welcome to HealthPal API',
                version: '1.0.0',
                documentation: '/api-docs',
                status: 'running',
                timestamp: new Date().toISOString()
            });
        });
        
        logger.debug('Routes initialized');
    }

    initializeErrorHandling() {
        this.app.use((req, res) => {
            res.status(404).json({
                status: 404,
                error: 'Not Found',
                message: `Cannot ${req.method} ${req.path}`,
                timestamp: new Date().toISOString()
            });
        });
        
        this.app.use((err, req, res, next) => {
            logger.error('Unhandled error:', err);
            
            const statusCode = err.statusCode || 500;
            const message = err.message || 'Internal Server Error';
            
            res.status(statusCode).json({
                status: statusCode,
                error: statusCode === 500 ? 'Internal Server Error' : err.name || 'Error',
                message: message,
                timestamp: new Date().toISOString(),
                ...(process.env.NODE_ENV === 'development' && { 
                    stack: err.stack,
                    details: err.details 
                })
            });
        });
        
        logger.debug('Error handling initialized');
    }

    async run() {
        await this.initialize();
        
        this.server = this.app.listen(this.port, () => {
            logger.info(`HealthPal API is running on port ${this.port}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`Database: ${this.mongoUri}`);
            logger.info(`Server started at ${new Date().toISOString()}`);
        });
        
        this.setupGracefulShutdown();
    }

    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            logger.info(`Received ${signal}. Starting graceful shutdown...`);
            
            try {
                if (this.server) {
                    await new Promise((resolve) => {
                        this.server.close(resolve);
                    });
                    logger.info('HTTP server closed');
                }
                
                if (mongoose.connection.readyState !== 0) {
                    await mongoose.connection.close();
                    logger.info('MongoDB connection closed');
                }
                
                logger.info('Graceful shutdown completed');
                process.exit(0);
            } catch (error) {
                logger.error('Error during graceful shutdown:', error);
                process.exit(1);
            }
        };
        
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
        
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught exception:', error);
            shutdown('uncaughtException');
        });
        
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled rejection at:', promise, 'reason:', reason);
        });
    }

    getApp() {
        return this.app;
    }
}

if (require.main === module) {
    const application = new HealthPalApiApplication();
    application.run().catch((error) => {
        logger.error('Failed to start application:', error);
        process.exit(1);
    });
}

module.exports = HealthPalApiApplication;