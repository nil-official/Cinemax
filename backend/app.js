require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require("cors");
const throttler = require('./utils/throttleMiddleware')

// Routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const movieRouter = require('./routes/movieRoutes');
const showtimeRouter = require('./routes/showtimeRoutes');
const screenRouter = require('./routes/screenRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');

const app = express();
app.disable('x-powered-by');
const port = process.env.PORT || 5000

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(cors());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization'
  );

  // Pass to next layer of middleware
  next();
});

app.use(express.json());

// comment this out to disable throttling
// app.use(throttler);

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/movies', movieRouter);
app.use('/showtimes', showtimeRouter);
app.use('/screens', screenRouter);
app.use('/payments', paymentRouter);
app.use('/bookings', bookingRouter);
app.use('/dashboard', dashboardRouter);

app.listen(port, () => console.log(`app is running in PORT: ${port}`));