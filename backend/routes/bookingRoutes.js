const router = require('express').Router();

const bookingController = require('../controllers/bookingController');

router.post('/create', bookingController.createBooking);
router.get('/user', bookingController.getUserBookings);
router.get('/all', bookingController.getAllBookings);
router.get('/showtime/:showtimeId/screen/:screenId', bookingController.getBookedSeats);
router.put('/:bookingId', bookingController.updateBooking);
router.delete('/:bookingId', bookingController.deleteBooking);
router.get('/check/:bookingId', bookingController.checkBooking);

module.exports = router;