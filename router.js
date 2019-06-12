const express = require('express')
const mongoose = require('mongoose')

const Router = express.Router()

//Creating all of these here so that constant, redundant data isn't appended to them every time that they're needed
let models = []
let modelPromises = []

const Conductor = {
    applyModels: function (inputModels) {
        models = inputModels
        models.forEach(model => {
            modelPromises.push(model.find({}))
        })
    },
    Router
}


/*
    Home Route
    Returns all supplied models
*/
Router.get('/', (req, res) => {
    Promise.all(modelPromises)
        .then(docs => {
            res.send(docs)
        })
        .catch(err => {
            console.log(err)
        })
})

/*
    Create route
    Model type specified in URL. Values to create said model are specified in request body.
*/
Router.post('/create/:modelName/', (req, res) => {
    //get correct model type from name
    models.forEach(model => {
        if (model.modelName.toLowerCase() === req.params.modelName) {
            let newDoc = new model()
            for (property in req.body) {
                newDoc[property] = req.body[property]
            }
            newDoc.save()
            res.sendStatus(200)
        }
    })
})

Object.seal(Conductor)

module.exports = Conductor