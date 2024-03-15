const express=require('express')
const authMiddleware = require('../middlewares/auth.middleware');
const router=express.Router()
const cinemaController=require('../controllers/cinema.controller')
router.get('/:cinemaId/rooms',authMiddleware.checkLogin,cinemaController.getRoomsByCinemaId)
router.get('/cinemaByCityId/:cityId',authMiddleware.checkLogin,cinemaController.getCinemaByCityId)
router.get('/rooms/:roomId',authMiddleware.checkLogin,cinemaController.getCinemaByRoomId)
router.get('/cities',authMiddleware.checkLogin,cinemaController.getCities)
router.post('/rooms',authMiddleware.checkAdmin,cinemaController.addRoom)
router.get('/:cinemaId',authMiddleware.checkLogin,cinemaController.getCinemaById)
router.get('/',cinemaController.getCinemas)
router.get('/hasSchedule/:movieId',authMiddleware.checkLogin,cinemaController.getCinemasByMovieId)
router.post('/',authMiddleware.checkAdmin,cinemaController.createCinema)
router.put('/',authMiddleware.checkAdmin,cinemaController.updateCinema)
router.delete('/',authMiddleware.checkAdmin,cinemaController.deleteCinema)

module.exports=router