import { useLocation, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { Navbar } from '@/layouts'
import { Loading } from '@/components'
import { useUser } from '../../context'

const Base = lazy(() => import('./Base'))
const Whatsapp = lazy(() => import('./whatsapp'))
const Telegram = lazy(() => import('./telegram'))

const Accounts = () => {
  const base = '/accounts'
  const isBase = useLocation().pathname === base

  const [user] = useUser()
  const navigate = useNavigate()

  // useEffect(() => {
  //   if (!user?.isLogin) navigate('/')
  // }, [])

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path='w/*'
          element={
            <Suspense fallback={<Loading />}>
              <Whatsapp />
            </Suspense>
          }
        />
        <Route
          path='t/*'
          element={
            <Suspense fallback={<Loading />}>
              <Telegram />
            </Suspense>
          }
        />
        <Route path='*' element={<Navigate to={base} />} />
      </Routes>

      {isBase && (
        <Suspense fallback={<Loading />}>
          <Base />
        </Suspense>
      )}
    </div>
  )
}

export default Accounts
