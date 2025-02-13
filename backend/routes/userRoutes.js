const router = require('express').Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.get('/', auth.enhance, userController.getAllUsers);
router.get('/me', auth.simple, userController.getUser);
router.get('/:id', auth.enhance, userController.getUserById);

router.patch('/me', auth.simple, userController.updateUser);
router.patch('/:id', auth.enhance, userController.updateUserById);

router.delete('/me', auth.simple, userController.deleteUser);
router.delete('/:id', auth.enhance, userController.deleteUserById);

router.post('/logout', auth.simple, userController.logoutUser);
router.post('/logoutAll', auth.enhance, userController.logoutAll);

module.exports = router;