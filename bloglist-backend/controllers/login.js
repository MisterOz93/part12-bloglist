const jwt = require('jsonwebtoken')
const User = require('../models/user')
const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  const pwCheck = user ?
    (password === user.password)
    :
    false
  if (!pwCheck){
    return response.status(401).json({ error: 'invalid username or password' })
  }
  const userForToken = {
    username: user.username,
    id: user._id
  }
  const token = jwt.sign(userForToken,
    process.env.SECRET, { expiresIn: 60*60 })
  response.status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter

