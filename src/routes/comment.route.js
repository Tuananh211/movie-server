const express=require('express')
const multer = require('multer');

const router=express.Router()
const commentController=require('../controllers/comment.controller')
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/list/:movieId',authMiddleware.checkLogin,commentController.getComments)
router.get('/userComment/:movieId',authMiddleware.checkLogin,commentController.getComments)
router.post('/',authMiddleware.checkLogin,commentController.createComment)
router.put('/',authMiddleware.checkLogin,commentController.updateComment)
router.delete('/',authMiddleware.checkLogin,commentController.deleteComment)

module.exports=router