import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('Creates a Blog with the given input on submit', async () => {
    const user = userEvent.setup()
    const dummy = jest.fn()
    render(<BlogForm createBlog={dummy} visible={true} />)
    const inputFields = screen.getAllByRole('textbox')
    await user.type(inputFields[0], 'Title Foo')
    await user.type(inputFields[1], 'Author Bar')
    await user.type(inputFields[2], 'url')
    const submitButton = screen.getByText('Create Blog')
    await user.click(submitButton)

    expect(dummy.mock.calls).toHaveLength(1)
    expect(dummy.mock.calls[0][0].title).toBe('Title Foo')
    expect(dummy.mock.calls[0][0].author).toBe('Author Bar')
    expect(dummy.mock.calls[0][0].url).toBe('url')
  })





})