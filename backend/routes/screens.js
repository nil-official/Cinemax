const router = require('express').Router();
const screenController = require('../controllers/screenController');

// get screen by id
router.get('/screen/:screenId', screenController.getScreenById);

module.exports = router;