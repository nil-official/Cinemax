const Razorpay = require('razorpay');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
    headers: {
        "X-Razorpay-Account": process.env.RAZORPAY_MERCHANT_ID
    }
});

module.exports = instance;

// instance.orders.all().then(console.log).catch(console.error);