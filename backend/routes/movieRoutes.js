const router = require('express').Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.get('/now/showing', movieController.getNowShowing);
router.get('/now/upcoming', movieController.getUpcoming);
router.get('/featured/get', movieController.getFeaturedMovie);
router.get('/featured/make/:movieId', movieController.makeMovieFeatured);
router.get('/search/q', movieController.searchMovie);

router.post('/', movieController.createMovie);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);


module.exports = router;