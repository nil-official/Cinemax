import React from 'react'
import { featuredMovie } from '../../data/movies';
import WideMovieCard from '../components/WideMovieCard';
import { Box, Typography, Divider } from '@mui/material';
import MovieCarousel from '../components/MovieCarousel/MovieCarousel';
import { useTheme } from '@mui/material/styles';

const Homepage = () => {

  const theme = useTheme();

  return (
    <Box sx={{ borderRadius: '10px' }}>

      <WideMovieCard movie={featuredMovie}/>

      <Typography sx={{ padding: '16px', fontSize: '22px' }}>Now Showing</Typography>
      <MovieCarousel />

      <Divider sx={{ borderColor: 'none', marginTop: 2, marginBottom: 2 }} />

      <Typography sx={{ padding: '16px', fontSize: '22px' }}>Upcoming Shows</Typography>
      <MovieCarousel />
    </Box>
  )
}

export default Homepage