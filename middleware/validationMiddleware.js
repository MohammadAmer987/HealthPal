const LoginRequest = require('../dtos/LoginRequest');
const SignUpRequest = require('../dtos/SignUpRequest');

const validateLoginRequest = (req, res, next) => {
    const loginRequest = LoginRequest.fromRequest(req.body);
    const errors = loginRequest.validate();
    
    if (errors && errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }
    
    req.validatedData = loginRequest;
    next();
};

const validateSignUpRequest = (req, res, next) => {
    const signUpRequest = SignUpRequest.fromRequest(req.body);
    const errors = signUpRequest.validate();
    
    if (errors && errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }
    
    req.validatedData = signUpRequest;
    next();
};

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message
            }));
            
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }
        
        next();
    };
};

module.exports = {
    validateLoginRequest,
    validateSignUpRequest,
    validate
};