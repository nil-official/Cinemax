const Screen = require('../models/screenSchema');

// Get screen by id
const getScreenById = async (req, res) => {
    try {
        const screen = await Screen.findById(req.params.screenId);
        if (!screen) {
            return res.status(404).json({ error: 'Screen not found' });
        }
        res.status(200).json(screen);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Get all screens
const getAllScreens = async (req, res) => {
    try {
        const screens = await Screen.find();
        res.status(200).json(screens);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Create a new screen
const createScreen = async (req, res) => {
    try {
        const screen = new Screen(req.body);
        await screen.save();
        res.status(201).json({ message: "Screen created successfully", screen }); // Updated
    } catch (error) {
        console.log(error); // Log the error for debugging
        res.status(400).json({ error: "Bad Request" }); // Changed to 400 for bad request
    }
};

// Update a screen
const updateScreen = async (req, res) => {
    try {
        const screen = await Screen.findByIdAndUpdate(req.params.screenId, req.body, { new: true });
        if (!screen) {
            return res.status(404).json({ error: 'Screen not found' });
        }
        res.status(200).json(screen);
    } catch (error) {
        console.log(error); // Log the error for debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Delete a screen
const deleteScreen = async (req, res) => {
    try {
        const screen = await Screen.findByIdAndDelete(req.params.screenId);
        if (!screen) {
            return res.status(404).json({ error: 'Screen not found' });
        }
        res.status(200).json({ message: "Screen deleted successfully", screen }); // Updated
    } catch (error) {
        console.log(error); // Log the error for debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getScreenById,
    getAllScreens,
    createScreen,
    updateScreen,
    deleteScreen,
};