const router = require('express').Router();
const movieController = require('../controllers/movieController');

// Get all movies
router.get('/movies', movieController.getAllMovies);


module.exports = router;