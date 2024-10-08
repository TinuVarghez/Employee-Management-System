const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating Schema and from schema we will create model 
const DepartmentSchema = new Schema({
    name: {type: String , unique:true ,required: true,min: [3,"Too Short"]},
    employees: [{type:mongoose.Types.ObjectId, required:true, ref:'Employee'}]
})

module.exports = mongoose.model('Department', DepartmentSchema);


/*A Schema in Mongoose is a blueprint that defines how data is organised within a mongodb collection. It specifies the fields
Model is the compiled version of Schema. It serves as a constructor that creates and interacts documents in mangodb collection
based on the defined schema 
Models provide an interface for CRUD 
*/