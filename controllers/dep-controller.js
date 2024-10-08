const mongoose = require('mongoose');
const Department = require('../model/dept_table.js');
const Employee = require('../model/emp_table.js');
const HttpError = require('../model/http-error.js')

const createDept = async (req,res,next)=>{
    // const errors = validationResult(req)
    // if(!errors.isEmpty()){
    //     console.log(errors);
    //     throw new HttpError('Invalid inputs passed, check your data',422);
    // }
    const {name} = req.body
    const createD = new Department({
        name: name
    })
    try {
        await createD.save();
    }catch(err){
        console.log(err);
        const error = new HttpError('creating department failed!', 500);
        return next(error);
    }
    res.status(201).json({Department:createD});
}

const getAllDept = async (req,res,next)=>{
    console.log('GET Request in places')
    let deptdetails;
    try{
        deptdetails = await Department.find();
    }
    catch(err){
        const error = new HttpError('something went wrong',500);
        return next(error);
    }
    if(!deptdetails){
        throw new HttpError('could not find a place with given id',404)
    }
    res.json({Department:deptdetails})
}

const getDeptById = async (req,res,next)=>{
    console.log('GET Request in places')
    const deptId = req.params.id;
    let deptdetails;
    try{
        deptdetails = await Department.findById(deptId);
    }
    catch(err){
        const error = new HttpError('something went wrong',500);
        return next(error);
    }
    if(!deptdetails){
        throw new httpError('could not find a place with given id',404)
    }
    res.json({Department:deptdetails})
}

const updateDept = async (req,res,next)=>{
    const {name} = req.body;
    const deptId = req.params.id
    let updateQ;
    try{
        updateQ = await Department.findByIdAndUpdate({_id:deptId},{$set:{name:name}});
    }
    catch(err){
        const error = new HttpError('something went wrong, could not find a place',500);
        return next(error);
    }
    if(!updateQ){
        throw new httpError('could not find creator',404)
    }
    res.status(200).json({Department:updateQ})

}
const deleteDept = async (req,res,next)=>{
    const deptId = req.params.id;
    let dept;
    try{
        dept = await Department.findById(deptId);
    }
    catch(err){
        const error = new HttpError('Updating department failed!',500);
        return next(error);
    }
    if(!dept){
        const error = new HttpError('could not find the department for this id',404)
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction()
        await dept.deleteOne({session:sess});
        await Employee.updateMany({department:deptId},{$set:{department:null}},{session:sess})
        await sess.commitTransaction()
    }catch(err){
        console.log(err)
        const error = new HttpError('Something went wrong, could not delete department',500)
        return next(error);
    }
    res.status(200).json({message:'Deleted Department..'})
}

exports.createDept = createDept
exports.getAllDept = getAllDept
exports.getDeptById = getDeptById
exports.updateDept = updateDept
exports.deleteDept = deleteDept