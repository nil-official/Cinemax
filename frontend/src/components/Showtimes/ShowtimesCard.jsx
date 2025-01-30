import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { FaMobileAlt } from "react-icons/fa";
import { format } from "date-fns";

const ShowtimesCard = ({ showtimes }) => {

    const handleShowtimeClick = () => {
        console.log("Showtime Clicked");
    };

    return (
        <Card
            sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={2}
                >
                    {/* Left Section: Theatre & Pricing */}
                    <Box>
                        {/* <Typography variant="h6" fontWeight="bold">
                            {showtimes._id}
                        </Typography> */}
                        <Typography variant="h6" fontWeight="bold">
                            {showtimes.screenId.name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" color="primary" display="flex" alignItems="center">
                                <FaMobileAlt style={{ marginRight: '5px' }} />
                                M-Ticket
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                ₹{showtimes.screenId.price} onwards
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right Section: Showtimes */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <Button
                            variant="outlined"
                            fontSize="large"
                            sx={{ fontWeight: 'bold', fontSize: '16px' }}
                            onClick={handleShowtimeClick}
                        >
                            {format(new Date(showtimes.startAt), 'hh:mm a')}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ShowtimesCard;
