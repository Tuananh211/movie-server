const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const amountController=require('../controllers/amount.controller');

router.get('/',authMiddleware.checkLogin,amountController.getListAmount)
router.get('/:id',authMiddleware.checkLogin,amountController.getAmountById)
router.put('/',authMiddleware.checkAdmin,amountController.updateAmount)

module.exports = router;