const Movie = require('../models/movie');
const BadRequest = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ owner, ...req.body })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};

// const createMovie = (req, res, next) => {
//   const {
//     country,
//     director,
//     duration,
//     year,
//     description,
//     image,
//     trailerLink,
//     thumbnail,
//     movieId,
//     nameRU,
//     nameEN,
//   } = req.body;
//   Movie.create({
//     country,
//     director,
//     duration,
//     year,
//     description,
//     image,
//     trailerLink,
//     thumbnail,
//     movieId,
//     nameRU,
//     nameEN,
//     owner: req.user._id,
//   })
//     .then((movie) => res.send(movie))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequest('Переданы некорректные данные'));
//       } else {
//         next(err);
//       }
//     });
// };

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFoundError(`Фильм с id ${req.params.movieId} не найден`);
    })
    .then((movie) => {
      if (movie.owner.toString() === userId) {
        return Movie.findByIdAndRemove(movieId)
          .then((deletedMovie) => res.send(deletedMovie))
          .catch(next);
      }
      throw new ForbiddenError('В доступе отказано');
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};