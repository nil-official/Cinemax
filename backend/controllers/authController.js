const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { oauth2Client } = require('../middlewares/googleClient');
const User = require('../models/userSchema');

// Google OAuth
const googleAuth = async (req, res) => {
    const code = req.query.code;
    try {
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const { email, name, picture } = userRes.data;
        let user = await User.findOne({ email });
        if (!user) {
            const [firstName, lastName] = name.split(' ');
            user = await User.create({
                firstName,
                lastName,
                email,
                avatar: picture,
            });
        }
        const { _id } = user;
        const token = jwt.sign({ _id, email },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        const userData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone,
            role: user.role,
        };
        res.status(200).json({
            status: 'success',
            message: 'Google authentication successful',
            data: { user: userData },
            token,
            expiresIn: process.env.JWT_EXPIRE,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error occured while authenticating with Google: " + err.message
        })
    }
};

// Register user
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Please fill in all fields.",
            });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                status: 'error',
                message: "User already exists with this email: " + email,
            });
        }
        user = await User.create({
            firstName,
            lastName,
            email,
            password,
        });
        const { _id } = user;
        const token = jwt.sign({ _id, email },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        const userData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone,
            role: user.role,
        };
        res.status(201).json({
            status: 'success',
            message: 'Register successful',
            data: { user: userData },
            token,
            expiresIn: process.env.JWT_EXPIRE,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: "User registration failed: " + err.message,
        })
    }
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: "No user found with this email: " + email,
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: 'error',
                message: "Invalid password",
            });
        }
        const { _id } = user;
        const token = jwt.sign({ _id, email },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        const userData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone,
            role: user.role,
        };
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: { user: userData },
            token,
            expiresIn: process.env.JWT_EXPIRE,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: "User login failed: " + err.message,
        })
    }
};

module.exports = {
    googleAuth,
    register,
    login,
};