// Throttle middleware
const throttleMiddleware = (req, res, next) => {
    console.log('Throttling request...');
    setTimeout(() => {
        next(); // Proceed to the next middleware or route handler after 2 seconds
    }, 2000); // 2000 milliseconds = 2 seconds
};

module.exports = throttleMiddleware;