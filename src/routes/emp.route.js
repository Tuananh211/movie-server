const express=require('express')

const router=express.Router()
const empController=require('../controllers/emp.controller')

router.get('/:empId',empController.getEmpById)
router.get('/',empController.getEmps)
router.get('/listUser',empController.getListUser)
router.post('/createUser',empController.createUser)
router.delete('/',empController.deleteEmp)
router.post('/',empController.createEmp)
router.put('/',empController.updateEmp)
router.put('/lockUser/:userId',empController.lockEmp)
router.put('/unLockUser/:userId',empController.unLockEmp)
module.exports=router