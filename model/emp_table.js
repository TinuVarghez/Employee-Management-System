const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating Schema and from schema we will create model 
const EmployeeSchema = new Schema({
    full_name: {type: String, required: true,min: [3,"Too Short"]},
    email: {type: String, unique:true ,required: true ,match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']},
    position: {type: String, required: true},
    department: {type:mongoose.Schema.Types.ObjectId, ref:'Department', required: true},
    dateOfBirth: {type:Date, match: [/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date in the format YYYY-MM-DD']},
    dateOfJoining: {type:Date, match: [/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date in the format YYYY-MM-DD']},    
    salary: {type: Number, required: true, min:0}
})  

module.exports = mongoose.model('Employee', EmployeeSchema);


/*A Schema in Mongoose is a blueprint that defines how data is organised within a mongodb collection. It specifies the fields
Model is the compiled version of Schema. It serves as a constructor that creates and interacts documents in mangodb collection
based on the defined schema 
Models provide an interface for CRUD 
*/