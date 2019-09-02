const mongoose = require('mongoose')

const Schema = mongoose.Schema

const specialEventSchema = new Schema({
    name: String,
    author: String,
    category: String,
    date: Date,
    description: String,
    rate: Number
})

// module.exports = mongoose.model('special', specialEventSchema, 'special')
module.exports = mongoose.model('special', specialEventSchema)