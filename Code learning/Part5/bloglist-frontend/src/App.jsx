import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => a.likes - b.likes))
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  
  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')

    setUser(null)
    setUsername('')
    setPassword('')
  }

  const addBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(
        blogObject
      )

      setBlogs(blogs.concat(blog))
      blogFormRef.current.toggleVisibility()


    } catch (exception) {
      console.log(exception)
      setErrorMessage('Wrong blog details')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  
  const toggleLikeOf = async (id) => {
    const blog = blogs.find(b => b.id === id)
    const likes = Number(blog.likes) + 1
    const changedBlog = { ...blog, likes: likes}

    try{
      await blogService.update(id, changedBlog)

      setBlogs(blogs.map(blog => blog.id !== id ? blog : changedBlog))

    } catch (expcetion) {
      console.log(exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setBlogs(blogs.filter(b => b.id !== id))
    }
  }

  const removeBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm("Remove blog You're NOT gonna need it! by " + blog.author))

    try {
      await blogService.remove(id)

      setBlogs(blogs.filter(b => b.id !== id))
    } catch (expcetion) {
      console.log(exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setBlogs(blogs.filter(b => b.id !== id))
    }
  }

  return (
    <div>
      {!user &&
        <div>
          <h2>log in to application</h2>
          <Notification message={errorMessage} />
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </div>
      }
      {user &&
        <div>
          <h2>blogs</h2>
          <Notification message={errorMessage} />
          <p>{user.username} logged in <button onClick={() => handleLogout()}>logout</button></p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <ul>
            {blogs.map(blog =>
              <Blog 
                key={blog.id.toString()} 
                blog={blog} 
                toggleLikeOf={() => toggleLikeOf(blog.id)}
                removeBlog={() => removeBlog(blog.id)}
              />
            )}
          </ul>
        </div>
      }
    </div>
  )
}

export default App