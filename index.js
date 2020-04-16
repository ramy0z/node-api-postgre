const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API   2222222222222222222' })
})

app.get('/users', db.getMyUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

const PORT = process.env.PORT || 3000;
createApp()
.then(app => app.listen(PORT, () => {console.log(`Our app is running on port ${ PORT }`)}))
