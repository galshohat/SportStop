const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: [{
        type: String,
        required: true
    }],
    password: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    street: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})


userSchema.virtual('id').get(function() {
    return this._id.toHexString()
})

userSchema.set('toJSON', {
    virtuals: true
})

exports.Users = mongoose.model('Users', userSchema)

