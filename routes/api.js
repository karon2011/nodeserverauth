const express = require('express')
const jwt = require('jsonwebtoken')

// const bcrypt = require('bcrypt');
// var BCRYPT_SALT_ROUNDS = 12;

const router = express.Router()

const ObjectID = require('mongodb').ObjectID

//  Collections
const User = require('../models/user')
const Event = require('../models/event')
const Special = require('../models/special')

const mongoose = require('mongoose')
const db = "mongodb+srv://nabil:nabil2019@cluster0-394dt.mongodb.net/eventsdb?retryWrites=true&w=majority"

mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return req.status(401).send('Unauthorized request')
    }
    // extracting the value from the token : split then extract first index
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return req.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if (!payload) {
        return req.status(401).send('Unauthorized request')
    }
    req.userId = payload.subject
    next()
}

router.get('/', (req, res) => {
    res.send('From API route')
})

// register : EndPoint within API
router.post('/register', (req, res, next) => {
    let userData = req.body

    // let email = req.body.email
    // let password = req.body.password

    let user = new User(userData)

    // bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

    user.save((error, registeredUser) => {
        if (error) {
            console.log(error)
        } else {
            let payload = {
                subject: registeredUser._id
            }
            let token = jwt.sign(payload, 'secretKey')
            res.status(200).send({
                token
            })
        }
    })
})

// callback (req, res)
router.post('/login', (req, res) => {
    let userData = req.body

    User.findOne({
        email: userData.email
    }, (error, user) => {
        if (error) {
            console.log(error)
        } else {
            if (!user) {
                res.status(401).send('Invalid email')
            } else
            if (user.password !== userData.password) {
                res.status(401).send('Invalid password')
            } else {
                let payload = {
                    subject: user._id
                }
                let token = jwt.sign(payload, 'secretKey')
                res.status(200).send({
                    token
                })
            }
        }
    })
})

router.post('/events', (req, res) => {
    let eventData = req.body
    let event = new Event(eventData)

    event.save((error, registeredEvent) => {
        if (error) {
            console.log(error)
        } else {
            res.status(200).send(registeredEvent)
        }
    })
})

router.get('/users', (req, res, next) => {
    User.find({}, function (err, users) {
        if (err) {
            res.send('Something went wrong')
            next()
        }
        res.json(users)
        console.log(users)
    })
})

router.get('/users/:id', (req, res, next) => {

    let objId = new ObjectID(req.params.id)

    User.findOne({
            _id: objId
        })
        .then(doc => {
            console.log("valid _id = ", objId)
            if (!doc) {
                return res.status(404).end()
            } else {
                return res.status(200).json(doc)
            }
        })
        .catch(err => next(err))
})

router.get('/events', (req, res, next) => {

    let collection = mongoose.model('event')

    let events = []
    collection.find({}).stream()
        .on('data', function (doc) {
            // console.log("doc", doc)
            events.push(doc)
        })
        .on('error', function (err) {
            if (error) {
                console.log(error)
            }
        })
        .on('end', function () {
            // final callback
            console.log("events", events)
            res.json(events)
        });
})

router.get('/events/:id', (req, res, next) => {

    let objId = new ObjectID(req.params.id)

    Event.findOne({
            _id: objId
        })
        .then(doc => {
            console.log("valid _id = ", objId)
            if (!doc) {
                return res.status(404).end()
            } else {
                return res.status(200).json(doc)
            }
        })
        .catch(err => next(err))
})

//  verifyToken : MiddleWare
router.get('/special', verifyToken, (req, res, next) => {

    // console.log("doc 1")
    // let collection = mongoose.model('special')

    // let specialEvents = []
    // collection.find({}).stream()
    //     .on('data', function (doc) {
    //         console.log("doc 2", doc)
    //         specialEvents.push(doc)
    //     })
    //     .on('error', function (err) {
    //         if (error) {
    //             console.log(error)
    //         }
    //     })
    //     .on('end', function () {
    //         // final callback
    //         console.log("specialEvents", specialEvents)
    //         res.json(specialEvents)
    //     });

    let events = [{
            "_id": "1",
            "name": "Voyages",
            "description": "Japon et Corée",
            "date": "2018-05-26T12:00:15"
        },
        {
            "_id": "2",
            "name": "Bateaux",
            "description": "Benetton",
            "date": "2018-05-26T12:00:15"
        },
        {
            "_id": "3",
            "name": "Auto Moto",
            "description": "Limousines",
            "date": "2018-05-26T12:00:15"
        },
        {
            "_id": "4",
            "name": "Auto Moto",
            "description": "4x4",
            "date": "2018-05-26T12:00:15"
        },
        {
            "_id": "5",
            "name": "Motos & Quads",
            "description": "Rallye",
            "date": "2018-05-26T12:00:15"
        },
        {
            "_id": "6",
            "name": "Auto Moto",
            "description": "Années 50-70",
            "date": "2018-05-26T12:00:15"
        }
    ]
    res.json(events)
})

router.put('/events/:id', (req, res, next) => {

    let objId = new ObjectID(req.params.id)

    let query = {
        _id: objId
    }

    Event.updateOne(query, req.body)
        .then(doc => {
            console.log("req.body", JSON.stringify(req.body))
            if (!doc) {
                return res.status(404).end()
            }
            return res.status(200).json(doc)
        })
        .catch(err => next(err))
})

router.delete('/events/:id', (req, res, next) => {

    let objId = new ObjectID(req.params.id)

    Event.findByIdAndRemove({
            _id: objId
        })
        .exec()
        .then(doc => {
            if (!doc) {
                return res.status(404).end()
            }
            return res.status(204).end()
        })
        .catch(err => next(err))
})

module.exports = router