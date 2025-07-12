const express = require('express');
const router = express.Router();
const { googleAuth, register, login } = require('../controllers/authController');

// Public Routes
router.get("/google", googleAuth);
router.post("/register", register);
router.post("/login", login);

module.exports = router;