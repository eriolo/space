import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import React from 'react'
import Launches, { GET_PAST_LAUNCHES_QUERY } from './Launches'

test('should render the five latest launches', async () => {
  const pastLaunchesMock = {
    request: {
      query: GET_PAST_LAUNCHES_QUERY,
      variables: { limit: 5, offset: 0 },
    },
    result: getResponse(),
  }
  render(
    <MockedProvider mocks={[pastLaunchesMock]} addTypename={false}>
      <Launches />
    </MockedProvider>,
  )
  expect(screen.queryByTestId('skeleton-loader')).toBeInTheDocument()
  const pastLaunchesRows = await screen.findAllByTestId('launch-row')
  expect(pastLaunchesRows.length).toEqual(5)

  const launchDates = pastLaunchesRows.map(row => row.querySelector('td:nth-of-type(2)')?.textContent)
  // TODO: Why is the launch with mission name "Starlink-15 (v1.0)" and id "109" considered to be the latest one?
  // The launch date is not the most recent one in the list. In the API by using launchLatest id "109" is returned
  // as well. Also, using "order" and "sort" doesn't seem to make any difference
  expect(launchDates).toEqual([
    '2020-10-24T17:31',
    '2020-11-21T18:17',
    '2020-11-16T01:27',
    '2020-11-06T00:24',
    '2020-10-24T17:31',
  ])
})

test('should handle network error', async () => {
  const pastLaunchesMock = {
    request: {
      query: GET_PAST_LAUNCHES_QUERY,
      variables: { limit: 5, offset: 0 },
    },
    error: new Error('An error occurred'),
  }
  render(
    <MockedProvider mocks={[pastLaunchesMock]} addTypename={false}>
      <Launches />
    </MockedProvider>,
  )

  expect(screen.queryByTestId('skeleton-loader')).toBeInTheDocument()
  expect(await screen.findByText('Fetching past launches failed')).toBeInTheDocument()
})

const getResponse = () => ({
  data: {
    launchesPast: [
      {
        id: '109',
        launch_date_utc: '2020-10-24T15:31:00.000Z',
        mission_name: 'Starlink-15 (v1.0)',
        launch_year: '2020',
      },
      {
        id: '108',
        launch_date_utc: '2020-11-21T17:17:00.000Z',
        mission_name: 'Sentinel-6 Michael Freilich',
        launch_year: '2020',
      },
      {
        id: '107',
        launch_date_utc: '2020-11-16T00:27:00.000Z',
        mission_name: 'Crew-1',
        launch_year: '2020',
      },
      {
        id: '106',
        launch_date_utc: '2020-11-05T23:24:00.000Z',
        mission_name: 'GPS III SV04 (Sacagawea)',
        launch_year: '2020',
      },
      {
        id: '105',
        launch_date_utc: '2020-10-24T15:31:00.000Z',
        mission_name: 'Starlink-14 (v1.0)',
        launch_year: '2020',
      },
    ],
  },
})
