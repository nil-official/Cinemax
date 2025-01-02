import React from 'react';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { Box, Typography, useMediaQuery, Grid } from '@mui/material';
import movies from '../../../data/movies.json';
import { useTheme } from '@mui/material/styles';
import MovieCarouselCard from './MovieCarouselCard';

const MovieCarousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screens
  const isTabletOrDesktop = useMediaQuery(theme.breakpoints.up('md')); // Detect tablet and above

  // Sort movies by releaseDate (assuming releaseDate is in 'YYYY-MM-DD' format or similar)
  const sortedMovies = [...movies].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

  // Get the first 3, 4, or 5 sorted movies based on screen size
  const moviesToShow = isMobile ? movies : sortedMovies.slice(0, 5); // On desktop/tablet, show top 5, otherwise all movies

  return (
    <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>

      {/* For desktop/tablet, use Grid to align items evenly */}
      {isTabletOrDesktop ? (
        <Grid container spacing={2} justifyContent="space-evenly">
          {moviesToShow.map((movie, i) => (
            <Grid item key={i} xs={2} sm={2} md={2} lg={2} xl={2}>
              <MovieCarouselCard movie={movie} theme={theme}/>
            </Grid>
          ))}
        </Grid>
      ) : (
        <ScrollMenu
          style={{
            display: 'flex',
            justifyContent: 'space-evenly', // Evenly space the cards horizontally
          }}
        >
          {moviesToShow.map((movie, i) => (
            <Box key={i} sx={{ textAlign: 'center' }}>
              <MovieCarouselCard movie={movie} theme={theme}/>
            </Box>
          ))}
        </ScrollMenu>
      )}
    </Box>
  );
};

export default MovieCarousel;
