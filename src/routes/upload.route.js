const express = require('express');

const authController = require('../controllers/auth.controller');
const { checkLogin } = require('../middlewares/auth.middleware');
const uploadController = require('../controllers/upload.controller')
const uploadRouter = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({})
const upload = multer({ storage, limit: { fileSize: 1024 * 1024 * 100 } }); //limit 100MB
uploadRouter.post(
  "/",upload.single('file'),uploadController.upload
);

module.exports = uploadRouter;
