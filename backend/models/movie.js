const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;
const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  image: {
    type: String,
  },
  cover: {
    type: String,
  },
  language: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  genre: [{
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  }],
  director: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  cast: {
    type: [String],
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => {
        return value.length > 1;
      },
      message: 'Cast should have at least two member',
    },
  },
  description: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;