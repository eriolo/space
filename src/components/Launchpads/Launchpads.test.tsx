import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import React from 'react'
import { act } from 'react-dom/test-utils'
import Launchpads, { GET_LAUNCHPADS_QUERY } from './Launchpads'

test('should by default render by distance in ascending order', async () => {
  const launchpadsMock = {
    request: {
      query: GET_LAUNCHPADS_QUERY,
      variables: { limit: 10, offset: 0 },
    },
    result: getResponse(),
  }
  render(
    <MockedProvider mocks={[launchpadsMock]} addTypename={false}>
      <Launchpads />
    </MockedProvider>,
  )
  expect(screen.queryByTestId('skeleton-loader')).toBeInTheDocument()
  const launchpadRows = await screen.findAllByTestId('launchpad-row')
  expect(launchpadRows.length).toEqual(6)

  const launchpadDistance = launchpadRows.map(row => row.querySelector('td:nth-of-type(4)')?.textContent)
  expect(launchpadDistance).toEqual(['8198', '8972', '8974', '11607', '13214', '13216'])
})

test('should sort by descending order on button click', async () => {
  const launchpadsMock = {
    request: {
      query: GET_LAUNCHPADS_QUERY,
      variables: { limit: 10, offset: 0 },
    },
    result: getResponse(),
  }
  render(
    <MockedProvider mocks={[launchpadsMock]} addTypename={false}>
      <Launchpads />
    </MockedProvider>,
  )
  expect(screen.queryByTestId('skeleton-loader')).toBeInTheDocument()
  const sortButton = await screen.findByRole('button', { name: /Sort/i })
  expect(sortButton).toBeInTheDocument()
  act(() => sortButton.click())

  const launchpadRows = await screen.findAllByTestId('launchpad-row')
  expect(launchpadRows.length).toEqual(6)
  const launchpadDistance = launchpadRows.map(row => row.querySelector('td:nth-of-type(4)')?.textContent)
  expect(launchpadDistance).toEqual(['13216', '13214', '11607', '8974', '8972', '8198'])
})

test('should have fallback for missing location', async () => {
  const launchpads = getResponse().data.launchpads
  const launchpadsMock = {
    request: {
      query: GET_LAUNCHPADS_QUERY,
      variables: { limit: 10, offset: 0 },
    },
    result: {
      data: { launchpads: [{ ...launchpads[0], location: null }, ...launchpads.slice(1, launchpads.length)] },
    },
  }
  render(
    <MockedProvider mocks={[launchpadsMock]} addTypename={false}>
      <Launchpads />
    </MockedProvider>,
  )
  expect(screen.queryByTestId('skeleton-loader')).toBeInTheDocument()
  const launchpadRows = await screen.findAllByTestId('launchpad-row')
  expect(launchpadRows.length).toEqual(6)

  const launchpadDistance = launchpadRows.map(row => row.querySelector('td:nth-of-type(4)')?.textContent)
  expect(launchpadDistance).toEqual(['0', '8198', '8972', '11607', '13214', '13216'])
})

test('should handle network error', async () => {
  const launchpadsMock = {
    request: {
      query: GET_LAUNCHPADS_QUERY,
      variables: { limit: 10, offset: 0 },
    },
    error: new Error('An error occurred'),
  }
  render(
    <MockedProvider mocks={[launchpadsMock]} addTypename={false}>
      <Launchpads />
    </MockedProvider>,
  )

  expect(screen.queryByTestId('skeleton-loader')).toBeInTheDocument()
  expect(await screen.findByText('Fetching launchpads failed')).toBeInTheDocument()
})

const getResponse = () => ({
  data: {
    launchpads: [
      {
        details:
          'SpaceX original west coast launch pad for Falcon 1. Performed a static fire but was never used for a launch and abandoned due to scheduling conflicts.',
        id: 'vafb_slc_3w',
        location: {
          latitude: 34.6440904,
          longitude: -120.5931438,
          name: 'Vandenberg Air Force Base',
          region: 'California',
        },
        name: 'Vandenberg Air Force Base Space Launch Complex 3W',
      },
      {
        details:
          'SpaceX primary Falcon 9 launch pad, where all east coast Falcon 9s launched prior to the AMOS-6 anomaly. Initially used to launch Titan rockets for Lockheed Martin. Back online since CRS-13 on 2017-12-15.',
        id: 'ccafs_slc_40',
        location: {
          latitude: 28.5618571,
          longitude: -80.577366,
          name: 'Cape Canaveral',
          region: 'Florida',
        },
        name: 'Cape Canaveral Air Force Station Space Launch Complex 40',
      },
      {
        details:
          'SpaceX new launch site currently under construction to help keep up with the Falcon 9 and Heavy manifests. Expected to be completed in late 2018. Initially will be limited to 12 flights per year, and only GTO launches.',
        id: 'stls',
        location: {
          latitude: 25.9972641,
          longitude: -97.1560845,
          name: 'Boca Chica Village',
          region: 'Texas',
        },
        name: 'SpaceX South Texas Launch Site',
      },
      {
        details:
          'SpaceX original launch site, where all of the Falcon 1 launches occured. Abandoned as SpaceX decided against upgrading the pad to support Falcon 9.',
        id: 'kwajalein_atoll',
        location: {
          latitude: 9.0477206,
          longitude: 167.7431292,
          name: 'Omelek Island',
          region: 'Marshall Islands',
        },
        name: 'Kwajalein Atoll Omelek Island',
      },
      {
        details:
          'SpaceX primary west coast launch pad for polar orbits and sun synchronous orbits, primarily used for Iridium. Also intended to be capable of launching Falcon Heavy.',
        id: 'vafb_slc_4e',
        location: {
          latitude: 34.632093,
          longitude: -120.610829,
          name: 'Vandenberg Air Force Base',
          region: 'California',
        },
        name: 'Vandenberg Air Force Base Space Launch Complex 4E',
      },
      {
        details:
          'NASA historic launch pad that launched most of the Saturn V and Space Shuttle missions. Initially for Falcon Heavy launches, it is now launching all of SpaceX east coast missions due to the damage from the AMOS-6 anomaly. After SLC-40 repairs are complete, it will be upgraded to support Falcon Heavy, a process which will take about two months. In the future it will launch commercial crew missions and the Interplanetary Transport System.',
        id: 'ksc_lc_39a',
        location: {
          latitude: 28.6080585,
          longitude: -80.6039558,
          name: 'Cape Canaveral',
          region: 'Florida',
        },
        name: 'Kennedy Space Center Historic Launch Complex 39A',
      },
    ],
  },
})
