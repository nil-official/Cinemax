import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Container, Box, Chip, Grid, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Icon for showtimes
import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { selectMovie, fetchMovies } from '../store/actions/movies';
import { resetShowtimes } from '../store/actions/showtimes';
import {format} from 'date-fns';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  mainContent: {
    // position: 'relative',
    // padding: theme.spacing(4),
    // color: '#fff',
    // backgroundSize: 'cover',
    // backgroundPosition: 'center',
    // borderRadius: theme.shape.borderRadius,
    // overflow: 'hidden',
    // boxShadow: theme.shadows[5],
    display:'flex',
    justifyContent:'center',
    flexDirection:'column',
    
  },
  moviePoster: {
    zIndex: 2,
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    height: 'auto',
    boxShadow: theme.shadows[3],
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  button: {
    marginBottom: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  infoSection: {
    padding: theme.spacing(1),
    border: '1px solid #ccc',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: theme.shadows[3],
    marginLeft: 2,
  },
  movieDetails: {
    padding: theme.spacing(2),
    // borderRadius: theme.shape.borderRadius,
  },
  infoItem: {
    marginBottom: theme.spacing(1),
    // marginLeft: theme.spacing(1),
  },
  infoTitle: {
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
}));

const MoviePage = () => {
  const classes = useStyles();
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { movies, selectedMovie, status } = useSelector((state) => state.movieState);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMovies());
    }
  }, [status, dispatch]);


    useEffect(() => {
        if (!selectedMovie && status === 'succeeded' && movieId) {
            const movie = movies.find((movie) => movie._id === movieId);
            if (movie) {
                dispatch(selectMovie(movie));
            }
        }
    }, [status, movieId, dispatch, movies]);

    const handleGetShowtimesClick =() => {
        dispatch(resetShowtimes());
        navigate(`/movie/${movieId}/showtimes`)
    }
    
    const handleBack = () => {
      navigate(-1);
    };

  // If the movie is not selected, return a loading state or a message
  if (!selectedMovie) {
    return <Typography>Loading...</Typography>;
  }

  const movie = selectedMovie; 
  return (
    <div style={{height:'100vh'}}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Movie Details
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.mainContent}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={4}>
            <img
              src={movie.image}
              alt={`Poster of ${movie.title}`}
              className={classes.moviePoster}
            />
          </Grid>
          <Grid item xs={12} lg={8} className={classes.movieDetails}>
            <Typography variant="h3" gutterBottom>
              {movie.title}
            </Typography>
            <Box display="flex" flexWrap="wrap" mb={2} textTransform='capitalize'>
              {movie.genre.map((g, index) => (
                <Chip key={index} label={g} className={classes.chip} />
              ))}
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Chip label={`${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`} className={classes.chip}/>
            </Box>
            <Typography paragraph>
              {movie.description}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Button color="secondary" className={classes.button} startIcon={<AccessTimeIcon />} variant="contained" onClick={handleGetShowtimesClick}>
                Get Show Time
              </Button>
            </Box>
            <Grid container spacing={2} className={classes.infoSection}>
              <Grid item xs={12} md={4} className={classes.infoItem}>
                <Typography variant="subtitle1" className={classes.infoTitle} gutterBottom>
                  Director
                </Typography>
                <Typography>{movie.director}</Typography>
              </Grid>
              <Grid item xs={12} md={4} className={classes.infoItem}>
                <Typography variant="subtitle1" className={classes.infoTitle} gutterBottom>
                  Cast
                </Typography>
                <Typography>{movie.cast.join(' • ')}</Typography>
              </Grid>
              <Grid item xs={12} md={4} className={classes.infoItem}>
                <Typography variant="subtitle1" className={classes.infoTitle} gutterBottom>
                  Release Date
                </Typography>
                <Typography> {format(new Date(movie.releaseDate), "do MMMM yyyy")}</Typography>
                <Typography variant="subtitle1" className={classes.infoTitle} gutterBottom>
                  End date 
                </Typography>
                <Typography> {format(new Date(movie.endDate), "do MMMM yyyy")}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default MoviePage;