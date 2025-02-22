const { get } = require('mongoose');
const Booking = require('../models/bookingSchema');
const { fetchUserFromToken, extractTokenFromReq } = require('../utils/tokenUtil');

// Create booking
const createBooking = async (req, res) => {
    try {
        const token = extractTokenFromReq(req);
        const user = await fetchUserFromToken(token);
        const booking = new Booking({
            user: user._id,
            showtime: req.body.showtime,
            bookedSeats: req.body.seats,
            movie: req.body.movie,
            totalPrice: req.body.totalPrice,
        });
        await booking.save();
        res.status(201).json({
            status: 'success',
            message: 'Booking created successfully',
            data: { booking },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}

// Get all bookings for a user
const getUserBookings = async (req, res) => {
    try {
        const token = extractTokenFromReq(req);
        const user = await fetchUserFromToken(token);
        const bookings = await Booking.find({ user: user._id });
        res.status(200).json({
            "status": "success",
            "data": bookings
        });
    } catch (error) {
        res.status(500).json({
            "status": "error",
            "message": error.message
        });
    }
}

// Get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json({
            "status": "success",
            "data": bookings
        });
    } catch (error) {
        res.status(500).json({
            "status": "error",
            "message": error
        });
    }
}

const getBookedSeats = async (req, res) => {
    const { showtimeId, screenId } = req.params;
    try {
        const bookings = await Booking.find({
            'showtime._id': showtimeId,
            'showtime.screenId._id': screenId
        });
        const bookedSeats = bookings.reduce((acc, booking) => {
            booking.bookedSeats.forEach(seat => {
                const existingRow = acc.find(row => row.row === seat.row);
                if (existingRow) {
                    existingRow.seats.push(...seat.seats);
                } else {
                    acc.push({ row: seat.row, seats: [...seat.seats] });
                }
            });
            return acc;
        }, []);
        res.status(200).json({
            status: 'success',
            message: 'Booked seats fetched successfully',
            data: { bookedSeats },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching booked seats',
        });
    }
}

// Update booking
const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.bookingId, req.body, { new: true });
        res.status(200).json({
            status: 'success',
            message: 'Booking updated successfully',
            data: { booking },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}

// Delete booking
const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.bookingId);
        res.status(200).json({
            status: 'success',
            message: 'Booking deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}
// For checking booking
const checkBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found',
            });
        }
        if (booking.status === 'checked') {
            return res.status(400).json({
                status: 'error',
                message: 'Booking already checked',
            });
        }
        if (booking.status === 'expired') {
            return res.status(400).json({
                status: 'error',
                message: 'Booking expired',
            });
        }
        if (booking.status === 'booked') {
            booking.status = 'checked';
            await booking.save();
            res.status(200).json({
                status: 'success',
                message: 'Booking checked successfully',
                data: { booking },
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error checking booking',
        });
    }
}

// Get all bookings for date range
const getBookingsForDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);
        const bookings = await Booking.find({ createdAt: { $gte: start, $lt: end } });
        res.status(200).json({
            status: 'success',
            message: 'Bookings fetched successfully',
            data: { bookings },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching bookings',
        });
    }
}

module.exports = {
    createBooking,
    getUserBookings,
    getAllBookings,
    getBookedSeats,
    updateBooking,
    deleteBooking,
    checkBooking,
    getBookingsForDateRange
};