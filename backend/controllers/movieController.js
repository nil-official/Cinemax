const Movie = require("../models/movieSchema");
const Showtime = require("../models/showtimeSchema");

// split this controller into 'nowShowing' and 'upcoming' controllers
// make this controller for admin only
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get movie by id
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createMovie = async (req, res) => {
  const movieData = req.body;

  // Check if a movie with the same title already exists
  const existingMovie = await Movie.findOne({
    title: movieData.title.toLowerCase(),
  });
  if (existingMovie) {
    return res.status(400).send({
      error: "A movie with this title already exists!",
    });
  }
  const movie = new Movie(movieData);
  try {
    await movie.save();
    res.status(201).send(movie);
  } catch (e) {
    // Handle validation errors
    if (e.name === "ValidationError") {
      // Return the first validation error message
      const ErrorMessage = e.errors[Object.keys(e.errors)[0]].message;
      return res.status(400).send({
        error: ErrorMessage, // Send only the first error message
      });
    }
    // Handle other errors
    res.status(500).send({
      error: "Movie creation failed due to an internal error!",
    });
  }
};

const updateMovie = async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "image",
    "cover",
    "language",
    "genre",
    "director",
    "cast",
    "description",
    "duration",
    "releaseDate",
    "endDate",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates!" });

  try {
    const movie = await Movie.findById(_id);
    // Update the movie fields
    updates.forEach((update) => (movie[update] = req.body[update]));
    // Validate the updated movie before saving
    await movie.validate();
    await movie.save();
    return !movie
      ? res.status(404).send({ error: "Movie not found!" })
      : res.send(movie);
  } catch (e) {
    if (e.name === "ValidationError") {
      return res.status(400).send({
        error: e.message, // Send the validation error message
      });
    }
    // Handle other errors
    res.status(500).send({
      error: "Movie update failed due to an internal error!",
    });
  }
};

// Get movies now showing
const getNowShowing = async (req, res) => {
    try {
        const activeShowtimes = await Showtime.find()
            .populate({
                path: 'movieId'
            });
        const activeMovies = [...new Set(activeShowtimes.map(showtime => showtime.movieId))];
        res.status(200).json({
            status: 'success',
            data: activeMovies,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

// Get movies upcoming
const getUpcoming = async (req, res) => {
  try {
      const upcomingMovies = await Movie.find({
          releaseDate: { $gt: new Date() }
      });
      res.status(200).json({
          status: 'success',
          message: 'Upcoming movies fetched successfully',
          data: upcomingMovies,
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({
          status: 'error',
          message: error.message,
      });
  }
};

const deleteMovie = async (req, res) => {
  const _id = req.params.id;
  try {
    const movie = await Movie.findByIdAndDelete(_id);
    return !movie
      ? res.status(404).send({ error: "Movie not found!" })
      : res.send({
          message: "Movie deleted successfully!",
          movie,
        });
  } catch (e) {
    res.status(500).send({
      error: "Movie deletion failed due to an internal error!",
    });
  }
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    getNowShowing,
    getUpcoming,
    deleteMovie,
};
