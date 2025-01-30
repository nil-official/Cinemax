const Showtime = require('../models/showtime');

// Get all showtimes by movie id
const getShowtimesByMovieId = async (req, res) => {
    try {
        const showtimes = await Showtime.find({ movieId: req.params.movieId })
            .populate({
                path: 'movieId',
                select: 'title language genre'
            })
            .populate({
                path: 'screenId',
                select: 'name price'
            })
        res.status(200).json(showtimes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ "error": "Internal server error" });
    }
};

module.exports = {
    getShowtimesByMovieId
};