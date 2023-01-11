import { useQuery } from '@apollo/client'
import orderBy from 'lodash/orderBy'
import { useState } from 'react'
import cn from 'classnames'
import { useMemo } from 'react'

import { getDistance } from 'geolib'
import { gql } from '../../__generated__/gql'
import { GetLaunchpadsQuery } from '../../__generated__/graphql'
import Skeleton from '../Skeleton'
import s from './Launchpads.module.css'

export const GET_LAUNCHPADS_QUERY = gql(`
  query GetLaunchpads($limit: Int!, $offset: Int!) {
    launchpads(limit: $limit, offset: $offset) {
      details
      id
      location {
        latitude
        longitude
        name
        region
      }
    }
  }
`)

// Might be retrievable from external source but keep hardcoded for now for simplicity
const NORTHVOLT_FACTORY_ONE = {
  longitude: 64.73790664995946,
  latitude: 21.087560156590754,
}

// TODO: By creating a separate component for the table we can use the table ComponentProps instead
type ModifiedLaunchpads =
  | (GetLaunchpadsQuery['launchpads'] & Array<NonNullable<GetLaunchpadsQuery['launchpads']>[0] & { distance: number }>)
  | undefined

// TODO: Could consolidate the usage of the launchpads, Launches, and Launchpads components
const Launchpads = () => {
  const { loading, error, data } = useQuery(GET_LAUNCHPADS_QUERY, {
    // TODO: The limit and offset are hardcoded for now, but we should use pagination for a list
    variables: { limit: 10, offset: 0 },
  })

  const modifiedLaunchpads: ModifiedLaunchpads = useMemo(() => {
    return data?.launchpads?.map(launchpad => {
      const launchpadLocation =
        launchpad?.location?.latitude && launchpad?.location?.longitude
          ? {
              latitude: launchpad?.location?.longitude,
              longitude: launchpad?.location?.longitude,
            }
          : null
      return {
        ...launchpad,
        distance: launchpadLocation ? Math.round(getDistance(NORTHVOLT_FACTORY_ONE, launchpadLocation) / 1000) : 0, // TODO: Perhaps handle this case differently to separate between errors and the same location passed in twice
      }
    })
  }, [data])

  return (
    <section className={s.container}>
      <header>
        <h2>Launchpads</h2>
      </header>
      <p>Listing of SpaceX launchpads with their distance to the Northvolt Factory One.</p>
      {/* TODO: Use a map lib (e.g. Leaflet or Google Maps) to properly visualize the launchpads along with Northvolt Factory One */}
      {/* TODO: With a dynamic table component we can also calculate the skeleton loader dynamically */}
      {loading && (
        <>
          <div data-testid="skeleton-loader" />
          <Skeleton style={{ height: '4.1rem' }} data-testid="skeleton-loader" />
          <Skeleton style={{ height: '4rem', marginTop: '0.1rem' }} />
          <Skeleton style={{ height: '4rem', marginTop: '0.1rem' }} />
          <Skeleton style={{ height: '4rem', marginTop: '0.1rem' }} />
          <Skeleton style={{ height: '4rem', marginTop: '0.1rem' }} />
          <Skeleton style={{ height: '4rem', marginTop: '0.1rem' }} />
        </>
      )}
      {error && <p>Fetching launchpads failed</p>}
      <LaunchpadsTable launchpads={modifiedLaunchpads} />
    </section>
  )
}

type LaunchpadsTableProps = {
  launchpads: ModifiedLaunchpads
}

const LaunchpadsTable = ({ launchpads }: LaunchpadsTableProps) => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  if (!launchpads) return null

  // TODO: Consider using custom sort instead of lodash for smaller bundle size (needs to be measured)
  const sortedLaunchpads = orderBy(launchpads, ['distance'], [order])

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Details</th>
            <th>Region</th>
            <th>
              <button
                onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                className={cn('button-reset', s.button)}
              >
                Distance (km)
                <span className="visually-hidden">Sort in {order === 'asc' ? 'ascending' : 'descending'} order</span>
                <i className={cn(s['button__icon'], s[`button__icon--${order === 'asc' ? 'up' : 'down'}`])} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedLaunchpads?.map(launchpad => (
            <tr key={launchpad?.id} data-testid="launchpad-row">
              <td>{launchpad?.location?.name}</td>
              <td>{launchpad?.details}</td>
              <td>{launchpad?.location?.region}</td>
              <td>{launchpad?.distance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Launchpads
