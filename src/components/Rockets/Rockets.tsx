import { useQuery } from '@apollo/client'
import { useState } from 'react'
import orderBy from 'lodash/orderBy'
import cn from 'classnames'

import { gql } from '../../__generated__/gql'
import { GetRocketsQuery } from '../../__generated__/graphql'
import s from './Rockets.module.css'

// TODO: Is there any way of sorting directly in the API?
// Looking in https://api.spacex.land/graphql/ it doesn't seem like it
// (order and sort is available for other services though)
export const GET_ROCKETS_QUERY = gql(`
  query GetRockets($limit: Int!, $offset: Int!) {
    rockets(limit: $limit, offset: $offset) {
      id
      name
      mass {
        kg
      }
    }
  }
`)

// TODO: Could consolidate the usage of the Rockets, Launches, and Launchpads components
const Rockets = () => {
  const { loading, error, data } = useQuery(GET_ROCKETS_QUERY, {
    // TODO: The limit and offset are hardcoded for now, but we should use pagination for a list
    variables: { limit: 10, offset: 0 },
  })

  return (
    <section className={s.container}>
      <header>
        <h2>SpaceX Rockets</h2>
      </header>
      {/* TODO: Show e.g. skeleton loaders instead */}
      {loading && <p>Loading...</p>}
      {error && <p>Fetching rockets failed</p>}
      <RocketsTable rockets={data?.rockets} />
    </section>
  )
}

type RocketsTableProps = {
  rockets: GetRocketsQuery['rockets']
}

const RocketsTable = ({ rockets }: RocketsTableProps) => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  if (!rockets) return null

  // TODO: Consider using custom sort instead of lodash for smaller bundle size (needs to be measured)
  const sortedRockets = orderBy(rockets, ['mass.kg'], [order])

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>
              <button
                onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                className={cn('button-reset', s.button)}
              >
                Weight (kg){' '}
                <span className="visually-hidden">Sort in {order === 'asc' ? 'ascending' : 'descending'} order</span>
                <i className={cn(s['button__icon'], s[`button__icon--${order === 'asc' ? 'up' : 'down'}`])} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRockets?.map(rocket => (
            <tr key={rocket?.id} data-testid="rocket-row">
              <td>{rocket?.name}</td>
              <td>{rocket?.mass?.kg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Rockets
