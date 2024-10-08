const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const emproutes = require('./routes/emp-routes')
const deproutes = require('./routes/dep-routes');
const HttpError = require('./model/http-error');
const mongoose = require('mongoose');

app.use(bodyParser.json());

app.use('/api/employees',emproutes)
app.use('/api/departments',deproutes)

//middleware to handle unimplemented routes or path
app.use((req,res,next)=>{
  const error = new HttpError('could not find this route',404);
  throw error;
})

//error handling middleware
/*this is a middleware function express applies on every incoming request if function
is passed with four parmeters express will treat this as special function or error handling function
this function will only be executed if the request is having error attached to it */
app.use((err, req, res, next) => {
    if(res.headerSent){
        return next(err)
    }
    res.status(err.code || 500);
    res.json({message: err.message} || 'An unknown error occurred!')
  })

mongoose.connect('mongodb+srv://tinuaju1923:tqWpPOo4xJzGwOBw@tvdatabase.h0u25.mongodb.net/Camp6?retryWrites=true&w=majority&appName=TVDatabase')
.then(()=>{
  app.listen(5000);
}).catch(err=>{
  console.log(err);
})
