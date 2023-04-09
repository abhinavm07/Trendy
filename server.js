const path = require('path')
const express = require('express')
require('dotenv').config()
require('colors')
const { errorHandler } = require('./middleware/errorHandler')
const connectDB = require('./db/connect')

const PORT = process.env.PORT || 5000

//connect to DB
connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/users', require('./routes/userRoutes'))
// TODO: make this api routes clear
app.use('/api/routes', require('./routes/routeTasks'))

if (process.env.NODE_ENV === 'production') {
  //App is running in production enviroment

  app.use(express.static(path.join(__dirname, '/client/build')))
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('Api is running')
  })
}

app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
