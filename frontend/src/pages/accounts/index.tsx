import { useLocation, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Navbar } from '@/layouts'
import { Loading } from '@/components'

const Base = lazy(() => import('./Base'))
const Whatsapp = lazy(() => import('./whatsapp'))
const Telegram = lazy(() => import('./telegram'))

const Accounts = () => {
  const base = '/accounts'
  const isBase = useLocation().pathname === base

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path='whatsapp/*'
          element={
            <Suspense fallback={<Loading />}>
              <Whatsapp />
            </Suspense>
          }
        />
        <Route
          path='telegram/*'
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
