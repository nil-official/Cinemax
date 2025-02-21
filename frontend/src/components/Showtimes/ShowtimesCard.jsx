import React from "react";
import { Box, Button, Card, CardContent, Typography, useMediaQuery } from "@mui/material";
import { FaMobileAlt } from "react-icons/fa";
import { format, parse } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectShowtime } from "../../store/actions/showtimes";

const ShowtimesCard = ({ category, showtimes, movieId }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery('(max-width:600px)');

    const handleShowtimeSelect = (show) => {
        dispatch(selectShowtime(show))
            .then(() => {
                navigate(`/movie/${movieId}/showtimes/${show._id}/seatlayout`);
            });
    };

    // Convert and format timeSlot, and sort showtimes
    const sortedShowtimes = [...showtimes].sort((a, b) => {
        const timeA = parse(a.timeSlot, "HH:mm", new Date());
        const timeB = parse(b.timeSlot, "HH:mm", new Date());
        return timeA - timeB;
    });

    return (
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
                <Box sx={{
                    p: isMobile ? 1 : 2,
                    display: isMobile ? 'block' : 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* Left Section: Theatre & Pricing */}
                    <Box sx={{ mb: isMobile ? 2 : 0 }}>
                        <Typography variant="h6" fontWeight="bold">
                            {category}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" color="primary" display="flex" alignItems="center">
                                <FaMobileAlt style={{ marginRight: '5px' }} />
                                M-Ticket
                            </Typography>
                            <Typography variant="body1">
                                ₹{showtimes[0].screenId.layout[0].price} onwards
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right Section: Showtimes */}
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        {sortedShowtimes.map((show) => {
                            const formattedTime = format(parse(show.timeSlot, "HH:mm", new Date()), "hh:mm a");
                            return (
                                <Button
                                    key={show._id}
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold', fontSize: '16px' }}
                                    onClick={() => handleShowtimeSelect(show)}
                                >
                                    {formattedTime}
                                </Button>
                            );
                        })}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ShowtimesCard;
