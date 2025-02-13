const router = require('express').Router();
const showtimeController = require('../controllers/showtimeController');

// Get showtimes by movie id
router.get('/showtimes/:movieId', showtimeController.getShowtimesByMovieId);

// Get showtime by id
router.get('/showtimes/:showtimeId', showtimeController.getShowtimeById);

// Create a new showtime
router.post('/showtimes', showtimeController.createShowtime);

// Update a showtime
router.put('/showtimes/:showtimeId', showtimeController.updateShowtime);

// Delete a showtime
router.delete('/showtimes/:showtimeId', showtimeController.deleteShowtime);

module.exports = router;