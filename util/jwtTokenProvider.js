const jwt = require('jsonwebtoken');
const logger = require('./logger');

class JwtTokenProvider {
    constructor() {
        this.secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
        this.accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m';
        this.refreshTokenExpiry = process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d';
        
        if (this.secret === 'your-super-secret-jwt-key-change-in-production') {
            logger.warn('Using default JWT secret. Please change JWT_SECRET in production!');
        }
    }

    generateToken(authentication) {
        try {
            const username = authentication.username || authentication.name;
            if (!username) {
                throw new Error('Authentication object must contain username or name');
            }

            return this.generateTokenFromUsername(username);
        } catch (error) {
            logger.error('Error generating token from authentication:', error);
            throw error;
        }
    }

    generateTokenFromUsername(username) {
        try {
            const now = Math.floor(Date.now() / 1000);
            const expiry = Math.floor(Date.now() / 1000) + this.parseExpiry(this.accessTokenExpiry);
            
            const payload = {
                sub: username,
                iat: now,
                exp: expiry,
                type: 'access'
            };

            return jwt.sign(payload, this.secret, {
                algorithm: 'HS512'
            });
        } catch (error) {
            logger.error('Error generating token from username:', error);
            throw error;
        }
    }

    generateRefreshToken(username) {
        try {
            const now = Math.floor(Date.now() / 1000);
            const expiry = Math.floor(Date.now() / 1000) + this.parseExpiry(this.refreshTokenExpiry);
            
            const payload = {
                sub: username,
                iat: now,
                exp: expiry,
                type: 'refresh'
            };

            return jwt.sign(payload, this.secret, {
                algorithm: 'HS512'
            });
        } catch (error) {
            logger.error('Error generating refresh token:', error);
            throw error;
        }
    }

    getUsernameFromToken(token) {
        try {
            const decoded = jwt.verify(token, this.secret, {
                algorithms: ['HS512']
            });
            return decoded.sub;
        } catch (error) {
            logger.error('Error getting username from token:', error.message);
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid token');
            } else {
                throw new Error('Token validation failed');
            }
        }
    }

    validateToken(token) {
        try {
            jwt.verify(token, this.secret, {
                algorithms: ['HS512']
            });
            return true;
        } catch (error) {
            logger.error('Token validation error:', error.message);
            if (error.name === 'TokenExpiredError') {
                logger.warn('Expired JWT token');
            } else if (error.name === 'JsonWebTokenError') {
                logger.warn('Invalid JWT token');
            } else if (error.name === 'NotBeforeError') {
                logger.warn('JWT token not active');
            }
            return false;
        }
    }

    getExpirationDateFromToken(token) {
        try {
            const decoded = jwt.verify(token, this.secret, {
                algorithms: ['HS512'],
                ignoreExpiration: true
            });
            return new Date(decoded.exp * 1000);
        } catch (error) {
            logger.error('Error getting expiration date from token:', error.message);
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid token');
            } else {
                throw error;
            }
        }
    }

    decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            logger.error('Error decoding token:', error.message);
            throw new Error('Failed to decode token');
        }
    }

    generateTokenPair(username) {
        try {
            return {
                accessToken: this.generateTokenFromUsername(username),
                refreshToken: this.generateRefreshToken(username),
                tokenType: 'Bearer',
                expiresIn: this.accessTokenExpiry
            };
        } catch (error) {
            logger.error('Error generating token pair:', error);
            throw error;
        }
    }

    generateAccessToken(user) {
        try {
            const now = Math.floor(Date.now() / 1000);
            const expiry = Math.floor(Date.now() / 1000) + this.parseExpiry(this.accessTokenExpiry);
            
            const payload = {
                userId: user._id || user.id,
                username: user.username,
                email: user.email,
                roles: user.roles ? user.roles.map(role => role.name) : [],
                isAdmin: user.isAdmin || false,
                sub: user.username,
                iat: now,
                exp: expiry,
                type: 'access'
            };

            return jwt.sign(payload, this.secret, {
                algorithm: 'HS512'
            });
        } catch (error) {
            logger.error('Error generating access token:', error);
            throw error;
        }
    }

    generateRefreshTokenFromUser(user) {
        return this.generateRefreshToken(user.username);
    }

    isRefreshToken(token) {
        try {
            const decoded = this.decodeToken(token);
            return decoded.type === 'refresh';
        } catch (error) {
            return false;
        }
    }

    isAccessToken(token) {
        try {
            const decoded = this.decodeToken(token);
            return decoded.type === 'access';
        } catch (error) {
            return false;
        }
    }

    getRemainingTime(token) {
        try {
            const expirationDate = this.getExpirationDateFromToken(token);
            const now = new Date();
            return Math.floor((expirationDate.getTime() - now.getTime()) / 1000);
        } catch (error) {
            logger.error('Error getting remaining time:', error.message);
            return 0;
        }
    }

    parseExpiry(expiryString) {
        const regex = /^(\d+)([smhd])$/;
        const match = expiryString.match(regex);
        
        if (!match) {
            throw new Error(`Invalid expiry format: ${expiryString}`);
        }
        
        const value = parseInt(match[1], 10);
        const unit = match[2];
        
        switch (unit) {
            case 's': return value;
            case 'm': return value * 60;
            case 'h': return value * 60 * 60;
            case 'd': return value * 24 * 60 * 60;
            default: throw new Error(`Unknown expiry unit: ${unit}`);
        }
    }

    renewIfAboutToExpire(token, thresholdSeconds = 300) {
        try {
            const remainingTime = this.getRemainingTime(token);
            if (remainingTime <= thresholdSeconds) {
                const username = this.getUsernameFromToken(token);
                return this.generateTokenPair(username);
            }
            return null;
        } catch (error) {
            logger.error('Error checking token renewal:', error.message);
            return null;
        }
    }
}

module.exports = new JwtTokenProvider();