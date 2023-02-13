const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]


const dummy = (blogs) => {
  return blogs ? 1 : 1
}

const totalLikes = (blogs=[]) => {
  if (blogs.length === 0){
    return 0
  }
  const likes = blogs.map(blog => blog.likes)
  return likes.reduce((sum, num) => sum + num, 0)
}

const favoriteBlog = (blogs=[]) => {
  if (blogs.length === 0) {
    return blogs
  }
  const favorites = blogs.map(blog => blog.likes).sort((a,b) => b - a)[0]
  const favorite = blogs.filter(blog => blog.likes === favorites)[0]
  return { title: favorite.title, author: favorite.author, likes: favorite.likes }
}

const mostBlogs = (blogs=[]) => {
  if (blogs.length === 0) {
    return blogs
  }
  const count = {}
  blogs.forEach(blog => {
    count[blog.author] = count[blog.author] ? count[blog.author] + 1
      :
      1
  })
  const mostBlogs = Object.entries(count).sort((x, y) => y[1] - x[1])[0]
  return {
    author: mostBlogs[0],
    blogs: mostBlogs[1]
  }
}

const mostLikes = (blogs=[]) => {
  if (blogs.length === 0){
    return blogs
  }
  const likes = {}
  blogs.forEach(blog => {
    likes[blog.author] = likes[blog.author] ?
      likes[blog.author] + blog.likes
      :
      blog.likes
  })
  const mostLikes = Object.entries(likes).sort((x, y) => y[1] - x[1])[0]
  return {
    author: mostLikes[0],
    likes: mostLikes[1]
  }
}

module.exports = { blogs, dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
