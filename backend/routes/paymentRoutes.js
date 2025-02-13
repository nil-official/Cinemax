const express = require('express');
const { paymentCheckout, paymentVerification } = require('../controllers/paymentController');
const router = express.Router();

router.post("/checkout", paymentCheckout);
router.post("/verification", paymentVerification);

module.exports = router;