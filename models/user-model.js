const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');


const User = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
        },
        token: {
            type: String,
        }
    },
    { timestamps: true },
)
//hashing a password before saving it to the database
User.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});
module.exports = mongoose.model('users', User)