const router = require('express').Router();
const screenController = require('../controllers/screenController');

router.get('/:screenId', screenController.getScreenById);
router.post('/', screenController.createScreen);

module.exports = router;