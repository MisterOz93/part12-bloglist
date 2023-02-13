const hardCodedBlogs = require('../utils/list_helper').blogs
const superTest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')
const app = require('../app')
const api = superTest(app)

beforeEach( async () => {
  await Blog.deleteMany({})
  for (let blog of hardCodedBlogs){
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})
describe('GET Request', () => {

  test('returns all blogs as JSON', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(hardCodedBlogs.length)
  })

  test('returns blogs with id property', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('POST Request', () => {
  let token

  beforeAll( async() => {
    const username = 'Master Tester'
    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({
      username, passwordHash
    })
    await user.save()
    const userReady = await User.findOne({ username })
    const userForToken = {
      username: userReady.username,
      id: userReady._id
    }
    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 300 })
  })

  test('Increases size of DB', async () => {
    const initialBlogList = await api.get('/api/blogs')
    const newBlog = {
      title: 'test blog',
      author: 'me',
      url: 'no',
      likes: 1111111,
    }
    await api.post('/api/blogs')
      .set('Authorization',`bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const updatedBlogList = await api.get('/api/blogs')
    expect(updatedBlogList.body).toHaveLength(initialBlogList.body.length + 1)
  }),

  test('adds content of the blog to the DB', async () => {
    const newBlog = {
      title: 'unique',
      author: 'me',
      url: 'idk',
      likes: 42
    }
    await api.post('/api/blogs')
      .set('Authorization',`bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const updatedBlogList = await api.get('/api/blogs')
    expect(updatedBlogList.body.map(blog => blog.title))
      .toContain('unique')
  })

  test('a blog without likes property defaults to 0', async () => {
    const blogWithoutLikes = {
      title: 'unliked',
      url: 'somewhere'
    }
    await api.post('/api/blogs')
      .set('Authorization',`bearer ${token}`)
      .send(blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const updatedBlogList = await api.get('/api/blogs')
    const newBlog = updatedBlogList.body.find(blog => blog.title === 'unliked')
    expect(newBlog.likes).toEqual(0)
  })
  test('a blog without title is not added', async () => {
    const untitledBlog = {
      author: 'Foo',
      url: 'www.com.com',
      likes: 10000000
    }
    await api.post('/api/blogs')
      .set('Authorization',`bearer ${token}`)
      .send(untitledBlog)
      .expect(400)

    const blogListAfter = await api.get('/api/blogs')
    expect(blogListAfter.body).toHaveLength(hardCodedBlogs.length)
  })

  test('a blog without a url is not added', async () => {
    const blogWithoutUrl = {
      title: 'the unfindable blog',
      author: 'foo'
    }
    await api.post('/api/blogs')
      .set('Authorization',`bearer ${token}`)
      .send(blogWithoutUrl)
      .expect(400)
    const blogListAfter = await api.get('/api/blogs')
    expect(blogListAfter.body).toHaveLength(hardCodedBlogs.length)
  })

  test('a blog cannot be added by an unauthorized user', async () => {
    const unauthorizedBlog = {
      title: 'who needs tokens',
      author: 'Bob the Tokenless',
      url: 'www.unauthorized.token',
      likes: 1
    }
    const invalidToken = 'cIsForCookieCookieIsForMe'
    await api.post('/api/blogs')
      .set('Authorization',`bearer ${invalidToken}`)
      .send(unauthorizedBlog)
      .expect(401)
    const blogsAfter = await api.get('/api/blogs')
    expect(blogsAfter.body).toHaveLength(hardCodedBlogs.length)
    expect(blogsAfter.body.map(blog => blog.author)).not.toContain('Bob the Tokenless')
  })

  afterAll( async () => {
    await User.deleteMany({})
  })


})

describe('DELETE Request', () => {
  let token

  beforeAll( async() => {
    const username = 'Master Tester'
    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({
      username, passwordHash
    })
    await user.save()
    const userReady = await User.findOne({ username })
    const userForToken = {
      username: userReady.name,
      id: userReady._id
    }
    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 300 })
  })

  test('Fails to remove a blog with status 401 if user did not create it', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization',`bearer ${token}`)
      .expect(401)
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body.map(blog => blog.title)).toContain('React patterns')
  })

  test('Successfully removes a blog that user created', async () => {
    const blogCreatedByUser = {
      title: 'Created by user defined in beforeAll block',
      author: 'M.T.',
      url: 'www.www.www',
      likes: 42
    }
    await api.post('/api/blogs')
      .set('Authorization',`bearer ${token}`)
      .send(blogCreatedByUser)
      .expect(201)
    const blogsAfterPost = await api.get('/api/blogs')
    expect(blogsAfterPost.body).toHaveLength(hardCodedBlogs.length + 1)
    const blogToDelete = await Blog.findOne({ author: 'M.T.' })
    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization',`bearer ${token}`)
      .expect(204)
    const blogsAfterDelete = await api.get('/api/blogs')
    expect(blogsAfterDelete.body.map(b => b.title)).toEqual(hardCodedBlogs.map(b => b.title))

  })

  afterAll( async () => {
    await User.deleteMany({})
  })

})

describe('PUT Request', () => {
  test('Successfully updates a blog', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = { ...blogsAtStart.body[0], likes: 77 }
    await api.put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(blogsAtStart.body.length)
    expect(blogsAtEnd.body[0].likes).toEqual(77)
  })
})
