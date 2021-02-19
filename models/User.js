const mongoose = require('mongoose');
const usernameRegex = /^[a-zA-Z0-9]+$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const { validateRegex, ensureUnique } = require('./helpers/validators');

const userSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: [
            {
                validator: ensureUnique.bind(undefined, ['User', 'email']),
                message: 'This email address is already registered',
            },
            {
                validator: validateRegex.bind(undefined, [emailRegex]),
                message: 'Valid email address is required',
            },
        ]
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [3, 'Username must be at least 3 characters long'],
        validate: [
            {
                validator: ensureUnique.bind(undefined, ['User', 'username']),
                message: 'This username is already taken',
            },
            {
                validator: validateRegex.bind(undefined, [usernameRegex]),
                message: 'Username should consist of English letters and digits only',
            }]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    bookedHotels: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
    offeredHotels: []
});

module.exports = mongoose.model('User', userSchema);

