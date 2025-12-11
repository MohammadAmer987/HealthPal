const Joi = require('joi');

class SignUpRequest {
    constructor(data) {
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.confirmPassword = data.confirmPassword;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phoneNumber = data.phoneNumber;
        this.userType = data.userType;
    }

    static validationSchema = Joi.object({
        username: Joi.string()
            .required()
            .min(3)
            .max(50)
            .trim()
            .pattern(/^[a-zA-Z0-9_]+$/)
            .messages({
                'string.empty': 'Username is required',
                'string.min': 'Username must be at least 3 characters',
                'string.max': 'Username cannot exceed 50 characters',
                'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
                'any.required': 'Username is required'
            }),
        email: Joi.string()
            .required()
            .email()
            .lowercase()
            .trim()
            .messages({
                'string.email': 'Email should be valid',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .required()
            .min(8)
            .max(255)
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 8 characters',
                'string.max': 'Password cannot exceed 255 characters',
                'any.required': 'Password is required'
            }),
        confirmPassword: Joi.string()
            .required()
            .valid(Joi.ref('password'))
            .messages({
                'string.empty': 'Confirm password is required',
                'any.only': 'Passwords do not match',
                'any.required': 'Confirm password is required'
            }),
        firstName: Joi.string()
            .required()
            .min(2)
            .max(100)
            .trim()
            .messages({
                'string.empty': 'First name is required',
                'string.min': 'First name must be at least 2 characters',
                'string.max': 'First name cannot exceed 100 characters',
                'any.required': 'First name is required'
            }),
        lastName: Joi.string()
            .required()
            .min(2)
            .max(100)
            .trim()
            .messages({
                'string.empty': 'Last name is required',
                'string.min': 'Last name must be at least 2 characters',
                'string.max': 'Last name cannot exceed 100 characters',
                'any.required': 'Last name is required'
            }),
        phoneNumber: Joi.string()
            .pattern(/^[+]?[0-9]{10,15}$/)
            .allow('', null)
            .messages({
                'string.pattern.base': 'Phone number should be valid'
            }),
        userType: Joi.string()
            .required()
            .valid('PATIENT', 'DOCTOR', 'NGO', 'DONOR', 'ADMIN')
            .uppercase()
            .messages({
                'string.empty': 'User type is required',
                'any.only': 'User type must be one of: PATIENT, DOCTOR, NGO, DONOR, ADMIN',
                'any.required': 'User type is required'
            })
    });

    validate() {
        const { error } = SignUpRequest.validationSchema.validate(this, { abortEarly: false });
        return error ? error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
        })) : null;
    }

    static fromRequest(body) {
        return new SignUpRequest({
            username: body.username?.trim(),
            email: body.email?.trim().toLowerCase(),
            password: body.password,
            confirmPassword: body.confirmPassword,
            firstName: body.firstName?.trim(),
            lastName: body.lastName?.trim(),
            phoneNumber: body.phoneNumber?.trim(),
            userType: body.userType?.toUpperCase()
        });
    }

    static validateRequest(data) {
        const signUpRequest = new SignUpRequest(data);
        return signUpRequest.validate();
    }

    toUserData() {
        return {
            username: this.username,
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber
        };
    }
}

module.exports = SignUpRequest;