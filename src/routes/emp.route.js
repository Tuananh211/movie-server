const express=require('express')

const router=express.Router()
const empController=require('../controllers/emp.controller')

router.get('/empsOfCinema/:cinema_id',empController.getListEmpsOfCinema)
router.get('/getListMana',empController.getListManager)
router.post('/createManager',empController.createManager)
router.get('/:empId',empController.getEmpById)
router.get('/',empController.getEmps)
router.delete('/',empController.deleteEmp)
router.post('/',empController.createEmp)
router.put('/',empController.updateEmp)


// router.get('/listUser',empController.getListUser)
// router.post('/createUser',empController.createUser)
// router.put('/lockUser/:userId',empController.lockEmp)
// router.put('/unLockUser/:userId',empController.unLockEmp)

module.exports=router