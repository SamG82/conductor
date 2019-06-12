const express = require('express')
const mongoose = require('mongoose')

const Router = express.Router()

//Creating these here so that constant, redundant data isn't appended to them every time that they're needed
let models = []
let modelPromises = []

//Copy props from one object to another, useful for assigning model props from request body
let copyProps = (from, to) => {
    for (property in from) {
        to[property] = from[property]
    }
}

//return a model based on the model name and string provided
let getModelFromString = (string) => {
    let correctmodel = ''
    models.forEach(model => {
        if (model.modelName.toLowerCase() === string) {
            correctmodel = model
        }
    })

    return correctmodel
}

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
            res.sendStatus(500)
            console.log(err)
        })
})

/*
    Create route
    Model type specified in URL. Values to create said model are specified in request body.
*/
Router.post('/create/:modelName/', (req, res) => {
    let model = getModelFromString(req.params.modelName)
    let newDoc = new model()

    copyProps(req.body, newDoc)

    newDoc.save()
    res.sendStatus(200)
})

/*
    Read route
    Model type specified in URL. Rules to search for said model are specified in request body.
    Specify no parameters in request body to retrieve all models of that type
*/
Router.get('/read/:modelName/', (req, res) => {
    let model = getModelFromString(req.params.modelName)

    let rules = {}
    copyProps(req.body, rules)

    model.find(rules)
        .then(docs => {
            res.send(docs)
        })

})

Router.post('/update/:modelName/', (req, res) => {
    rules = {}

})

Object.seal(Conductor)

module.exports = Conductor

/*
FINISH SETTING UP UPDATE ROUTE FUNCTIONALITY
MAKE SURE THE FUNCTION GETRULES WORKS FOR OTHER SITUATIONS WHERE IT TRANSFERS PROPERTIES AS WELL
*/