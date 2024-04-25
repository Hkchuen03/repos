import { useState} from 'react'

const Blog = ({blog, toggleLikeOf, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (  
    <li style={blogStyle} className='blog'>
      <div style={hideWhenVisible}>
        {blog.title}  {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className='blogTogglableContent'>
        <div>
          {blog.title}  {blog.author} 
          <button onClick={toggleVisibility}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          {'likes ' + blog.likes} 
          <button onClick={toggleLikeOf}>like</button>
        </div>
        <div>
          {blog.user.username}
        </div>
        <button onClick={removeBlog}>remove</button>
      </div>
    </li> 
  )
}

export default Blog