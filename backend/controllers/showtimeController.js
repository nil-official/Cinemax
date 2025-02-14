const Showtime = require("../models/showtimeSchema");

// Get all showtimes by movie id
const getShowtimesByMovieId = async (req, res) => {
  try {
    const showtimes = await Showtime.find({ movieId: req.params.movieId })
      .populate({
        path: "movieId",
        select: "title language genre",
      })
      .populate({
        path: "screenId",
        select: "name layout",
      });
    res.status(200).json(showtimes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.showtimeId).populate({
      path: "screenId",
      select: "name",
    }).populate({
      path: "movieId",
      select: "title language genre",
    })
    res.status(200).json(showtime);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find().populate({
        path: "movieId",
        select: "title language genre",
    }).populate({
       path: "screenId",
        select: "name",
    });
    res.status(200).json(showtimes);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Create a new showtime
const createShowtime = async (req, res) => {
  try {
    const showtime = new Showtime(req.body);
    // console.log(showtime);
    const saved = await showtime.save();
    console.log(saved);
    res
      .status(201)
      .json({ 
        status: "success",
        message: "Showtime created successfully" ,
        data: saved
      });
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
  }
};

// Update a showtime
const updateShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(
      req.params.showtimeId,
      req.body,
      { new: true }
    );
    if (!showtime) {
      return res.status(404).json({ error: "Showtime not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Showtime updated successfully",
      data: showtime
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a showtime
const deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndDelete(req.params.showtimeId);
    if (!showtime) {
      return res.status(404).json({ error: "Showtime not found" });
    }
    res
      .status(200)
      .json({ 
        status: "success",
        message: "Showtime deleted successfully",
        data: showtime
      });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getShowtimesByMovieId,
  getShowtimeById,
  getAllShowtimes,
  createShowtime,
  updateShowtime,
  deleteShowtime,
};
