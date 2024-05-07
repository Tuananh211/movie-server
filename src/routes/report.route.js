const express=require('express')

const router=express.Router()
const reportController=require('../controllers/report.controller')

router.get('/totalCinemaTicket/:cinemaId',reportController.getTotalTicketOfCinema);
router.get('/totalAccount',reportController.getTotalUser)
router.get('/totalTicket',reportController.getTotalTicket)
router.get('/', reportController.getReport);

module.exports=router