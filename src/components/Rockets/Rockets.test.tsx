import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import React from 'react'
import { act } from 'react-dom/test-utils'
import Rockets, { GET_ROCKETS_QUERY } from './Rockets'

test('should by default render rockets with weight by weight in ascending order', async () => {
  const rocketsMock = {
    request: {
      query: GET_ROCKETS_QUERY,
      variables: { limit: 10, offset: 0 },
    },
    result: getResponse(),
  }
  render(
    <MockedProvider mocks={[rocketsMock]} addTypename={false}>
      <Rockets />
    </MockedProvider>,
  )
  expect(await screen.findByText('Loading...')).toBeInTheDocument()
  const rocketRows = await screen.findAllByTestId('rocket-row')
  expect(rocketRows.length).toEqual(4)

  const rocketWeights = rocketRows.map(row => row.querySelector('td:nth-of-type(2)')?.textContent)
  expect(rocketWeights).toEqual(['30146', '549054', '1335000', '1420788'])
})

test('should sort by descending order on button click', async () => {
  const rocketsMock = {
    request: {
      query: GET_ROCKETS_QUERY,
      variables: { limit: 10, offset: 0 },
    },
    result: getResponse(),
  }
  render(
    <MockedProvider mocks={[rocketsMock]} addTypename={false}>
      <Rockets />
    </MockedProvider>,
  )
  expect(await screen.findByText('Loading...')).toBeInTheDocument()
  const sortButton = await screen.findByRole('button', { name: /Sort/i })
  expect(sortButton).toBeInTheDocument()
  act(() => sortButton.click())

  const rocketRows = await screen.findAllByTestId('rocket-row')
  expect(rocketRows.length).toEqual(4)
  const rocketWeights = rocketRows.map(row => row.querySelector('td:nth-of-type(2)')?.textContent)
  expect(rocketWeights).toEqual(['1420788', '1335000', '549054', '30146'])
})

test('should handle network error', async () => {
  const rocketsMock = {
    request: {
      query: GET_ROCKETS_QUERY,
      variables: { limit: 10, offset: 0 },
    },
    error: new Error('An error occurred'),
  }
  render(
    <MockedProvider mocks={[rocketsMock]} addTypename={false}>
      <Rockets />
    </MockedProvider>,
  )

  expect(await screen.findByText('Loading...')).toBeInTheDocument()
  expect(await screen.findByText('Fetching rockets failed')).toBeInTheDocument()
})

const getResponse = () => ({
  data: {
    rockets: [
      {
        id: 'falcon1',
        name: 'Falcon 1',
        mass: {
          kg: 30146,
        },
      },
      {
        id: 'falcon9',
        name: 'Falcon 9',
        mass: {
          kg: 549054,
        },
      },
      {
        id: 'falconheavy',
        name: 'Falcon Heavy',
        mass: {
          kg: 1420788,
        },
      },
      {
        id: 'starship',
        name: 'Starship',
        mass: {
          kg: 1335000,
        },
      },
    ],
  },
})
