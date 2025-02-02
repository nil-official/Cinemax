import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid2, Select, MenuItem, Skeleton, useMediaQuery, useTheme, Slide } from "@mui/material";
import { seatData } from "../../data/screen1";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const SeatPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { movieId, showtimeId } = useParams();
    const { screen, status, error } = useSelector((state) => state.screenState);
    const { selectedShowtime } = useSelector((state) => state.showtimeState);

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatLimit, setSeatLimit] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showPayButton, setShowPayButton] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // useEffect(() => {
    //     if (status === 'idle') {
    //         dispatch(fetchScreen(selectedShowtime.screenId));
    //     }
    // }, [status, dispatch]);

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Handle show pay now button
    useEffect(() => {
        let totalCost = 0;
        selectedSeats.forEach(({ row, seats }) => {
            seatData.layout.forEach(category => {
                if (category.rows.some(r => r.row === row)) {
                    totalCost += seats.length * category.price;
                }
            });
        });
        setTotalPrice(totalCost);
        setShowPayButton(countSelectedSeats(selectedSeats) == seatLimit);
    }, [selectedSeats]);

    // Count selected seats
    const countSelectedSeats = (selectedSeats) => {
        return selectedSeats.reduce((total, { seats }) => total + seats.length, 0);
    };

    // Check if seat is already booked
    const isSeatBooked = (row, seat) => {
        const bookedRow = seatData.bookedSeats.find((r) => r.row === row);
        return bookedRow ? bookedRow.seats.includes(seat) : false;
    };

    // Handle seat selection
    const handleSeatSelection = (row, seat) => {
        setSelectedSeats((prev) => {
            const totalSelectedSeats = prev.reduce((acc, r) => acc + r.seats.length, 0);

            const existingRow = prev.find(r => r.row === row);
            if (existingRow) {
                const isSelected = existingRow.seats.includes(seat);
                const updatedSeats = isSelected
                    ? existingRow.seats.filter(s => s !== seat) // Remove seat if already selected
                    : [...existingRow.seats, seat]; // Add seat if not selected

                if (!isSelected && totalSelectedSeats >= seatLimit) return prev; // Prevent exceeding limit

                return updatedSeats.length === 0
                    ? prev.filter(r => r.row !== row) // Remove row if no seats are selected
                    : prev.map(r => r.row === row ? { ...r, seats: updatedSeats } : r);
            } else {
                if (totalSelectedSeats >= seatLimit) return prev; // Prevent exceeding limit
                return [...prev, { row, seats: [seat] }];
            }
        });
    };

    // console.log(selectedSeats);

    // Handle seat limit change
    const handleSeatLimitChange = (e) => {
        setSeatLimit(e.target.value);
        setSelectedSeats([]);
    };

    // Handle payment
    const handlePayment = () => {
        console.log("Payment Initiated");
    }

    return (
        <Box sx={{ p: 2, pb: 10, minHeight: "100vh", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }} gutterBottom>
                        Seat Layout
                    </Typography>
                    <Select value={seatLimit} sx={{ minWidth: { xs: 50, sm: 70 } }} onChange={handleSeatLimitChange}>
                        {[...Array(5)].map((_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>
            {loading ? (
                seatData.layout.map((section, index) => (
                    <Box key={index} sx={{
                        mb: 2,
                        width: { xs: '100%', sm: 'auto' },
                        overflowX: 'auto',
                        flexWrap: 'nowrap',
                    }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            <Skeleton width={200} height={30} />
                        </Typography>
                        {section.rows.map((rows, rowIndex) => (
                            <Grid2 key={rowIndex} container alignItems="center" sx={{ mb: 1, flexWrap: 'nowrap' }}>
                                <Box sx={{ width: 24, mr: 2 }}>
                                    <Skeleton variant="rectangular" sx={{ width: 24, height: 24 }} />
                                </Box>
                                {rows.seats.map((seat, seatIndex) => (
                                    seat === null ? (
                                        <Box key={seatIndex} sx={{ width: 24, mr: { xs: 2, sm: 0 } }} />
                                    ) : (
                                        <Skeleton key={seatIndex} variant="rectangular" sx={{ minWidth: 32, minHeight: 32, margin: '5px', borderRadius: '5px' }} />
                                    )
                                ))}
                            </Grid2>
                        ))}
                    </Box>
                ))
            ) : (
                seatData.layout.map((section, index) => (
                    <Box key={index} sx={{
                        mb: 2,
                        width: { xs: '100%', sm: 'auto' },
                        overflowX: 'auto',
                        flexWrap: 'nowrap',
                    }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {section.category}
                        </Typography>
                        {section.rows.map((rows, rowIndex) => (
                            <Grid2 key={rowIndex} container alignItems="center" sx={{ mb: 1, flexWrap: 'nowrap' }}>
                                <Box sx={{ width: 24, mr: { xs: 1, sm: 0 } }}>
                                    <Typography variant="body1" sx={{ width: 24, mr: { xs: 1, sm: 0 } }}>
                                        {rows.row}
                                    </Typography>
                                </Box>
                                {rows.seats.map((seat, seatIndex) => (
                                    seat === null ? (
                                        <Box key={seatIndex} sx={{ width: 24, mr: { xs: 2, sm: 0 } }} />
                                    ) : (
                                        <Button
                                            key={seatIndex}
                                            variant={selectedSeats.find(r => r.row === rows.row && r.seats.includes(seat)) ? "contained" : "outlined"}
                                            size="small"
                                            disabled={isSeatBooked(rows.row, seat)}
                                            onClick={() => handleSeatSelection(rows.row, seat)}
                                            sx={{
                                                margin: '5px',
                                                minWidth: 32,
                                                color: "white",
                                            }}
                                        >
                                            {seat}
                                        </Button>
                                    )
                                ))}
                            </Grid2>
                        ))}
                    </Box>
                ))
            )}

            {/* Pay Button with Sliding Animation */}
            <Slide direction="up" in={showPayButton} mountOnEnter unmountOnExit>
                <Box sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    height: `${isMobile ? '80px' : '80px'}`,
                    width: '100%',
                    zIndex: '500',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: `${theme.palette.background.default}`,
                    boxShadow: `0px 2px 15px 15px ${theme.palette.background.default}`
                }} >
                    <Button variant="outlined"
                        sx={{ minWidth: isMobile ? 300 : 200, fontSize: "16px", borderRadius: "8px", color: "white", py: 1 }}
                        onClick={handlePayment}
                    >
                        Pay Rs.{totalPrice}
                    </Button>
                </Box>
            </Slide >
        </Box >
    );
};

export default SeatPage;
