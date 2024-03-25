const blogsRouter = require('express').Router()
const blog = require('../models/blog')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, reponse) => {
  const blogs = await Blog.find({})
  reponse.json(blogs)
})

blogsRouter.get('/:id', async (request, reponse) => {
  const blog = await Blog.findById(request.params.id)
  if(blog) {
    reponse.json(blog)
  } else {
    reponse.status(404).end()
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (expection) {
    next(expection)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const updateBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updateBlog)
  } catch (expection) {
    next(expection)
  }
})

blogsRouter.delete('/:id', async (request, reponse, next) => {
  await Blog.findByIdAndDelete(request.params.id)
  reponse.status(204).end()
})

module.exports = blogsRouter