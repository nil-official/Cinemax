import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { format } from 'date-fns';
import { fetchShowtimes } from "../store/actions/showtimes";
import { Box, Button, Container, Typography, IconButton, CircularProgress } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { fetchMovieById } from "../store/actions/movies";
import ShowtimesCard from "../components/Showtimes/ShowtimesCard";

const ShowtimesPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { movieId } = useParams();
    const { showtimes, status } = useSelector((state) => state.showtimeState);
    const { selectedMovie } = useSelector((state) => state.movieState);

    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "idle") {
            setLoading(true); // Set loading to true when fetching starts
            dispatch(fetchShowtimes(movieId))
                .then(() => setLoading(false)) // Set loading to false when fetching completes
                .catch(() => setLoading(false)); // Handle errors
            dispatch(fetchMovieById(movieId));
        }
    }, [status, dispatch, movieId]);

    useEffect(() => {
        const now = new Date();
        const upcomingDates = [...new Set(showtimes
            .filter((s) => new Date(s.startAt) >= now)
            .map((s) => s.date.split("T")[0])
        )];
        setDates(upcomingDates);
        if (upcomingDates.length) setSelectedDate(upcomingDates[0]);
    }, [showtimes]);

    const handleDateChange = (date) => setSelectedDate(date);

    const handleScroll = (direction) => {
        setScrollIndex((prev) => Math.max(0, Math.min(prev + direction, dates.length - 5)));
    };

    const filteredShowtimes = showtimes.filter(
        (s) => s.date.split("T")[0] === selectedDate && new Date(s.startAt) >= new Date()
    );

    return (
        <>
            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="50vh"
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

                    <Typography variant="h4" fontWeight="bold" sx={{ pt: 3 }}>
                        {selectedMovie &&
                            `${selectedMovie.title} - ${selectedMovie.language}`
                        }
                    </Typography>

                    <Box
                        display="flex"
                        alignItems="center"
                        my={3}
                    >
                        <IconButton
                            onClick={() => handleScroll(-1)}
                            disabled={scrollIndex === 0}
                            disableRipple
                        >
                            <ArrowBackIos />
                        </IconButton>

                        <Box display="flex" gap={2} overflow="hidden" width="38%" marginLeft={2}>
                            {dates.slice(scrollIndex, scrollIndex + 5).map((date) => (
                                <Button key={date} variant={selectedDate === date ? "contained" : "outlined"}
                                    onClick={() => handleDateChange(date)} sx={{ fontWeight: 'bold', width: '10%' }}>
                                    {format(new Date(date), 'EEE dd MMM').toUpperCase()}
                                </Button>
                            ))}
                        </Box>

                        <IconButton
                            onClick={() => handleScroll(1)}
                            disabled={scrollIndex >= dates.length - 5}
                            disableRipple
                        >
                            <ArrowForwardIos />
                        </IconButton>
                    </Box>

                    <Box>
                        {filteredShowtimes.length ? (
                            filteredShowtimes.map((showtimes) => (
                                <ShowtimesCard key={showtimes._id} showtimes={showtimes} />
                            ))
                        ) : (
                            <Typography variant="body1" align="center" color="textSecondary">
                                No showtimes available for this date.
                            </Typography>
                        )}
                    </Box>
                </Container>
            )}
        </>
    );
};

export default ShowtimesPage;
