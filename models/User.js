const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('User', userSchema);

//with validators and messages
// const userSchema = new mongoose.Schema({
//     id: mongoose.Types.ObjectId,
//     username: {
//         type: String,
//         required: [true, 'Username is required'],
//         unique: [true, 'Username must be unique'],
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     enrolledCourses: []
// });