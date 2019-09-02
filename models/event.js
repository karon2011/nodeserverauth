const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = new Schema({
    id: Number,
    name: String,
    author: String,
    category: String,
    date: Date,
    description: String,
    rate: Number
})

// module.exports = mongoose.model('event', eventSchema, 'events')
module.exports = mongoose.model('event', eventSchema)