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

module.exports = {
    createBooking,
    getUserBookings,
    getAllBookings,
    getBookedSeats,
};