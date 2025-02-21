const router = require('express').Router();
const screenController = require('../controllers/screenController');

router.get('/', screenController.getAllScreens);
router.get('/:screenId', screenController.getScreenById);

router.post('/', screenController.createScreen);
router.post('/multiple', screenController.createMultipleScreens);
router.post('/slots', screenController.getAvailableSlots);

router.put('/:screenId', screenController.updateScreen);

router.delete('/:screenId', screenController.deleteScreen);

module.exports = router;