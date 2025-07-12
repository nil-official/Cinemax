const express = require('express');
const auth = require('../middlewares/auth');
const { paymentCheckout, paymentVerification } = require('../controllers/paymentController');
const router = express.Router();

// User Routes
router.post("/checkout", auth.simple, paymentCheckout);
router.post("/verification", auth.simple, paymentVerification);

module.exports = router;