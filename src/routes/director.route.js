const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const directorController=require('../controllers/director.controller')
router.get('/getDirectors',authMiddleware.checkLogin,directorController.getListDirector)
router.get('/:id',authMiddleware.checkLogin,directorController.getDirectorById)
// router.get('/getDirectors',authMiddleware.checkLogin,actorController.getListDirectors)
router.post('/',authMiddleware.checkAdmin,directorController.createDirector)
router.put('/',authMiddleware.checkAdmin,directorController.updateDirector)
// router.delete('/',authMiddleware.checkAdmin,directorController.deleteDirector)

module.exports = router;