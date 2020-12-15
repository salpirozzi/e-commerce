const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: String,
    firstname: String,
    lastname: String,
    password: String,
    birthday: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now},
    last_login: {type: Date, default: Date.now},
    admin: {type: Number, default: 0}
});

const User = mongoose.model('users', UserSchema);

module.exports = User;