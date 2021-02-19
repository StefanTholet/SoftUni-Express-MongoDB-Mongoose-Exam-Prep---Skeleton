const mongoose = require('mongoose');
const httpRegex = /^https?.+/;
const { validateRegex, ensureUnique } = require('./helpers/validators');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must be specified'],
        minlength: [4, 'The hotel name must be at least 4 characters'],
        validate: {
            validator: ensureUnique.bind(undefined, ['Product', 'name']),
            message: 'The hotel name must be unique'
        }
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        minlength: [3, 'The city must be at least 3 characters long']
    },
    imageUrl: {
        type: String,
        validate: {
            validator: validateRegex.bind(undefined, [httpRegex]),
            message: 'Link must start with http or https'
        },
        required: [true, 'Image Url is required'],
    },
    freeRooms: {
        type: Number,
        min: [1, 'Number of free rooms should be between 1 and 100'],
        max: [100, 'Number of free rooms should be between 1 and 100']
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    bookedBy: []
});

module.exports = mongoose.model('Product', productSchema);

//buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] array of referenced ids