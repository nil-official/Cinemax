const mongoose = require('mongoose');

const { Schema } = mongoose;
const showtimeSchema = new Schema({
  startAt: {
    type: Date,
    required: true,
    trim: true,
  },
  endAt: {
    type: Date,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  screenId: {
    type: Schema.Types.ObjectId,
    ref: 'Screen',
    required: true,
  },
});

const Showtime = mongoose.model('Showtime', showtimeSchema);

module.exports = Showtime;
