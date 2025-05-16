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
    default: "N/A"
  },
  airline: {
    type: String,
    default: "N/A"
  },
  category: {
    type: String,
    enum: ["Passenger", "Cargo", "GA"]
  }

});

module.exports = mongoose.model("Airplane", airplaneSchema);
