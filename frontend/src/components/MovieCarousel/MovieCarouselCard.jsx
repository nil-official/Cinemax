import React from 'react'
import { Box, Card, CardMedia, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectMovie } from '../../store/actions/movies';


const MovieCarouselCard = ({ movie, theme }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMovieSelect = (movie) => {
        dispatch(selectMovie(movie));
        navigate(`/movie/${movie._id}`);
    }

    return (
        <Box sx={{ cursor: 'pointer' }} onClick={()=>handleMovieSelect(movie)}>
            <Card
                sx={{
                    width: '150px',
                    backgroundColor: 'none',
                    color: '#fff',
                    borderRadius: '8px',
                    margin: '2px 8px 8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
                }}
            >
                <CardMedia
                    component="img"
                    height="220"
                    image={movie.image}
                    alt={movie.title}
                    sx={{ borderRadius: '8px 8px 0 0' }}
                />
            </Card>
            <Typography sx={{ margin: '0 8px', fontSize: '18px', color: theme.palette.text.primary }}>
                {/* {movie.title.length > 15 ? `${movie.title.substring(0, 15)}...` : movie.title} */}
                {movie.title}
            </Typography>
            {/* <Typography sx={{ margin: '0 8px', fontSize: '14px', color: theme.palette.text.secondary }}>
                {movie.genre.length > 15 ? `${movie.genre.substring(0, 15)}...` : movie.genre}
            </Typography> */}
        </Box>
    )
}

export default MovieCarouselCard