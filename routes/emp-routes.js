const express = require('express');
const httpError = require('../model/http-error.js')
const router = express.Router();
const empControllers = require('../controllers/emp-controller.js')
const {check} = require('express-validator')

//creating a dummy record to learn
//POST PUT PATCH DELETE GET methods
router.post('/',empControllers.createEmployee)

router.get('/',empControllers.getAllEmployees)

router.get('/:id',empControllers.getEmpById)
//update or patch
router.patch('/:id',empControllers.updateEmpById)
//delete
router.delete('/:id',empControllers.deleteEmpById)

module.exports = router