import axios from '../../axiosConfig';

import {
    CREATE_BOOKING_PENDING,
    CREATE_BOOKING_FULFILLED,
    CREATE_BOOKING_REJECTED,
    FETCH_BOOKINGS_PENDING,
    FETCH_BOOKINGS_FULFILLED,
    FETCH_BOOKINGS_REJECTED,
} from '../types/bookings';

// Action creators
const createBookingPending = () => ({
    type: CREATE_BOOKING_PENDING,
});

const createBookingFulfilled = (booking) => ({
    type: CREATE_BOOKING_FULFILLED,
});

const createBookingRejected = (error) => ({
    type: CREATE_BOOKING_REJECTED,
    payload: error,
});

const fetchBookingsPending = () => ({
    type: FETCH_BOOKINGS_PENDING,
});

const fetchBookingsFulfilled = (bookings) => ({
    type: FETCH_BOOKINGS_FULFILLED,
    payload: bookings,
});

const fetchBookingsRejected = (error) => ({
    type: FETCH_BOOKINGS_REJECTED,
    payload: error,
});

// Async action to fetch user bookings
export const fetchBookings = () => {
    return async (dispatch) => {
        dispatch(fetchBookingsPending());
        try {
            const response = await axios.get('/bookings/user');
            dispatch(fetchBookingsFulfilled(response.data.data));
        } catch (error) {
            dispatch(fetchBookingsRejected(error.message));
        }
    };
};

// Async action to create a booking
export const createBooking = (bookingData) => {
    return async (dispatch) => {
        dispatch(createBookingPending());
        try {
            const response = await axios.post('/payments/checkout', { "amount": bookingData.amount });
            const options = {
                key: import.meta.env.VITE_RAZORPAY_API_KEY,
                amount: response.data.order.amount,
                currency: "INR",
                name: "Cinemax",
                description: "Online Movie Ticket Booking System",
                order_id: response.data.order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await axios.post('/payments/verification', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        if (verifyRes.data.success) {
                            const res = await axios.post('/bookings/create', {
                                showtime: bookingData.showtime,
                                seats: bookingData.seats,
                                movie: bookingData.movie,
                                totalPrice: bookingData.amount,
                            });
                            
                        } else {
                            alert("Payment verification failed. Please try again.");
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        alert("Payment verification failed. Please try again.");
                    }
                },
                prefill: {
                    name: bookingData.user.name,
                    email: bookingData.user.email,
                    contact: bookingData.user.phone,
                },
            };
            const razor = new window.Razorpay(options);
            razor.open();
            dispatch(createBookingFulfilled());
        } catch (error) {
            dispatch(createBookingRejected(error.message));
        }
    };
};