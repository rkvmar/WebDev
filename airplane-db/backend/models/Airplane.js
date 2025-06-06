const mongoose = require('mongoose')
const Schema = mongoose.Schema

const airplaneSchema = new Schema({
  registration: {
    type: String,
    required: true,
    unique: true
  },
  model: {
    type: String,
    required: true,
    default: "N/A"
  },
  airline: {
    type: String,
    required: true,
    default: "N/A"
  },
  category: {
    type: String,
    enum: ["Passenger", "Cargo", "GA"],
    default: "Passenger"
  },
  image: {
    type: String,
  },
  found: {
    type: Boolean,
    required: true,
    default: false
  }

});

module.exports = mongoose.model("Airplane", airplaneSchema);
