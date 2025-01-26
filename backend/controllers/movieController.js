const Movie = require("../models/movie");

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

module.exports = {
    getAllMovies,
};