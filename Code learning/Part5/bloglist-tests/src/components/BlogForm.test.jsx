import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const input = screen.getByPlaceholderText('write blog title here')
    //const inputAuthor = screen.getByPlaceholderText('write blog author here')
    //const inputUrl = screen.getByPlaceholderText('write blog url here')
    const sendButton = screen.getByText('create')

    await user.type(input, 'ABBBBBB blog from HKC')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)

    console.log(createBlog.mock.calls)
    expect(createBlog.mock.calls[0][0].title).toBe('ABBBBBB blog from HKC')
})