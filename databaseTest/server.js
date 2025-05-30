const mongoose = require('mongoose');
const userModel = require('./schema/user.js')

const server = '127.0.0.1:27017';
const database = 'users';  	// Since we made our schema into a model, this should be created

class Database {
  constructor() {
    this._connect()
  }

  _connect() {
    mongoose.connect(`mongodb://${server}/${database}`)
      .then(testingSavingUser())
      .catch(err => {
        console.error('Database connection error')
      })
  }
}

function testingSavingUser() {
  console.log('Database connection successful')
  let user = new userModel({
    name: "roose 2",
    email: "roose@shnebir.com",
  })

  user.save()
    .then(doc => {
      console.log("user " + doc.name + " added to the database")
      console.log(doc)
    })
    .catch(err => {
      console.error(err)
    })

}
module.exports = new Database()
