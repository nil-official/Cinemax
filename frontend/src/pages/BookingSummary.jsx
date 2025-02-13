import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent, Divider, useMediaQuery, useTheme, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from 'date-fns';
import axios from "axios";
import { createBooking } from "../store/actions/bookings";

const BookingSummary = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedMovie } = useSelector((state) => state.movieState);
    const { selectedShowtime } = useSelector((state) => state.showtimeState);
    const { screen, selectedSeats } = useSelector((state) => state.screenState);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (!(screen && selectedSeats && selectedShowtime && selectedMovie)) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        let totalCost = 0;
        selectedSeats?.forEach(({ row, seats }) => {
            screen.layout.forEach(category => {
                if (category.rows.some(r => r.row === row)) {
                    totalCost += seats.length * category.price;
                }
            });
        });
        setTotalPrice(totalCost);
    }, []);

    // Handle payment
    const handlePayment = async () => {
        // const bookingData = {
        //     amount: totalPrice,
        //     showtime: selectedShowtime,
        //     seats: selectedSeats,
        //     movie: selectedMovie,
        //     user: {
        //         name: "Niladri Chakraborty",
        //         email: "nil@example.com",
        //         phone: "8013314898",
        //     }
        // };
        // try {
        //     dispatch(createBooking(bookingData));
        //     navigate("/bookings");
        // } catch (error) {
        //     alert("Error: " + error.message);
        // }

        const { data: { order } } = await axios.post('/payments/checkout', { "amount": totalPrice });

        const options = {
            key: import.meta.env.VITE_RAZORPAY_API_KEY,
            amount: order.amount,
            currency: "INR",
            name: "Cinemax",
            description: "Online Movie Ticket Booking System",
            order_id: order.id,
            handler: async (response) => {
                try {
                    const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/payments/verification`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    });
                    if (verifyRes.data.success) {
                        const res = await axios.post('/bookings/create', {
                            showtime: selectedShowtime,
                            seats: selectedSeats,
                            movie: selectedMovie,
                            totalPrice
                        });
                        navigate("/bookings");
                    } else {
                        alert("Payment verification failed. Please try again.");
                    }
                } catch (error) {
                    console.error("Verification error:", error);
                    alert("Payment verification failed. Please try again.");
                }
            },
            prefill: {
                name: "Niladri Chakraborty",
                email: "nil@example.com",
                contact: "8282808897"
            },
        };
        const razor = new window.Razorpay(options);
        razor.open();
    };

    return (
        <Box sx={{ p: 3, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ width: '100%', mb: 2 }}>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600, mb: 3 }}>
                    Booking Summary
                </Typography>
            </Box>
            <Grid2 container spacing={10} sx={{ maxWidth: 900, width: "100%" }}>
                {/* Left Side - Movie Details */}
                <Grid2 xs={12} md={5} sx={{ width: "45%" }}>
                    <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Movie Details
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img
                                    src={selectedMovie?.image}
                                    alt={selectedMovie?.title}
                                    style={{ height: 300, borderRadius: 8 }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
                                    {selectedMovie?.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Language: {selectedMovie?.language}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Genre: {selectedMovie?.genre.join(", ")}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Duration: {`${Math.floor(selectedMovie?.duration / 60)}h ${selectedMovie?.duration % 60}m`}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Right Side - Showtime and Seat Details */}
                <Grid2 xs={12} md={7} sx={{ width: "45%" }}>
                    {/* Showtime Details */}
                    <Grid2 xs={12} sx={{ mb: 6 }}>
                        <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    Showtime Details
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Screen: {screen?.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Date: {selectedShowtime ? (format(new Date(selectedShowtime?.date), "dd MMM yyyy")) : "N/A"}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Time: {selectedShowtime ?
                                        `${format(new Date(selectedShowtime?.startAt), "hh:mm a")} - 
                                        ${format(new Date(selectedShowtime?.endAt), "hh:mm a")}` : "N/A"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid2>

                    {/* Seat and Price Details */}
                    <Grid2 xs={12}>
                        <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3, mb: 6 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    Selected Seats
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                                    {selectedSeats
                                        ?.flatMap(rowData => rowData.seats.map(seat => `${rowData.row}${seat}`))
                                        .join(", ")}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Total Price: ₹{totalPrice}
                                </Typography>
                            </CardContent>
                        </Card>
                        {/* Pay Now Button */}
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ width: "100%", py: 1, fontSize: 16 }}
                            onClick={handlePayment}
                        >
                            Pay Now ₹{totalPrice}
                        </Button>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default BookingSummary;
