const Showtime = require("../models/showtimeSchema");
const Movie = require("../models/movieSchema");
const Screen = require("../models/screenSchema");

// Get all showtimes, excluding those where isDeleted is true
const getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find({ isDeleted: { $ne: true } })
      .populate({
        path: "movieId",
        select: "title language genre",
      }).populate({
        path: "screenId",
        select: "name",
      });

    if (showtimes.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No showtimes found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Showtimes fetched successfully',
      showtimes
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error while fetching showtimes: ' + error.message,
    });
  }
};

// Get showtime by id, excluding those where isDeleted is true
const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findOne({ _id: req.params.showtimeId, isDeleted: { $ne: true } })
      .populate({
        path: "screenId",
        select: "name",
      }).populate({
        path: "movieId",
        select: "title language genre",
      });

    if (!showtime) {
      return res.status(404).json({
        status: 'error',
        message: 'Showtime not found with id: ' + req.params.showtimeId,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Showtime fetched successfully',
      showtime
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error while fetching showtime: ' + error.message,
    });
  }
};

// Get showtimes by movie id, excluding those where isDeleted is true
const getShowtimesByMovieId = async (req, res) => {
  try {
    const showtimes = await Showtime.find({ movieId: req.params.movieId, isDeleted: { $ne: true } })
      .populate({
        path: "movieId",
        select: "title language genre",
      })
      .populate({
        path: "screenId",
        select: "name layout",
      });

    if (showtimes.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No showtimes found for movie with id: ' + req.params.movieId,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Showtimes fetched successfully',
      showtimes
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error while fetching showtimes: ' + error.message,
    });
  }
};

// Create a new showtime
const createShowtime = async (req, res) => {
  try {
    const { date, timeSlot, movieId, screenId } = req.body;

    // Validate required fields
    if (!date || !timeSlot || !movieId || !screenId) {
      return res.status(400).json({
        status: 'error',
        message: 'Date, timeSlot, movieId and screenId are required',
      });
    }

    // Check if movie exists
    const movie = await Movie.findOne({ _id: movieId, isDeleted: { $ne: true } });
    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found with id: ' + movieId,
      });
    }

    // Check if screen exists
    const screen = await Screen.findOne({ _id: screenId, isDeleted: { $ne: true } });
    if (!screen) {
      return res.status(404).json({
        status: 'error',
        message: 'Screen not found with id: ' + screenId,
      });
    }

    // Validate timeSlot exists in screen's timeSlots
    if (!Array.isArray(screen.timeSlots) || !screen.timeSlots.includes(timeSlot)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid time slot '${timeSlot}' for the selected screen with id: ${screenId}`,
      });
    }

    // Check if the timeSlot is already booked
    const existingShowtime = await Showtime.findOne({ date, timeSlot, screenId, isDeleted: { $ne: true } });
    if (existingShowtime) {
      return res.status(409).json({
        status: 'error',
        message: `Time slot ${timeSlot} is already associated for date ${date} for screen with id: ${screenId}`,
      });
    }

    // Create new showtime
    const showtime = new Showtime({
      date,
      timeSlot,
      movieId,
      screenId
    });

    await showtime.save();

    res.status(201).json({
      status: 'success',
      message: 'Showtime created successfully',
      showtime,
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error while creating showtime: ' + error.message,
    });
  }
};

// Create multiple showtimes
const createMultipleShowtimes = async (req, res) => {
  try {
    const showtimesData = req.body;

    // Validate input
    if (!Array.isArray(showtimesData) || showtimesData.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'An array of showtimes is required',
      });
    }

    const createdShowtimes = [];
    const failedShowtimes = [];

    // Extract unique movie and screen IDs to minimize DB queries
    const movieIds = [...new Set(showtimesData.map(showtime => showtime.movieId))];
    const screenIds = [...new Set(showtimesData.map(showtime => showtime.screenId))];

    // Fetch all movies and screens in parallel
    const [movies, screens] = await Promise.all([
      Movie.find({ _id: { $in: movieIds }, isDeleted: { $ne: true } }),
      Screen.find({ _id: { $in: screenIds }, isDeleted: { $ne: true } }),
    ]);

    const movieMap = new Map(movies.map(movie => [movie._id.toString(), movie]));
    const screenMap = new Map(screens.map(screen => [screen._id.toString(), screen]));

    for (const showtimeData of showtimesData) {
      const { date, timeSlot, movieId, screenId } = showtimeData;

      // Validate required fields
      if (!date || !timeSlot || !movieId || !screenId) {
        failedShowtimes.push({ showtimeData, error: 'Date, timeSlot, movieId and screenId are required' });
        continue;
      }

      // Check if movie exists
      if (!movieMap.has(movieId)) {
        failedShowtimes.push({ showtimeData, error: `Movie not found with id: ${movieId}` });
        continue;
      }

      // Check if screen exists
      const screen = screenMap.get(screenId);
      if (!screen) {
        failedShowtimes.push({ showtimeData, error: `Screen not found with id: ${screenId}` });
        continue;
      }

      // Validate timeSlot
      if (!Array.isArray(screen.timeSlots) || !screen.timeSlots.includes(timeSlot)) {
        failedShowtimes.push({ showtimeData, error: `Invalid timeSlot '${timeSlot}' for screen ${screenId}` });
        continue;
      }

      // Check if the timeSlot is already booked
      const existingShowtime = await Showtime.findOne({ date, timeSlot, screenId, isDeleted: { $ne: true } });
      if (existingShowtime) {
        failedShowtimes.push({
          showtimeData,
          error: `Time slot '${timeSlot}' is already associated for date '${date}' for screen with id: '${screenId}'`,
        });
        continue;
      }

      // Create showtime
      const showtime = new Showtime({
        date,
        timeSlot,
        movieId,
        screenId
      });

      await showtime.save();

      createdShowtimes.push(showtime);
    }

    res.status(201).json({
      status: 'success',
      message: 'Showtimes processed successfully',
      createdShowtimes,
      failedShowtimes,
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error while creating multiple showtimes: ' + error.message,
    });
  }
};

// Update a showtime
const updateShowtime = async (req, res) => {
  try {
    const { date, timeSlot, movieId, screenId } = req.body;

    // Validate required fields
    if (!date || !timeSlot || !movieId || !screenId) {
      return res.status(400).json({
        status: "error",
        message: "Date, timeSlot, movieId and screenId are required",
      });
    }

    // Check if movie exists
    const movie = await Movie.findOne({ _id: movieId, isDeleted: { $ne: true } });
    if (!movie) {
      return res.status(404).json({
        status: "error",
        message: "Movie not found with id: " + movieId,
      });
    }

    // Check if screen exists
    const screen = await Screen.findOne({ _id: screenId, isDeleted: { $ne: true } });
    if (!screen) {
      return res.status(404).json({
        status: "error",
        message: "Screen not found with id: " + screenId,
      });
    }

    // Validate timeSlot exists in screen's timeSlots
    if (!Array.isArray(screen.timeSlots) || !screen.timeSlots.includes(timeSlot)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid time slot '${timeSlot}' for the selected screen with id: ${screenId}`,
      });
    }

    // Check if the timeSlot is already booked by another showtime
    const existingShowtime = await Showtime.findOne({
      date,
      timeSlot,
      screenId,
      _id: { $ne: req.params.showtimeId },
      isDeleted: { $ne: true },
    });
    if (existingShowtime) {
      return res.status(400).json({
        status: "error",
        message: `Time slot ${timeSlot} is already accociated for date ${date} for screen with id: ${screenId}`,
      });
    }

    // Update the showtime
    const updatedShowtime = await Showtime.findByIdAndUpdate(
      req.params.showtimeId,
      { date, timeSlot, movieId, screenId },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Showtime updated successfully",
      showtime: updatedShowtime,
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error while updating showtime: " + error.message
    });
  }
};

// Delete a showtime
const deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.showtimeId);

    if (!showtime) {
      return res.status(404).json({
        status: 'error',
        message: 'Showtime not found with id: ' + req.params.showtimeId,
      });
    }

    if (showtime.isDeleted) {
      return res.status(400).json({
        status: 'error',
        message: 'Showtime is already deleted with id: ' + req.params.showtimeId,
      });
    }

    // Soft delete the screen
    showtime.isDeleted = true;
    await showtime.save();

    res.status(200).json({
      status: 'success',
      message: 'Showtime marked as deleted successfully',
      showtime
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error while deleting showtime: ' + error.message,
    });
  }
};

module.exports = {
  getAllShowtimes,
  getShowtimeById,
  getShowtimesByMovieId,
  createShowtime,
  createMultipleShowtimes,
  updateShowtime,
  deleteShowtime,
};