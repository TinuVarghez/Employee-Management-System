const express = require('express');
const router = express.Router();
const deptControllers = require('../controllers/dep-controller.js')

router.post('/',deptControllers.createDept)

router.get('/',deptControllers.getAllDept)

router.get('/:id',deptControllers.getDeptById)
//update or patch
router.patch('/:id',deptControllers.updateDept)
//delete
router.delete('/:id',deptControllers.deleteDept)

module.exports = router
