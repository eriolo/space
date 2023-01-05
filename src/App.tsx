import { useQuery, gql } from '@apollo/client'
import Layout from './components/Layout'
import './styles/all.css'
import Header from './components/Header'

const customerQuery = gql`
  query customerData {
    company {
      employees
      launch_sites
      name
      summary
      test_sites
      valuation
      vehicles
    }
  }
`

function App() {
  const { loading, error, data } = useQuery(customerQuery)
  if (loading) return <p>Loading... 🚀 </p>
  if (error) return <p>Error 😢</p>
  return (
    <Layout>
      <Header />
    </Layout>
  )
}

export default App
