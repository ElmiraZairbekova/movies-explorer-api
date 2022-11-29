const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  validationCreateMovie,
  validationDeleteMovie,
} = require('../utils/validations');

router.get('/', getMovies);
router.post('/', validationCreateMovie, createMovie);
router.delete('/:movieId', validationDeleteMovie, deleteMovie);

module.exports = router;
