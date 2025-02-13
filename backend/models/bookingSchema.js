const { Schema, model } = require('mongoose');

const bookingSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    showtime: {
        type: Schema.Types.Mixed,
        required: true,
    },
    bookedSeats: [{
        type: Schema.Types.Mixed,
        required: true,
    }],
    movie: {
        type: Schema.Types.Mixed,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'booked',
        enum: ['booked', 'checked', 'expired'],
    },
}, { timestamps: true });

module.exports = model('Booking', bookingSchema);