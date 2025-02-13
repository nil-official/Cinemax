const Showtime = require('../models/showtime');

// Get all showtimes by movie id
exports.getShowtimesByMovieId = async (req, res) => {
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

// Get showtime by id
exports.getShowtimeById = async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.showtimeId)
        res.status(200).json(showtime);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Create a new showtime
exports.createShowtime = async (req, res) => {
    try {
        const showtime = new Showtime(req.body);
        await showtime.save();
        res.status(201).json({ "message": "Showtime created successfully" }, showtime);
    } catch (error) {
        res.status(400).json({ "error": "Internal Server Error" });
    }
};

// Update a showtime
exports.updateShowtime = async (req, res) => {
    try {
        const showtime = await Showtime.findByIdAndUpdate(req.params.showtimeId, req.body, { new: true });
        if (!showtime) {
            return res.status(404).json({ error: 'Showtime not found' });
        }
        res.status(200).json(showtime);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Delete a showtime
exports.deleteShowtime = async (req, res) => {
    try {
        const showtime = await Showtime.findByIdAndDelete(req.params.showtimeId);
        if (!showtime) {
            return res.status(404).json({ error: 'Showtime not found' });
        }
        res.status(200).json({ "message": "Showtime deleted successfully" }, showtime);
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error" });
    }
}
