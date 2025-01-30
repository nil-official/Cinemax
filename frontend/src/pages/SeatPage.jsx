import React, { useState } from "react";
import { Box, Typography, Button, Grid, Grid2, Select, MenuItem } from "@mui/material";
import { seatData } from "../../data/screen1";

const SeatLayoutPage = () => {

    const [selectedSeats, setSelectedSeats] = useState([]); // Track selected seats
    const [seatLimit, setSeatLimit] = useState(1); // User-selected seat limit

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

    // Handle seat limit change
    const handleSeatLimitChange = (e) => {
        setSeatLimit(e.target.value);
        setSelectedSeats([]);
    };

    console.log(selectedSeats);

    return (
        <Box sx={{ p: 3, minHeight: "100vh", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" gutterBottom>
                        Seat Layout
                    </Typography>
                    <Select value={seatLimit} sx={{ minWidth: 70 }} onChange={handleSeatLimitChange}>
                        {[...Array(5)].map((_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>
            {seatData.layout.map((section, index) => (
                <Box key={index} sx={{ mb: 2, width: { xs: '100%', sm: 'auto' }, overflowX: 'auto', flexWrap: 'nowrap' }}>
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
                            {
                                rows.seats.map((seat, seatIndex) => (
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
                                ))
                            }
                        </Grid2>
                    ))}
                </Box>
            ))
            }
        </Box >
    );
};

export default SeatLayoutPage;
