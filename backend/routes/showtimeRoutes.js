const router = require('express').Router();
const showtimeController = require('../controllers/showtimeController');

router.get('/', showtimeController.getAllShowtimes);
router.get('/:showtimeId', showtimeController.getShowtimeById);
router.get('/movie/:movieId', showtimeController.getShowtimesByMovieId);

router.post('/', showtimeController.createShowtime);
router.post('/multiple', showtimeController.createMultipleShowtimes);

router.put('/:showtimeId', showtimeController.updateShowtime);

router.delete('/:showtimeId', showtimeController.deleteShowtime);

module.exports = router;