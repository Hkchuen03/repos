const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const User = require('../models/user')
const Blog = require('../models/blog')

const { requestLogger } = require('../utils/middleware')

describe('when there is initially some blogs saved', () => {
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
    
        assert.strictEqual(reponse.body.length, helper.initialBlogs.length)
    })

    describe('viewing a specific blog', () => {

        test('succeeds with a valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const blogToView = blogsAtStart[0]
        
            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
        
            assert.deepStrictEqual(resultBlog.body, blogToView)
        })

    })

    describe('a valid blog can be added', () => {
        test('succeeds with valida data', async () => {
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

        test('fails with status code 400 if title is missing', async () => {
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
        
        test('fails with status code 400 if url is missing', async () => {
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

})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'mluukkai',
          name: 'Matti Luukkainen',
          password: 'salainen',
        }
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
    
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
})