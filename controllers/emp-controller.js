const httpError = require('../model/http-error.js')
const { validationResult } = require('express-validator');
const HttpError = require('../model/http-error.js');
const Employee = require('../model/emp_table.js');
const Department = require('../model/dept_table.js');
const mongoose = require('mongoose');

const createEmployee = async (req,res,next)=>{
    // const errors = validationResult(req)
    // if(!errors.isEmpty()){
    //     console.log(errors);
    //     throw new HttpError('Invalid inputs passed, check your data',422);
    // }
    const {full_name,email,position,department,dateOfBirth,dateOfJoining,salary} = req.body
    const createEmp = new Employee({
        full_name: full_name,
        email: email,
        position: position,
        department: department,
        dateOfBirth: dateOfBirth,
        dateOfJoining: dateOfJoining,
        salary: salary
    })
    let Dept;
    try{
        Dept = await Department.findById(department);
    }catch(err){
        const error = new HttpError('creating employee failed, Please try again',500)
        return next(error)
    }
    if(!Dept){
        const error = new HttpError('could not find employee with id,try again',404);
        return next(error)
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createEmp.save({session:sess});
        Dept.employees.push(createEmp);
        await Dept.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
        console.log(err)
        const error = new HttpError('adding employee failed',500);
        return next(error)
    }
    res.status(201).json({Employee:createEmp});
}

const getAllEmployees = async (req,res,next)=>{
    console.log('GET Request in places')
    let empdetails;
    try{
        empdetails = await Employee.find();
    }
    catch(err){
        const error = new HttpError('something went wrong',500);
        return next(error);
    }
    if(!empdetails){
        throw new httpError('could not find a place with given id',404)
    }
    res.json({employee:empdetails})
}


const getEmpById = async (req,res,next)=>{
    console.log('GET Request in places')
    const empId = req.params.id;
    let empdetails;
    try{
        empdetails = await Employee.findById(empId);
    }
    catch(err){
        const error = new HttpError('something went wrong, could not find a employee',500);
        return next(error);
    }
    if(!empdetails){
        throw new httpError('could not find a place with given id',404)
    }
    res.json({Employee:empdetails.toObject({getters:true})})
}

const updateEmpById = async (req,res,next)=>{
    const {full_name,email,position,dateOfBirth,dateOfJoining,salary} = req.body;
    const empId = req.params.id;
    let updateQ;
    try{
        updateQ = await Employee.findByIdAndUpdate({_id:empId},{$set:{
            full_name:full_name,
            email:email,
            position:position,
            dateOfBirth:dateOfBirth,
            dateOfJoining:dateOfJoining,
            salary:salary
        }});
    }
    catch(err){
        const error = new HttpError('something went wrong, could not find a employee',500);
        return next(error);
    }
    if(!updateQ){
        throw new httpError('could not find employee',404)
    }
    res.status(200).json({Employee:updateQ})

}

const deleteEmpById = async (req,res,next)=>{
    const empId = req.params.id;  
    let emp;
    try{
        emp = await Employee.findById(empId).populate('department');
    }
    catch(err){
        const error = new HttpError('Updating employee failed!',500);
        return next(error);
    }
    if(!emp){
        const error = new HttpError('could not find the employees for this id',404)
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction()
        await emp.deleteOne({session:sess});
        emp.department.employees.pull(emp)
        await emp.department.save({session:sess})
        await sess.commitTransaction()
    }catch(err){
        console.log(err)
        const error = new HttpError('Something went wrong, could not delete employee',500)
        return next(error);
    }
    res.status(200).json({message:'Deleted Place..'})
}

exports.createEmployee=createEmployee
exports.getAllEmployees=getAllEmployees
exports.updateEmpById = updateEmpById
exports.deleteEmpById = deleteEmpById
exports.getEmpById = getEmpById
