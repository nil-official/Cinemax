const router = require('express').Router();
const screenController = require('../controllers/screenController');


// get screen by id
router.get('/screens/:screenId', screenController.getScreenById);

// get all screens
router.get('/screens', screenController.getAllScreens);

// create a new screen
router.post('/screens', screenController.createScreen);

// update a screen
router.put('/screens/:screenId', screenController.updateScreen);

// Delete a screen
router.delete('/screens/:screenId', screenController.deleteScreen);

module.exports = router;