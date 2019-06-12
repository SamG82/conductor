const express = require('express')

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
    Model type specified in URL. Filter to search for said model are specified in request body.
    Specify no parameters in request body to retrieve all models of that type
*/
Router.get('/read/:modelName/', (req, res) => {
    let model = getModelFromString(req.params.modelName)

    //use request body content as filter
    model.find(req.body)
        .then(docs => {
            res.send(docs)
        })
        .catch(err => {
            res.sendStatus(500)
            console.log(err)
        })

})

/*
    Update route
    Model type specified in URL. Filter to search for said model are specified in filter object of request body.
    Fields to update model are specified in update object of request body.
    If multiple models are found, they're all updated.
    Responds with the number of documents updated.
*/
Router.post('/update/:modelName/', (req, res) => {
    let model = getModelFromString(req.params.modelName)

    //use request body filter object as filter and update object as update query
    model.updateMany(req.body.filter, req.body.update)
        .then(response => {
            res.json({ modified: response.nModified })
        })
        .catch(err => {
            res.sendStatus(500)
            console.log(err)
        })

})

/*
    Delete route
    Model type specified in URL. Filter to search for said model are specified in request body.
    If multiple documents fit the filter, they're all deleted.
    Responds with the number of documents deleted.
*/
Router.delete('/delete/:modelName/', (req, res) => {
    let model = getModelFromString(req.params.modelName)

    model.deleteMany(req.body)
        .then(response => {
            res.json({ deleted: response.n })
        })
        .catch(err => {
            res.sendStatus(500)
            console.log(err)
        })
})

Object.seal(Conductor)

module.exports = Conductor
