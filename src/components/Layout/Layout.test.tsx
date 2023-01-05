import { render, screen } from '@testing-library/react'

import Layout from './Layout'
import '@testing-library/jest-dom'

describe('Layout', () => {
  it('renders children', () => {
    render(
      <Layout>
        <h1>Hello</h1>
      </Layout>,
    )

    const heading = screen.getByText('Hello')

    expect(heading).toBeInTheDocument()
  })
})
