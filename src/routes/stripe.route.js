const express = require('express');

const router = express.Router();
const stripController = require('../controllers/stripe.controller');
router.post('/webhook', stripController.stripeWebhookListening);
router.get('/payment/success', stripController.stripePaymentSuccess);
router.get('/payment/cancel', stripController.stripePaymentCancel);

module.exports = router;
