const Screen = require('../models/screenSchema');

// Get screen by id
const getScreenById = async (req, res) => {
    try {
        const screen = await Screen.findById(req.params.screenId);
        res.status(200).json(screen);
    } catch (error) {
        console.log(error);
        res.status(500).json({ "error" : "Internal server error" });
    }
}

const createScreen = async (req, res) => {
    try {
        const screen = await Screen.create(req.body);
        res.status(201).json(screen);
    } catch (error) {
        console.log(error);
        res.status(500).json({ "error" : "Internal server error" });
    }
}

module.exports = {
    getScreenById,
    createScreen,
}