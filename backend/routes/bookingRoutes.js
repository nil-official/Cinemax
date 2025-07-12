const router = require('express').Router();
const auth = require('../middlewares/auth');
const bookingController = require('../controllers/bookingController');

// Public Route
router.get('/showtime/:showtimeId/screen/:screenId', bookingController.getBookedSeats);

// User Routes
router.get('/user', auth.simple, bookingController.getUserBookings);
router.post('/create', auth.simple, bookingController.createBooking);

// Admin Routes
router.get('/all', auth.enhance, bookingController.getAllBookings);
router.get('/check/:bookingId', auth.enhance, bookingController.checkBooking);
router.put('/:bookingId', auth.enhance, bookingController.updateBooking);
router.delete('/:bookingId', auth.enhance, bookingController.deleteBooking);

module.exports = router;