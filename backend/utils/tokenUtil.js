const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const fetchUserFromToken = async (token) => {
    try {
        if (!token) {
            throw new Error('No token provided');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.error('Error fetching user from token:', error);
        throw error;
    }
};

const extractTokenFromReq = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        throw new Error('No token provided');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error('Invalid token format');
    }
    return token;
};

module.exports = {
    fetchUserFromToken,
    extractTokenFromReq,
};