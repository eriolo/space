import Layout from './components/Layout'
import './styles/all.css'
import Header from './components/Header'
import Rockets from './components/Rockets'
import Launches from './components/Launches'
import Launchpads from './components/Launchpads'

function App() {
  return (
    <Layout>
      <Header />
      <Rockets />
      <Launches />
      <Launchpads />
    </Layout>
  )
}

export default App
