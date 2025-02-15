const Booking = require("../models/bookingSchema");

const getRevenueByDays = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const revenue = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    total: { $sum: '$totalPrice' },
                },
            },
        ]);
        res.status(200).json({
            status: 'success',
            data: revenue
                .map(item => ({ date: item._id, revenue: item.total }))
                .sort((a, b) => new Date(b.date) - new Date(a.date)),
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

const getTotalBookings = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const totalBookings = await Booking.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        res.status(200).json({
            status: 'success',
            data: totalBookings,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

module.exports = {
    getRevenueByDays,
    getTotalBookings,
};