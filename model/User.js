const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [50, 'Username cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [100, 'First name cannot exceed 100 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [100, 'Last name cannot exceed 100 characters']
    },
    phoneNumber: {
        type: String,
        trim: true,
        match: [/^[+]?[0-9]{10,15}$/, 'Phone number should be valid']
    },
    profilePicture: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    lastLoginAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});

userSchema.methods.addRole = async function(role) {
    if (!this.roles.includes(role._id)) {
        this.roles.push(role._id);
        await this.save();
    }
    return this;
};

userSchema.methods.removeRole = async function(role) {
    this.roles = this.roles.filter(roleId => roleId.toString() !== role._id.toString());
    await this.save();
    return this;
};

userSchema.methods.updateLastLogin = async function() {
    this.lastLoginAt = new Date();
    await this.save();
    return this;
};

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.statics.findByUsernameOrEmail = function(identifier) {
    return this.findOne({
        $or: [
            { username: identifier },
            { email: identifier }
        ]
    }).populate('roles', 'name description');
};

userSchema.statics.existsByUsername = function(username) {
    return this.exists({ username });
};

userSchema.statics.existsByEmail = function(email) {
    return this.exists({ email });
};

const User = mongoose.model('User', userSchema);

module.exports = User;