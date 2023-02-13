import { useState } from 'react'

const BlogForm = ({ createBlog, visible }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title, author, url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  if (!visible){
    return
  }
  return(
    <form onSubmit={addBlog}>
      <h3>Create New Blog</h3>
      <p>Title: <input id='title' type='text' value={title}
        onChange={({ target }) => setTitle(target.value)} /> </p>
      <p>Author:<input id='author' type='text' value={author}
        onChange={({ target }) => setAuthor(target.value)} /> </p>
      <p>URL:<input id='url' type='text' value={url}
        onChange={({ target }) => setUrl(target.value)} /> </p>
      <button id='create_blog_button' type='submit'>Create Blog</button>
    </form>
  )
}

export default BlogForm