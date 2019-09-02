const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String
})

// users : is the Collection in DB
module.exports = mongoose.model('user', userSchema, 'users')