const Movie = require("../models/movie");

const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.send(movies);
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": "Internal Server Error"});
    }
}

module.exports = {
    getAllMovies,
};