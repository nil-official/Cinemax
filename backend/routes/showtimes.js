const router = require('express').Router();
const showtimeController = require('../controllers/showtimeController');

// Get showtimes by movie id
router.get('/showtime/:movieId', showtimeController.getShowtimesByMovieId);


module.exports = router;