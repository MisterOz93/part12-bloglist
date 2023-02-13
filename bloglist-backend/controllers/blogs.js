const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
require('express-async-errors')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  return response.json(blog)
})

blogsRouter.post('/', middleware.isolateUser, async (request, response) => {
  const postedBlog = request.body
  if (!request.user){
    return response.status(401).json({ error: 'Missing or invalid token.' })
  }
  const user = request.user
  const blog = new Blog({
    title: postedBlog.title,
    author: postedBlog.author,
    user: user,
    url: postedBlog.url,
    likes: postedBlog.likes ? postedBlog.likes : 0
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.isolateUser, async (request, response) => {
  if (!request.user){
    return response.status(401).json({ error: 'Missing or invalid token.' })
  }
  const user = request.user
  if (!user._id){
    return response.status(400).json({ error: 'The Blog does not have a user associated with it.' })
  }
  const blogToDelete = await Blog.findById(request.params.id)
  if (!blogToDelete){
    return response.status(400).json({ error: 'The blog was already deleted' })
  }
  if ( !blogToDelete.user || user._id.toString() !== blogToDelete.user.toString()){
    return response.status(401).json({ error: 'Blog can only be deleted by its creator' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    user: body.user,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, blog, {
      new: true, runValidators: true, context: 'query'
    }
  )
  response.json(updatedBlog)
})

module.exports = blogsRouter