const mongoose = require('mongoose');
const Users = mongoose.Schema({
    firstName:String,
    lastName:String,
    email: String,
    phone:String,
    gender:String,
    isDeleted: false,
    address:String,
    city: String,
    state: String,
    country: String,
    password: String,
    photo: String
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('users', Users);