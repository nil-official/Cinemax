const router = require('express').Router();
const auth = require('../middlewares/auth');
const dashboardController = require('../controllers/dashboardController');

// Admin Routes
router.post('/revenue', auth.enhance, dashboardController.getRevenueByDays);
router.get('/total-bookings', auth.enhance, dashboardController.getTotalBookings);

module.exports = router;