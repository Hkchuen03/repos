const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')
const { requestLogger } = require('../utils/middleware')

beforeEach(async () => {
    await Blog.deleteMany({})

    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are four blogs', async () => {
    const reponse = await api.get('/api/blogs')

    assert.strictEqual(reponse.body.length, 4)
})

test('viewing a specific blog', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'This is test',
        author: 'myself',
        url: 'http://localhost',
        likes: 8
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    assert(titles.includes('This is test'))
})

test('blog without likes can be added', async () => {
    const newBlog = {
        title: 'This is test22',
        author: 'myself',
        url: 'http://localhost'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const blog = response.body.find(r => r.title === 'This is test22')

    assert.strictEqual(blog.likes, 0)
})

test('blog without title is not added', async () => {
    const newBlog = {
        author: 'myself',
        url: 'http://localhost',
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
    const newBlog = {
        title: 'This is test',
        author: 'myself',
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a valid blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
        title: 'This is aaaaaa testsetsett',
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(r => r.title)
    assert(titles.includes(updatedBlog.title))
})

after(async () => {
    await mongoose.connection.close()
})