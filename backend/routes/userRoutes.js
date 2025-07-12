const router = require('express').Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');

// User Routes
router.get('/me', auth.simple, userController.getUser);
router.patch('/me', auth.simple, userController.updateUser);
router.delete('/me', auth.simple, userController.deleteUser);
router.post('/logout', auth.simple, userController.logoutUser);

// Admin Routes
router.get('/', auth.enhance, userController.getAllUsers);
router.get('/:id', auth.enhance, userController.getUserById);
router.patch('/:id', auth.enhance, userController.updateUserById);
router.delete('/:id', auth.enhance, userController.deleteUserById);
router.post('/logoutAll', auth.enhance, userController.logoutAll);

module.exports = router;