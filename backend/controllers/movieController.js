const Movie = require("../models/movieSchema");

// split this controller into 'nowShowing' and 'upcoming' controllers
// make this controller for admin only
const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.send(movies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
}

// Get movie by id
const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
    } catch (error) {
        console.log(error);
        res.status(500).json({ "error": "Internal server error" });
    }
};

module.exports = {
    getAllMovies, getMovieById,
};