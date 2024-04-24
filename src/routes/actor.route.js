const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const actorController=require('../controllers/actor.controller')
router.get('/getActors',authMiddleware.checkLogin,actorController.getListActors)
router.get('/:movieId',authMiddleware.checkLogin,actorController.getActors)
// router.get('/getDirectors',authMiddleware.checkLogin,actorController.getListDirectors)
router.post('/',authMiddleware.checkAdmin,actorController.createActor)
router.put('/',authMiddleware.checkAdmin,actorController.updateActor)
router.delete('/',authMiddleware.checkAdmin,actorController.deleteActor)

module.exports = router;