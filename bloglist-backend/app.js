const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')


mongoose.connect(config.MONGO_URI).then( () => {
  logger.info('Connected to Mongo DB')
})

app.use(cors())
app.use(express.json())
app.use(middleware.isolateToken)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test'){
  const testRouter = require('./controllers/tests')
  app.use('/api/testing', testRouter)
}

app.use(middleware.errorHandler)

module.exports = app