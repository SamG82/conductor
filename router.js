const express = require('express')
const mongoose = require('mongoose')

const Router = express.Router()

//Creating all of these here so that constant, redundant data isn't appended to them every time that they're needed
let models = []
let modelPromises = []
let modelNames = []

let format = (modelName) => {
    return modelName + 's'
}

const Conductor = {
    applyModels: function (inputModels) {
        models = inputModels
        models.forEach(model => {
            modelPromises.push(model.find({}))
            modelNames.push(format(model.modelName))
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

Object.seal(Conductor)

module.exports = Conductor