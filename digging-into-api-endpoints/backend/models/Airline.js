const mongoose = require('mongoose')
const AirplaneSchema = require('./Airplane.js')
const Schema = mongoose.Schema

const airlineSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  fleet: {
    type: Array,
    default: "N/A"
  },
  airplanes: {
    type: [AirplaneSchema.ObjectId],
    default: []
  }
});

module.exports = mongoose.model("Airline", airlineSchema);
