const router = require('express').Router();
const auth = require('../middlewares/auth');
const movieController = require('../controllers/movieController');

// Public Routes
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.get('/featured/get', movieController.getFeaturedMovie);
router.get('/now/showing', movieController.getNowShowing);
router.get('/now/upcoming', movieController.getUpcoming);
router.get('/search/q', movieController.searchMovie);

// Admin Routes
router.post('/', auth.enhance, movieController.createMovie);
router.put('/:id', auth.enhance, movieController.updateMovie);
router.delete('/:id', auth.enhance, movieController.deleteMovie);
router.post('/featured/make/:movieId', auth.enhance, movieController.makeMovieFeatured);

module.exports = router;