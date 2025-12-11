const Joi = require('joi');

class LoginRequest {
    constructor(data) {
        this.usernameOrEmail = data.usernameOrEmail;
        this.password = data.password;
    }

    static validationSchema = Joi.object({
        usernameOrEmail: Joi.string()
            .required()
            .trim()
            .messages({
                'string.empty': 'Username or email is required',
                'any.required': 'Username or email is required'
            }),
        password: Joi.string()
            .required()
            .messages({
                'string.empty': 'Password is required',
                'any.required': 'Password is required'
            })
    });

    validate() {
        const { error } = LoginRequest.validationSchema.validate(this, { abortEarly: false });
        return error ? error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
        })) : null;
    }

    static fromRequest(body) {
        return new LoginRequest({
            usernameOrEmail: body.usernameOrEmail?.trim(),
            password: body.password
        });
    }

    static validateRequest(data) {
        const loginRequest = new LoginRequest(data);
        return loginRequest.validate();
    }
}

module.exports = LoginRequest;