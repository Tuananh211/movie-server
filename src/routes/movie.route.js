const express=require('express')
const multer = require('multer');

const router=express.Router()
const movieController=require('../controllers/movie.controller')
const authMiddleware = require('../middlewares/auth.middleware');
router.get('/categories',movieController.getCategories)
router.get('/getMovies',movieController.getMoviesOfSchedule)
router.get('/:movieId/actors',authMiddleware.checkLogin,movieController.getActors)
router.get('/languages',movieController.getLanguages)
router.get('/formats',movieController.getFormats)
router.get('/countries',movieController.getCountries)
router.get('/:movieId/categories',movieController.getCategoriesByMovieId)
router.get('/:movieId',movieController.getMovieById)
router.get('/',movieController.getMovies)
router.get('/list/:categoryId',authMiddleware.checkLogin,movieController.getMoviesByCategoryId)
router.get('/listMovie/:nameMovie',authMiddleware.checkLogin,movieController.getMoviesByName)
router.post('/',authMiddleware.checkAdmin,movieController.createMovie)
router.put('/',authMiddleware.checkAdmin,movieController.updateMovie)
router.delete('/',authMiddleware.checkAdmin,movieController.deleteMovie)

module.exports=router