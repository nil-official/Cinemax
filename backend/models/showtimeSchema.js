const { Schema, model } = require('mongoose');

const showtimeSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
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
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true, });

module.exports = model('Showtime', showtimeSchema);
