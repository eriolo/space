import { useQuery } from '@apollo/client'
import { format } from 'date-fns'
import { useMemo } from 'react'

import { gql } from '../../__generated__/gql'
import { GetLaunchesPastQuery } from '../../__generated__/graphql'
import s from './Launches.module.css'

export const GET_PAST_LAUNCHES_QUERY = gql(`
  query GetLaunchesPast($limit: Int!, $offset: Int!) {
    launchesPast(limit: $limit, offset: $offset) {
      id
      launch_date_utc
      mission_name
    }
  }
`)

// TODO: Could consolidate the usage of the Rockets, Launches, and Launchpads components
const Launches = () => {
  const { loading, error, data } = useQuery(GET_PAST_LAUNCHES_QUERY, {
    // TODO: The limit and offset are hardcoded for now, but we should use pagination for a list
    variables: { limit: 5, offset: 0 },
  })
  const modifiedLaunches = useMemo(() => {
    return data?.launchesPast?.map(launch => ({
      ...launch,
      launch_date_utc: toDatetimeLocal(launch?.launch_date_utc),
    }))
  }, [data])

  return (
    <section className={s.container}>
      <header>
        <h2>Latest launches</h2>
      </header>
      {/* TODO: Show e.g. skeleton loaders instead */}
      {loading && <p>Loading...</p>}
      {error && <p>Fetching past launches failed</p>}
      <LaunchesTable launches={modifiedLaunches} />
    </section>
  )
}

type LaunchesTableProps = {
  launches: GetLaunchesPastQuery['launchesPast']
}

const LaunchesTable = ({ launches }: LaunchesTableProps) => {
  if (!launches) return null

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Mission name</th>
            <th>Launch date</th>
          </tr>
        </thead>
        <tbody>
          {launches?.map(launch => (
            <tr key={launch?.id} data-testid="launch-row">
              <td>{launch?.mission_name}</td>
              <td>{launch?.launch_date_utc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// date-fns does not yet contain a built in function for datetime-local, therefore using "format"
// https://github.com/date-fns/date-fns/issues/2938
function toDatetimeLocal(input: string) {
  return format(new Date(input), "yyyy-MM-dd'T'HH:mm")
}

export default Launches
