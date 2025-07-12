const router = require('express').Router();
const auth = require('../middlewares/auth');
const screenController = require('../controllers/screenController');

// Public routes
router.get('/:screenId', screenController.getScreenById);

// Admin routes
router.get('/', auth.enhance, screenController.getAllScreens);
router.post('/', auth.enhance, screenController.createScreen);
router.post('/multiple', auth.enhance, screenController.createMultipleScreens);
router.post('/slots', auth.enhance, screenController.getAvailableSlots);
router.put('/:screenId', auth.enhance, screenController.updateScreen);
router.delete('/:screenId', auth.enhance, screenController.deleteScreen);

module.exports = router;