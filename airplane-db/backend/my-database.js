const mongoose = require('mongoose');

const server = '127.0.0.1:27017';
const database = 'airplanes';
class Database {
  constructor() {
    this._connect()
  }

  _connect() {
    mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(dbSuccess())
      .catch(err => {
        console.error('Database connection error')
      })
  }
}

function dbSuccess() {
  console.log('Database connection successful')
}

module.exports = new Database()
