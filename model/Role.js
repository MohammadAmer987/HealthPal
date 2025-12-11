const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Role name is required'],
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: [50, 'Role name cannot exceed 50 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [255, 'Description cannot exceed 255 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.__v;
            return ret;
        }
    }
});

roleSchema.virtual('users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'roles'
});

roleSchema.statics.existsByName = function(name) {
    return this.exists({ name });
};

roleSchema.statics.findByName = function(name) {
    return this.findOne({ name });
};

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;