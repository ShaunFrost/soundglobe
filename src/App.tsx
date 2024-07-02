import { useEffect } from 'react'
import { useAppContext } from './hooks/useAppContext'
import Landing from './pages/Landing'
import UserGlobe from './pages/UserGlobe'
import ImageViewer from './pages/ImageViewer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const { token, setToken } = useAppContext()
  useEffect(() => {
    const hash = window.location.hash
    const params = hash.substring(1).split('&')
    const accessToken = params[0].split('=')[1]
    setToken(accessToken)
  }, [setToken])
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          token ? <UserGlobe /> : <Landing/>
        } />
        <Route path='/image/:imageId' element={<ImageViewer />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
