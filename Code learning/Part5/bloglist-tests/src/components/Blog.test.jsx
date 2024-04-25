import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders content', () => {
    const blog = {
        title: 'ABC blog with',
        author: 'HKC',
        url: 'https://localhost',
        likes: 0,
        user: {
            username: 'root'
        }
    }

    render(<Blog blog={blog} />)

    const element = screen.getByText('root')

    screen.debug(element)

    expect(element).toBeDefined()
})

/*
test('after clicking the button, children are displayed', async () => {
    const blog = {
        title: 'ABC blog with',
        author: 'HKC',
        url: 'https://localhost',
        likes: 0,
        user: {
            username: 'root'
        }
    }

    render(<Blog blog={blog} />)

    //const user = userEvent.setup()
    //const button  = screen.getByText('view')
    //await user.click(button)

    //const div = container.querySelector('.blogTogglableContent')

    //expect(div).not.toHaveStyle('display: none')

    const element = await screen.findByText('https://localhost')

    expect(element).toBeDefined()
})
*/

test('clicking the button calls event handler once', async () => {
    const blog = {
        title: 'ABC blog with',
        author: 'HKC',
        url: 'https://localhost',
        likes: 0,
        user: {
            username: 'root'
        }
    }
  
    const mockHandler = vi.fn()
  
    render(
      <Blog blog={blog} toggleLikeOf={mockHandler} />
    )
  
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
  
    expect(mockHandler.mock.calls).toHaveLength(2)
  })