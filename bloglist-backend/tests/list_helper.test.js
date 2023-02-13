const hardCodedBlogs = require('../utils/list_helper').blogs
const dummy = require('../utils/list_helper').dummy
const totalLikes = require('../utils/list_helper').totalLikes
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes


describe('dummy', () => {
  test('returns 1 with empty parameter', () => {
    expect(dummy()).toEqual(1)
  })
  test('returns 1 with parameter', () => {
    expect(dummy([])).toEqual(1)
  })
})

describe('totalLikes', () => {
  test('of empty list is 0', () => {
    expect(totalLikes([])).toEqual(0)
  })
  test('of a single blog equals its likes', () => {
    const singleBlog = {
      title: 'foo',
      author: 'bar',
      url: 'w/e',
      likes: 42
    }
    expect(totalLikes([singleBlog])).toEqual(42)
  })
  test('of several blogs to equal total likes', () => {
    expect(totalLikes(hardCodedBlogs)).toEqual(36)
  })
})

describe('favoriteBlog', () => {
  test('of empty list is empty list', () => {
    expect(favoriteBlog([])).toEqual([])
  })
  test('of list with 1 blog is that blog', () => {
    const blog = {
      title: hardCodedBlogs[0].title,
      author: hardCodedBlogs[0].author,
      likes: hardCodedBlogs[0].likes
    }
    expect(favoriteBlog([hardCodedBlogs[0]])).toEqual(blog)
  })
  test('of list with several blogs is most liked', () => {
    expect(favoriteBlog(hardCodedBlogs)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

describe('mostBlogs', () => {
  test('of empty list returns empty list', () => {
    expect(mostBlogs([])).toEqual([])
  })
  test('of one blog returns author of that blog', () => {
    expect(mostBlogs([hardCodedBlogs[0]])).toEqual({
      author: 'Michael Chan',
      blogs: 1
    })
  })
  test('of many blogs returns author with most blogs & amount',
    () => {
      expect(mostBlogs(hardCodedBlogs)).toEqual({
        author: 'Robert C. Martin',
        blogs: 3
      })
    })
})

describe('mostLikes', () => {
  test('of empty array returns empty array', () => {
    expect(mostLikes([])).toEqual([])
  })
  test('of one blog returns the author and likes of blog', () => {
    expect(mostLikes([hardCodedBlogs[0]])).toEqual({
      author: 'Michael Chan',
      likes: 7
    })
  })
  test('of many blogs returns author with most likes & amount', () => {
    expect(mostLikes(hardCodedBlogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})