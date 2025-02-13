const router = require('express').Router();
const showtimeController = require('../controllers/showtimeController');

router.get('/:movieId', showtimeController.getShowtimesByMovieId);
router.get('/id/:showtimeId', showtimeController.getShowtimeById);

module.exports = router;