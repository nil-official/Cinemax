import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { format } from 'date-fns';
import { fetchShowtimes } from "../store/actions/showtimes";
import { Box, Button, Container, Typography, IconButton, Chip, useMediaQuery, Skeleton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { fetchMovieById } from "../store/actions/movies";
import ShowtimesCard from "../components/Showtimes/ShowtimesCard";

const ShowtimesPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { movieId } = useParams();
    const { showtimes, selectedShowtime, status, error } = useSelector((state) => state.showtimeState);
    const { selectedMovie } = useSelector((state) => state.movieState);

    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const isMobile = useMediaQuery('(max-width:600px)');

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

    const groupedShowtimes = showtimes
        .filter((s) => s.date.split("T")[0] === selectedDate && new Date(s.startAt) >= new Date())
        .reduce((acc, s) => {
            const category = s.screenId.name;
            if (!acc[category]) acc[category] = { category, showtimes: [] };
            acc[category].showtimes.push(s);
            return acc;
        }, {});

    return (
        <Container maxWidth="lg" sx={{ minHeight: '100vh', mt: 4, mb: 4 }}>
            {loading ? (
                <Box>
                    <Box>
                        <Typography variant={isMobile ? "h5" : "h4"} sx={{ pt: 3, fontWeight: 'bold' }}>
                            <Skeleton width={'50%'} height={50} />
                        </Typography>
                        <Box sx={{ py: 1, display: 'flex', flexWrap: 'wrap', gap: isMobile ? 1 : 2 }}>
                            {[...Array(3)].map((_, idx) => (
                                <Skeleton key={idx} variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                            ))}
                        </Box>
                    </Box>
                    <Box>
                        <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                width: isMobile ? '100%' : '38%',
                                overflowX: isMobile ? 'auto' : 'hidden',
                            }}>
                                {[...Array(5)].map((_, idx) => (
                                    <Skeleton key={idx} variant="rectangular" width={60} height={80} sx={{ borderRadius: 1 }} />
                                ))}
                            </Box>
                        </Box>
                        <Box>
                            <Box display="flex" flexDirection="column" gap={3}>
                                {[...Array(3)].map((_, idx) => (
                                    <Skeleton key={idx} variant="rectangular" width={'100%'} height={125} sx={{ borderRadius: 1 }} />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Box>
                    <Box>
                        <Typography variant={isMobile ? "h5" : "h4"} sx={{ pt: 3, fontWeight: 'bold' }}>
                            {selectedMovie && `${selectedMovie.title} - ${selectedMovie.language}`}
                        </Typography>
                        <Box sx={{ py: 1, display: 'flex', flexWrap: 'wrap', gap: isMobile ? 1 : 2 }}>
                            {selectedMovie.genre.map((genre, idx) => (
                                <Chip key={idx} label={genre} size="small" sx={{ backgroundColor: '#212739' }} />
                            ))}
                        </Box>
                    </Box>

                    {showtimes.length > 0 ? (
                        <Box>
                            <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }} >
                                {!isMobile &&
                                    <IconButton
                                        onClick={() => handleScroll(-1)}
                                        disabled={scrollIndex === 0}
                                        disableRipple
                                    >
                                        <ArrowBackIos />
                                    </IconButton>
                                }

                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    ml: isMobile ? 0 : 2,
                                    width: isMobile ? '100%' : '38%',
                                    overflowX: isMobile ? 'auto' : 'hidden',
                                }} >
                                    {(isMobile ? dates : dates.slice(scrollIndex, scrollIndex + 5)).map((date) => (
                                        <Button
                                            key={date}
                                            variant={selectedDate === date ? "contained" : "outlined"}
                                            onClick={() => handleDateChange(date)}
                                            sx={{ fontWeight: 'bold', width: '10%' }}
                                        >
                                            {format(new Date(date), 'EEE dd MMM').toUpperCase()}
                                        </Button>
                                    ))}
                                </Box>

                                {!isMobile &&
                                    <IconButton
                                        onClick={() => handleScroll(1)}
                                        disabled={scrollIndex >= dates.length - 5}
                                        disableRipple
                                    >
                                        <ArrowForwardIos />
                                    </IconButton>
                                }
                            </Box>
                            <Box>
                                {Object.values(groupedShowtimes).length ? (
                                    Object.values(groupedShowtimes).map(({ category, showtimes }) => (
                                        <ShowtimesCard
                                            key={category}
                                            category={category}
                                            showtimes={showtimes}
                                            movieId={movieId}
                                            showtime={selectedShowtime}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body1" align="center" color="textSecondary">
                                        No showtimes available for this date.
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    ) : (
                        <Typography variant="body1" align="center" color="textSecondary" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                            No showtimes available for this movie.
                        </Typography>
                    )}
                </Box>
            )
            }
        </Container >
    );
};

export default ShowtimesPage;
