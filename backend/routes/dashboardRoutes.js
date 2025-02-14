const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');

router.post('/revenue', dashboardController.getRevenueByDays);
router.get('/total-bookings', dashboardController.getTotalBookings);

module.exports = router;