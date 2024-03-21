import { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Loader from './components/Loader'
import Home from './pages/Home'
import Sidebar from './components/Sidebar'
import Chat from './pages/Chat'

import './assets/css/index.css'
import { UsersProvider } from './context/usersContext'
// import { SocketProvider } from './context/socketContext'

const userPrefersDark =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

function App() {
  const [appLoaded, setAppLoaded] = useState(false)
  const [startLoadProgress, setStartLoadProgress] = useState(false)

  useEffect(() => {
    if (userPrefersDark) document.body.classList.add('dark-theme')
    stopLoad()
  }, [])

  const stopLoad = () => {
    setStartLoadProgress(true)
    setTimeout(() => setAppLoaded(true), 1)
  }

  if (!appLoaded) return <Loader done={startLoadProgress} />

  return (
    <UsersProvider>
      <div className='app'>
        <p className='app__mobile-message'> Only available on desktop 😊. </p>

        <div className='app-content'>
          <Sidebar />
          <Routes>
            <Route path=':id' element={<Chat />} />
            <Route path='*' element={<Home />} />
          </Routes>
        </div>
      </div>
    </UsersProvider>
  )
}

export default App
