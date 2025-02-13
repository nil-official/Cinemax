const router = require('express').Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);

module.exports = router;