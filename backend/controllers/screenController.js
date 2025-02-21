const Screen = require('../models/screenSchema');
const Showtime = require('../models/showtimeSchema');

// Get all screens, excluding those where isDeleted is true
const getAllScreens = async (req, res) => {
    try {
        const screens = await Screen.find({ isDeleted: { $ne: true } });

        if (screens.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No screens found',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Screens fetched successfully',
            screens
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error while fetching screens: ' + error.message,
        });
    }
};

// Get screen by id, excluding those where isDeleted is true
const getScreenById = async (req, res) => {
    try {
        const screen = await Screen.findOne({ _id: req.params.screenId, isDeleted: { $ne: true } });

        if (!screen) {
            return res.status(404).json({
                status: 'error',
                message: 'Screen not found with id: ' + req.params.screenId,
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Screen fetched successfully',
            screen
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error while fetching screen: ' + error.message,
        });
    }
};

// Get available time slots for a screen on a specific date
const getAvailableSlots = async (req, res) => {
    try {
        const { date, screenId } = req.body;

        // Validate required fields
        if (!date || !screenId) {
            return res.status(400).json({
                status: 'error',
                message: 'Date and screenId are required',
            });
        }

        // Check if screen exists
        const screen = await Screen.findOne({ _id: screenId, isDeleted: { $ne: true } });
        if (!screen) {
            return res.status(400).json({
                status: 'error',
                message: 'Screen not found with id: ' + screenId,
            });
        }

        // Fetch booked slots for the selected date
        const bookedSlots = await Showtime.find({ screenId, date, isDeleted: { $ne: true } })
            .distinct("timeSlot");

        // Filter available slots
        const availableSlots = screen.timeSlots.filter(slot => !bookedSlots.includes(slot));

        res.status(201).json({
            status: 'success',
            message: 'Available time slots fetched successfully',
            availableSlots,
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error while fetching available time slots: ' + error.message,
        });
    }
};

// Create a new screen
const createScreen = async (req, res) => {
    try {
        const { name, layout, timeSlots } = req.body;

        // Validate required fields
        if (!name || !layout || !timeSlots) {
            return res.status(400).json({
                status: 'error',
                message: 'Screen name, layout, and timeslots are required',
            });
        }

        // Validate screen name
        if (!(await isValidName(name))) {
            return res.status(400).json({
                status: 'error',
                message: 'Screen with this name already exists',
            });
        }

        // Validate layout
        if (!isValidLayout(layout)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid layout structure',
            });
        }

        // Validate timeSlots format and interval
        if (!isValidTimeSlot(timeSlots)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid time slots. Each slot must have a minimum 3.5-hour interval.',
            });
        }

        // Create new screen
        const screen = new Screen({
            name,
            layout,
            timeSlots,
        });

        await screen.save();

        res.status(201).json({
            status: 'success',
            message: 'Screen created successfully',
            screen,
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error while creating screen: ' + error.message,
        });
    }
};

// Helper function to validate screen names (case-insensitive)
const isValidName = async (name) => {

    // Normalize the name by removing leading/trailing spaces and converting to lowercase
    const normalizedName = name.trim().toLowerCase();

    // Check if a screen with the same name already exists
    const existingScreen = await Screen.findOne({
        name: { $regex: `^${normalizedName}$`, $options: 'i' }, // Case-insensitive regex match
        isDeleted: { $ne: true }, // Exclude deleted screens
    });

    // Returns false if a duplicate is found
    return !existingScreen;
};

// Helper function to validate layout structure
const isValidLayout = (layout) => {

    // Check if layout is an array and has at least one element
    if (!Array.isArray(layout) || layout.length === 0) {
        console.log('Invalid layout structure: layout is not an array or is empty');
        return false
    };

    // Check if layout has the required properties
    for (const category of layout) {
        // Check if category has required properties
        if (!category.category || typeof category.category !== 'string') {
            console.log('Invalid layout structure: category is missing or not a string');
            return false
        };
        if (!category.price || typeof category.price !== 'number' || category.price <= 0) {
            console.log('Invalid layout structure: price is missing, not a number, or less than 0');
            return false
        };
        if (!Array.isArray(category.rows) || category.rows.length === 0) {
            console.log('Invalid layout structure: rows is not an array or is empty');
            return false
        };

        for (const row of category.rows) {
            // Check if row has required properties
            if (!row.row || typeof row.row !== 'string') {
                console.log('Invalid layout structure: row is missing or not a string');
                return false
            };
            if (!Array.isArray(row.seats) || row.seats.length === 0) {
                console.log('Invalid layout structure: seats is not an array or is empty');
                return false
            };

            // Check seat structure (should contain numbers as strings or null)
            for (const seat of row.seats) {
                if (seat !== null && !/^\d+$/.test(seat)) {
                    console.log('Invalid layout structure: seat is not a number or null');
                    return false;
                }
            }
        }
    }
    return true;
};

// Helper function to validate time slots (minimum 3.5-hour intervals)
const isValidTimeSlot = (timeSlots) => {

    // Check if timeSlots is an array and has at least one element
    if (!Array.isArray(timeSlots) || timeSlots.length === 0) return false;

    // Check if timeSlots are in the correct format (HH:MM)
    for (let i = 1; i < timeSlots.length; i++) {
        const [prevHour, prevMinute] = timeSlots[i - 1].split(":").map(Number);
        const [currHour, currMinute] = timeSlots[i].split(":").map(Number);

        const prevTimeInMinutes = prevHour * 60 + prevMinute;
        const currTimeInMinutes = currHour * 60 + currMinute;

        // Minimum required gap: 3.5 hours = 210 minutes
        if (currTimeInMinutes - prevTimeInMinutes < 210) {
            return false;
        }
    }
    return true;
};

// Create multiple screens
const createMultipleScreens = async (req, res) => {
    try {
        const screensData = req.body;

        // Validate request body
        if (!Array.isArray(screensData) || screensData.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Request body must be a non-empty array of screens',
            });
        }

        const createdScreens = [];
        const failedScreens = [];

        // Process each screen data
        for (const screenData of screensData) {
            const { name, layout, timeSlots } = screenData;

            let error = null;

            // Validate required fields
            if (!name || !layout || !timeSlots) {
                error = 'Each screen must have a name, layout, and time slots';
            } else if (!(await isValidName(name))) {
                error = `Screen with the name '${name}' already exists`;
            } else if (!isValidLayout(layout)) {
                error = `Invalid layout structure for screen '${name}'`;
            } else if (!isValidTimeSlot(timeSlots)) {
                error = `Invalid time slots for screen '${name}'. Each slot must have a minimum 3.5-hour interval.`;
            }

            if (error) {
                failedScreens.push({ screen: screenData, error });
                continue;
            }

            // Create and save the valid screen
            const screen = new Screen({
                name,
                layout,
                timeSlots,
            });

            await screen.save();
            createdScreens.push(screen);
        }

        res.status(201).json({
            status: 'success',
            message: 'Screens processed successfully',
            createdScreens,
            failedScreens,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error while creating multiple screens: ' + error.message,
        });
    }
};

// Update a screen
const updateScreen = async (req, res) => {
    try {
        const { name, layout, timeSlots } = req.body;

        // Validate required fields
        if (!name || !layout || !timeSlots) {
            return res.status(400).json({
                status: 'error',
                message: 'Screen name, layout, and timeslots are required',
            });
        }

        // Get the screen to be updated
        const screen = await Screen.findOne({ _id: req.params.screenId, isDeleted: { $ne: true } });
        if (!screen) {
            return res.status(404).json({
                status: 'error',
                message: 'Screen not found with id: ' + req.params.screenId,
            });
        }

        // Only validate screen name if it is being changed
        if (name !== screen.name && !(await isValidName(name))) {
            return res.status(400).json({
                status: 'error',
                message: 'Screen with this name already exists',
            });
        }

        // Validate layout
        if (!isValidLayout(layout)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid layout structure',
            });
        }

        // Validate timeSlots format and interval
        if (!isValidTimeSlot(timeSlots)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid time slots. Each slot must have a minimum 3.5-hour interval.',
            });
        }

        // Update screen
        screen.name = name;
        screen.layout = layout;
        screen.timeSlots = timeSlots;
        await screen.save();

        res.status(200).json({
            status: 'success',
            message: 'Screen updated successfully',
            screen,
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error while updating screen: ' + error.message,
        });
    }
};

// Soft delete a screen by setting isDeleted to true
const deleteScreen = async (req, res) => {
    try {
        const screen = await Screen.findById(req.params.screenId);

        if (!screen) {
            return res.status(404).json({
                status: 'error',
                message: 'Screen not found with id: ' + req.params.screenId,
            });
        }

        if (screen.isDeleted) {
            return res.status(400).json({
                status: 'error',
                message: 'Screen is already deleted with id: ' + req.params.screenId,
            });
        }

        // Soft delete the screen
        screen.isDeleted = true;
        await screen.save();

        res.status(200).json({
            status: 'success',
            message: 'Screen marked as deleted successfully',
            screen
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error while deleting screen: ' + error.message,
        });
    }
};

module.exports = {
    getAllScreens,
    getScreenById,
    getAvailableSlots,
    createScreen,
    createMultipleScreens,
    updateScreen,
    deleteScreen,
};