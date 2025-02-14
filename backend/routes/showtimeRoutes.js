const router = require('express').Router();
const showtimeController = require('../controllers/showtimeController');

// router.get('/:movieId', showtimeController.getShowtimesByMovieId);
// router.get('/id/:showtimeId', showtimeController.getShowtimeById);
// Get showtimes by movie id
router.get('/:movieId', showtimeController.getShowtimesByMovieId);

// Get showtime by id
router.get('/:showtimeId', showtimeController.getShowtimeById);

// aternate
router.get('/id/:showtimeId', showtimeController.getShowtimeById);

//Get all Showtimes
router.get('/', showtimeController.getAllShowtimes);

// Create a new showtime
router.post('/', showtimeController.createShowtime);

// Update a showtime
router.put('/:showtimeId', showtimeController.updateShowtime);

// Delete a showtime
router.delete('/:showtimeId', showtimeController.deleteShowtime);

module.exports = router;