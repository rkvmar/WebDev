const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.sendFile(__dirname + '/test.html'))
app.post('/test', (req, res) => {
  console.log(req.body)
})
app.listen(port, () => console.log(`App listening on port ${port}!`))

