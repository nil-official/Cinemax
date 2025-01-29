const router = require('express').Router();
const movieController = require('../controllers/movieController');

// Get all movies
router.get('/movies', movieController.getAllMovies);

// Get movie by id
router.get('/movies/:id', movieController.getMovieById);

module.exports = router;