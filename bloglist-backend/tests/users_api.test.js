const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('When there is initially one user in DB', () => {
  beforeEach(async() => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'Test User', passwordHash })
    await user.save()
  })
  test('GET request retrieves the user', async() => {
    const request = await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(request.body[0].username).toBe('Test User')
  })
  test('POST request adds a valid user', async() => {
    const usersAtStart = await api.get('/api/users')
    const validUser = {
      username: 'Valid',
      password: 'drowssap'
    }
    await api.post('/api/users')
      .send(validUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await api.get('/api/users')
    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length + 1)
    expect(usersAtEnd.body.map(user => user.username)).toContain('Valid')
  })
  test('POST request does not add user with invalid username',
    async() => {
      const usersAtStart = await api.get('/api/users')
      const invalidUser = {
        username: 'E',
        password: 'password'
      }
      await api.post('/api/users')
        .send(invalidUser)
        .expect(400)
      const usersAtEnd = await api.get('/api/users')
      expect(usersAtStart.body).toHaveLength(usersAtEnd.body.length)
    })
  test('POST does not add user with duplicate username', async () => {
    const usersAtStart = await api.get('/api/users')
    const duplicateUser = {
      username: 'Test User',
      password: 'hello'
    }
    await api.post('/api/users')
      .send(duplicateUser)
      .expect(400)
    const usersAtEnd = await api.get('/api/users')
    expect(usersAtStart.body).toHaveLength(usersAtEnd.body.length)
  })
})