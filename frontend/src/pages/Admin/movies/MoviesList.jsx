import React, { useEffect, useState } from 'react';
import axios from '../../../axiosConfig';
import { 
  Container, 
  Grid2, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Add, Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import PaginationComponent from '../../../utils/PaginationComponent';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const moviesPerPage = 6;

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('/movies');
      setMovies(response.data);
    } catch (error) {
      toast.error('Error fetching movies: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (movieId) => {
    try {
      const response = await axios.delete(`/movies/${movieId}`);
      setMovies((prevMovies) => prevMovies.filter(movie => movie._id !== movieId));
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Error deleting movie: ' + error.message);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getCurrentMovies = () => {
    const indexOfLastMovie = page * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    return movies.slice(indexOfFirstMovie, indexOfLastMovie);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          gap: { xs: 2, sm: 0 },
          mb: 4 
        }}
      >
        <Typography 
          variant="h4" 
          sx={{
            fontSize: { 
              xs: '1.5rem', 
              sm: '2rem', 
              md: '2.25rem' 
            }
          }}
        >
          Manage Movies
        </Typography>
        <Button
          component={Link}
          to="/admin/movies/add"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            width: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4],
              transition: 'all 0.2s ease-in-out'
            }
          }}
        >
          {isMobile ? 'Add' : 'Add Movie'}
        </Button>
      </Box>

      {movies.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
          No movies found
        </Typography>
      ) : (
        <>
          <Grid2 container spacing={5}>
            {getCurrentMovies().map((movie) => (
              <Grid2 xs={12} sm={6} md={4} key={movie._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 3,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)', 
                    },
                  }}
                >
                  <img 
                    src={movie.image || 'default-image-url.jpg'} // Fallback image
                    alt={movie.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', // Fixed height for uniformity
                      objectFit: 'cover', 
                    }} 
                  />
                  <CardContent sx={{ padding: '16px' }}>
                    <Typography variant="h5" sx={{ textTransform: 'uppercase', mb: 1, fontSize: '1rem', fontWeight: 'bold'}}>
                      {movie.title.length > 20 ? `${movie.title.slice(0, 20)}...` : movie.title} {/* Truncate long titles */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize', fontSize: '0.875rem' }}>
                      Genre: {movie.genre.join(', ')} 
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      component={Link} 
                      to={`/admin/movies/edit/${movie._id}`}
                      startIcon={<Edit />}
                      size="small"
                    >
                      Edit
                    </Button>
                    <IconButton 
                      color="error" 
                      onClick={() => deleteMovie(movie._id)}
                      aria-label="delete movie"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>

          <PaginationComponent
            totalItems={movies.length}
            itemsPerPage={moviesPerPage}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Container>
  );
};

export default MoviesList;