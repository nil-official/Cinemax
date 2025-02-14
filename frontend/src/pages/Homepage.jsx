import React, { useEffect } from 'react'
import { Box, Typography, Divider } from '@mui/material';
import WideMovieCard from '../components/WideMovieCard';
import MovieCarousel from '../components/MovieCarousel/MovieCarousel';
import { featuredMovie } from '../../data/movies';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { fetchMovies } from '../store/actions/movies';
import axios from '../axiosConfig';

const Homepage = () => {
  const dispatch = useDispatch();
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const { movies, selectedMovie, status, error } = useSelector((state) => state.movieState);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMovies());
    }
  }, [status, dispatch]);

  useEffect(() => {
    fetchNowshowingMovies();
    fetchUpcomingMovies();
  }, []);

  const fetchNowshowingMovies = async () => {
    // fetch upcoming movies
    try{
      const response = await axios.get('/movies/now/showing');
      setNowShowingMovies(response.data.data);
    }
    catch (error) {
      console.log(error);
  }
  }
  const fetchUpcomingMovies = async () => {
    // fetch upcoming movies
    try{
      const response = await axios.get('/movies/now/upcoming');
      setUpcomingMovies(response.data.data);
    }
    catch (error) {
      console.log(error);
  }
  }

  return (
    <Box sx={{ borderRadius: '10px' }}>
      <WideMovieCard movie={featuredMovie} />

      <Typography sx={{ padding: '16px', fontSize: '22px' }}>Now Showing</Typography>
      <MovieCarousel movies={nowShowingMovies} />

      <Divider sx={{ borderColor: 'none', marginTop: 2, marginBottom: 2 }} />

      <Typography sx={{ padding: '16px', fontSize: '22px' }}>Upcoming Shows</Typography>
      <MovieCarousel movies={upcomingMovies} />
    </Box>
  )
}

export default Homepage