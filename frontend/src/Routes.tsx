import { Routes as RoutesDom, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Home } from '@/pages/Home'
import { Loading } from '@/components'

const Auth = lazy(() => import('./pages/Auth'))
const Accounts = lazy(() => import('./pages/accounts'))

const Routes = () => {
  return (
    <RoutesDom>
      <Route path='/' element={<Home />} />
      <Route
        path='/auth/*'
        element={
          <Suspense fallback={<Loading />}>
            <Auth />
          </Suspense>
        }
      />
      <Route
        path='/accounts/*'
        element={
          <Suspense fallback={<Loading />}>
            <Accounts />
          </Suspense>
        }
      />
      <Route path='*' element={<Navigate to='/' />} />
    </RoutesDom>
  )
}

export default Routes
