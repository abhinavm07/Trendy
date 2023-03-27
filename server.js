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
app.use(errorHandler)

if (process.env.NODE_ENV === 'production') {
  //App is running in production enviroment
  app.get('/', (req, res) => {
    res.send('Api is running in production enviroment')
  })
} else {
  app.get('/', (req, res) => {
    res.send('Api is running')
  })
}

app.use('/api/users', require('./routes/userRoutes'))
app.use('/', require('./routes/routeTasks'))

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
