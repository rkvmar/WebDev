const express = require('express')
const router = express.Router()
//const NuevanSchema = require('../models/Nuevan.js')
const AirplaneSchema = require('../models/Airplane.js')
const AirlineSchema = require('../models/Airline.js')

router.get('/airplanes/', (req, res) => {
  AirplaneSchema.find({
  })
    .then(airplanes => {
      console.log("succesfully got entire db!")
      console.log(airplanes)
      res.json(airplanes)
    })
    .catch(err => {
      console.error(err)
    })
})

router.get('/airplanes/:id', (req, res) => {
  AirplaneSchema.findById(req.params.id)
    .then(airplane => {
      console.log("succesfully got one!")
      console.log(airplane)
      res.json(airplane)
    })
    .catch(err => {
      console.error(err)
    })
})


router.post('/airplanes/add', (req, res) => {
  AirplaneSchema.create({
    registration: req.body.registration,
    model: req.body.model,
    airline: req.body.airline,
    category: req.body.category,
    image: req.body.image,
  })
    .then(airplane => {
      console.log(airplane)
      res.json(airplane)
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('Error creating record')
    })
})

router.put('/airplanes/', (req, res) => {
  const { id, update } = req.body;

  AirplaneSchema.findByIdAndUpdate(id, update, { new: true })
    .then(airplane => {
      if (!airplane) {
        return res.status(404).json({ message: 'Plane not found' });
      }
      console.log("Successfully updated!");
      console.log(airplane);
      res.json(airplane);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Error updating document' });
    });
});

router.delete('/airplanes/:id', (req, res) => {
  AirplaneSchema.findByIdAndDelete(req.params.id)
    .then(deleted => {
      res.send(deleted)
    })
    .catch(err => {
      res.json(err)
    })
})

router.get('/airlines/', (req, res) => {
  AirlineSchema.find({
  })
    .then(airlines => {
      console.log("succesfully got entire db!")
      console.log(airlines)
      res.json(airlines)
    })
    .catch(err => {
      console.error(err)
    })
})

router.get('/airlines/:id', (req, res) => {
  AirlineSchema.findById(req.params.id)
    .then(airline => {
      console.log("succesfully got one!")
      console.log(airline)
      res.json(airline)
    })
    .catch(err => {
      console.error(err)
    })
})


router.post('/airlines/add', (req, res) => {
  AirlineSchema.create({
    name: req.body.name,
    fleet: req.body.fleet,
    airplanes: req.body.airplanes
  })
    .then(airline => {
      console.log(airline)
      res.json(airline)
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('Error creating record')
    })
})

router.put('/airlines/', (req, res) => {
  const { id, update } = req.body;

  AirlineSchema.findByIdAndUpdate(id, update, { new: true })
    .then(airline => {
      if (!airline) {
        return res.status(404).json({ message: 'Airline not found' });
      }
      console.log("Successfully updated!");
      console.log(airline);
      res.json(airline);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Error updating document' });
    });
});

router.delete('/airlines/:id', (req, res) => {
  AirlineSchema.findByIdAndDelete(req.params.id)
    .then(deleted => {
      res.send(deleted)
    })
    .catch(err => {
      res.json(err)
    })
})

router.post('/airlines/addplane', (req, res) => {
  const { id, plane } = req.body;
  AirlineSchema.findById(id)
    .then(airline => {
      console.log(airline.airplanes)
      if (plane in airline.airplanes) {
        console.err("plane already in airline")
        return res.status(400).json({ message: 'Plane already in airline' });
      }

    })
  if (AirplaneSchema.findById(plane) == null) {
    console.err("plane not found")
    return res.status(404).json({ message: 'Plane not found' });
  }
  AirlineSchema.findByIdAndUpdate(id, { $push: { airplanes: plane } }, { new: true })
    .then(airline => {
      if (!airline) {
        console.err("airline not found")
        return res.status(404).json({ message: 'Airline not found' });
      }
      console.log("Successfully updated!");
      console.log(airline);
      res.json(airline);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Error updating document' });
    });
})



module.exports = router
