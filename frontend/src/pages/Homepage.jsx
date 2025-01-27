import React, { useEffect } from 'react'
import { Box, Typography, Divider } from '@mui/material';
import WideMovieCard from '../components/WideMovieCard';
import MovieCarousel from '../components/MovieCarousel/MovieCarousel';
import { featuredMovie } from '../data/movies';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies } from '../store/actions/movies';

const Homepage = () => {
  const dispatch = useDispatch();
  const { movies, selectedMovie, status, error } = useSelector((state) => state.movieState);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMovies());
    }
  }, [status, dispatch]);

  return (
    <Box sx={{ borderRadius: '10px' }}>
      <WideMovieCard movie={featuredMovie} />

      <Typography sx={{ padding: '16px', fontSize: '22px' }}>Now Showing</Typography>
      <MovieCarousel movies={movies} />

      <Divider sx={{ borderColor: 'none', marginTop: 2, marginBottom: 2 }} />

      <Typography sx={{ padding: '16px', fontSize: '22px' }}>Upcoming Shows</Typography>
      <MovieCarousel movies={movies} />
    </Box>
  )
}

export default Homepage