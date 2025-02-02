import React, { useEffect } from "react";
import { Box, Button, Card, CardContent, Typography, useMediaQuery } from "@mui/material";
import { FaMobileAlt } from "react-icons/fa";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectShowtime } from "../../store/actions/showtimes";

const ShowtimesCard = ({ category, showtimes, movieId, showtime }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery('(max-width:600px)');

    // const handleShowtimeClick = () => {
    //     console.log("Showtime Clicked");
    //     navigate(`/movie/${movieId}/showtimes/${showtime._id}/seatlayout`);
    // };
    useEffect(() => {
        if (showtime) {
            navigate(`/movie/${movieId}/showtimes/${showtime._id}/seatlayout`);
        }
    }, [showtime, navigate, movieId]);

    const handleShowtimeSelect = (show) => {
        dispatch(selectShowtime(show));
    }

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
                                ₹{showtimes[0].screenId.price} onwards
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right Section: Showtimes */}
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        {showtimes.map((show) => (
                            <Button
                                key={show._id}
                                variant="outlined"
                                fontSize="large"
                                sx={{ fontWeight: 'bold', fontSize: '16px' }}
                                onClick={() => handleShowtimeSelect(show)}
                            >
                                {format(new Date(show.startAt), 'hh:mm a')}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ShowtimesCard;
