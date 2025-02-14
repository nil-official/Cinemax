const router = require('express').Router();
const screenController = require('../controllers/screenController');

// router.get('/:screenId', screenController.getScreenById);
// router.post('/', screenController.createScreen);

// get screen by id
router.get('/:screenId', screenController.getScreenById);

// get all screens
router.get('/', screenController.getAllScreens);

// create a new screen
router.post('/', screenController.createScreen);

// update a screen
router.put('/:screenId', screenController.updateScreen);

// Delete a screen
router.delete('/:screenId', screenController.deleteScreen);

module.exports = router;