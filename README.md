# Conductor
A pluggable router to automatically generate CRUD routes for ExpressJS apps that use Mongoose/MongoDB.

## Usage
First, install the package with npm. `npm i conductor-js`.
To use Conductor, all you have to do is apply your models and use Express's app.use method to link Conductor's router to your desired route.
(Make sure you've connected to MongoDB.)
```
const express = require('express')
const mongoose = require('mongoose')
const conductor = require('conductor')

const app = express()

//apply models in array
conductor.applyModels([model1, model2, model3, etc])

mongoose.connect('mymongoURI')

//bind to desired base route
app.use('/api', conductor.Router)

app.listen(5000, () => {
  console.log('Server started')
})
```
## Routing format
All route links are in the format of /operation/:modelName where the operation is either create, read, update, or delete.
All model names are **converted to lowercase**. For example, to delete a document of a model called User, the url would be /delete/user.

### Root route (/)
The root route for Conductor returns every document of all supplied models. 

### Create route (/create/:modelName)
The create route generates a new document based on the properties in the request body. For example, the request body to create a Car document with a price and rating field would be:
```
{
  "price": 35000,
  "rating": "5 stars"
}
```
at the route /create/car.

### Read route (/read/:modelName)
The read route returns one document or multiple documents. The filter to find specific documents is the request body. So, to find House documents with the address Main Street, the request body would be:
```
{
  "address": "Main Street"
}
```
at the route /read/house.
(You can specifiy nothing in the request body (no filter) to get all documents of a specific type.)

### Update route (/update/:modelName)
The update route changes the information in one or multiple documents. The filter to find models to update is specified as the "filter" object in the request body. The values to update are specified in the "update" object in the request body. To update the age property of a Pet document with the name property of "Bob", the request body would be:
```
{
  "filter": {
    "name": "Bob"
  },
  
  "update": {
    "age": 4
  }
}
```
at the route /update/pet.
You can leave the filter object blank to update all documents of the specified type. **If multiple documents are found from the provided filter, then they are all updated.**

### Delete route (/delete/:modelName)
The delete route removes documents that meet the filter in the request body of the specified model type. To delete all User documents that have a banned property, the request body would be:
```
{
  "banned": true
}
```
at route /delete/user. **All documents of the specified model that match the filter are removed.**
