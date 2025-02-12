const { Schema, model } = require('mongoose');

const screenSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    layout: [{
        category: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        rows: [{
            row: {
                type: String,
                required: true
            },
            seats: [{
                type: String
            }]
        }]
    }],
});

module.exports = model('Screen', screenSchema);