const express=require('express')

const router=express.Router()
const empController=require('../controllers/emp.controller')

router.get('/',empController.getListUser)
router.get('/:empId',empController.getEmpById)
router.post('/createUser',empController.createUser)
router.put('/updateUser',empController.updateUser)
router.put('/lockUser/:userId',empController.lockEmp)
router.put('/unLockUser/:userId',empController.unLockEmp)
router.get('/:empId',empController.getEmpById)
router.delete('/',empController.deleteUser)


module.exports=router