const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1, title: 1, author: 1
  })
  response.status(200).json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password){
    return response.status(400).json({ error: 'missing password' })
  }

  if (password.length < 3){
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const existingUser = await User.findOne({ username })

  if (existingUser){
    return response.status(400).json({ error: 'Username already taken'
    })
  }
  //const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, name, password })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter