const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const extractToken = (req) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw { status: 401, message: 'Authorization token missing' };
  }
  return authHeader.replace('Bearer ', '').trim();
};

const verifyUser = async (decoded) => {
  try {
    const user = await User.findOne({
      _id: decoded._id,
      email: decoded.email,
    });

    if (!user) {
      throw { status: 401, message: 'User not found' };
    }
    return user;
  } catch (err) {
    if (err.status && err.message) throw err;
    throw { status: 500, message: 'Database error while verifying user' };
  }
};

const extractUserAndToken = async (req) => {
  const token = extractToken(req);
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (jwtErr) {
    throw { status: 401, message: 'Invalid or expired token' };
  }
  const user = await verifyUser(decoded);
  return { user, token };
};

const authorize = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const { user, token } = await extractUserAndToken(req);

      if (!allowedRoles.includes(user.role)) {
        throw {
          status: 403,
          message: `Access denied: ${allowedRoles.join(' or ')} role required`,
        };
      }

      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      res.status(err.status || 401).json({
        status: "error",
        message: err.message || "Please authenticate.",
      });
    }
  };
};

const simple = authorize(['user', 'admin', 'superadmin']);
const enhance = authorize(['admin', 'superadmin']);
const elevate = authorize(['superadmin']);

module.exports = {
  simple,
  enhance,
  elevate
};