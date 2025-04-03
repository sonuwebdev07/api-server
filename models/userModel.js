const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Please add First Name !!'],
        trim: true
    },
    last_name: {
        type: String,
        required: [true, 'Please add Last Name !!'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add Email !!'],
        unique: true,
        trim: true
    },
    mobile: {
        type: String,
        required: [true, 'Please add Mobile !!'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please add Password !!'],
        trim: true,
        min: 6,
        max: 64
    },
    address: {
        type: String,
        required: [true, 'Please add Address !!']
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema)