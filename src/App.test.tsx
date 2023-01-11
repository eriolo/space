import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders Header component', () => {
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <App />
    </MockedProvider>,
  )
  const h1Element = screen.getByText(/Frontend Test/i)
  expect(h1Element).toBeInTheDocument()
})
