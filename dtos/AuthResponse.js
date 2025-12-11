class AuthResponse {
    constructor(data = {}) {
        this.token = data.token || null;
        this.refreshToken = data.refreshToken || null;
        this.userId = data.userId || null;
        this.username = data.username || null;
        this.email = data.email || null;
        this.firstName = data.firstName || null;
        this.lastName = data.lastName || null;
        this.isAdmin = data.isAdmin || false;
        this.roles = data.roles || [];
        this.message = data.message || null;
        this.success = data.success !== undefined ? data.success : true;
    }

    static success(data) {
        return new AuthResponse({
            ...data,
            success: true
        });
    }

    static error(message, data = {}) {
        return new AuthResponse({
            ...data,
            message,
            success: false
        });
    }

    static fromUserAndToken(user, tokenData) {
        return new AuthResponse({
            token: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            userId: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin || false,
            roles: user.roles ? user.roles.map(role => role.name) : [],
            message: 'Authentication successful',
            success: true
        });
    }

    toJSON() {
        return {
            token: this.token,
            refreshToken: this.refreshToken,
            userId: this.userId,
            username: this.username,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            isAdmin: this.isAdmin,
            roles: this.roles,
            message: this.message,
            success: this.success
        };
    }

    toResponse() {
        const response = this.toJSON();
        Object.keys(response).forEach(key => {
            if (response[key] === null) {
                delete response[key];
            }
        });
        return response;
    }
}

module.exports = AuthResponse;