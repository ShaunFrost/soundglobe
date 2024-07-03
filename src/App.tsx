import { useEffect } from 'react'
import { useAppContext } from './hooks/useAppContext'
import Landing from './pages/Landing'
import UserGlobe from './pages/UserGlobe'

function App() {
  const { token, setToken } = useAppContext()

  useEffect(() => {
    const hash = window.location.hash
    const params = hash.substring(1).split('&')
    const accessToken = params[0].split('=')[1]
    setToken(accessToken)
  }, [setToken])
  
  return (
    token ? <UserGlobe /> : <Landing/>
  )
}

export default App
