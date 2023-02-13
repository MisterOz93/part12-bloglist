import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Display from './components/Display'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [showBlogs, setShowBlogs] = useState(false)

  const removeMessage = () => {
    setTimeout(() => {
      setMessage(null)
      setError(null)
    }, 5000)
  }

  const sortBlogs = (blogs) => {
    const blogsCopy = [...blogs]
    if (blogs.length > 1){
      blogsCopy.sort((a, b) => b.likes - a.likes)
    }
    setBlogs(blogsCopy)

  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem('bloglistLoggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
    } catch (exception) {
      setError('Invalid Username or Password')
      removeMessage()
    }
    setUsername('')
    setPassword('')
  }

  const createBlog = async (blogObject) => {

    try {
      const newBlog = await blogService.create(blogObject)
      sortBlogs(blogs.concat(newBlog))
      setMessage(`A new blog: ${newBlog.title} by ${newBlog.author} was added.`)
      removeMessage()
    } catch (exception) {
      setError(exception.response.data.error)
      removeMessage()
    }
    setShowBlogs(false)
  }

  const updateBlog = async (blogObject) => {
    try{
      const blogToUpdate = await blogService.getOne(blogObject)
      const updatedBlogObject = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      }
      await blogService.update(blogToUpdate.id, updatedBlogObject)
      const updatedBlogs = await blogService.getAll()
      sortBlogs(updatedBlogs)

    } catch (exception) {
      setError(exception.response.data.error)
      removeMessage()
    }
  }

  const removeBlog = async (blogObject) => {
    try {
      blogService.setToken(user.token)
      await blogService.deleteBlog(blogObject.id)
      const blogsAfterDelete = await blogService.getAll()
      sortBlogs(blogsAfterDelete)
    } catch (exception) {
      setError(exception.response.data.error)
      removeMessage()
    }
  }

  const logOut = () => {
    setUser(null)
    window.localStorage.removeItem('bloglistLoggedInUser')
  }

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('bloglistLoggedInUser')
    if (loggedInUserJSON){
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    const initialBlogs = async () => {
      const blogs = await blogService.getAll()
      sortBlogs(blogs)
    }
    initialBlogs()
  }, [])


  return (
    <div>
      {!user && <LoginForm username={username} password={password} setUsername={setUsername}
        setPassword={setPassword} handleSubmit={handleSubmit} /> }

      {message && <Display message={message} />}
      {error && <Display message={null} error={error} />}

      {user &&
        <div>
          <p>Logged in as {user.username} <button onClick={() => logOut()}>Log Out</button></p>
          {showBlogs === false && <button onClick={() => setShowBlogs(true)}> Add a Blog</button>}
          <BlogForm createBlog={createBlog} visible={showBlogs}/>
          {showBlogs && <button onClick={() => setShowBlogs(false)}>Cancel</button>}
          <h2>Blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user}/>
          )}
        </div>
      }
    </div>
  )
}

export default App
