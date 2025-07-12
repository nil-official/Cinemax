const router = require('express').Router();
const auth = require('../middlewares/auth');
const showtimeController = require('../controllers/showtimeController');

// Public Routes
router.get('/:showtimeId', showtimeController.getShowtimeById);
router.get('/movie/:movieId', showtimeController.getShowtimesByMovieId);

// Admin Routes
router.get('/', auth.enhance, showtimeController.getAllShowtimes);
router.post('/', auth.enhance, showtimeController.createShowtime);
router.post('/multiple', auth.enhance, showtimeController.createMultipleShowtimes);
router.put('/:showtimeId', auth.enhance, showtimeController.updateShowtime);
router.delete('/:showtimeId', auth.enhance, showtimeController.deleteShowtime);

module.exports = router;