import { Routes as RoutesDom, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { Home } from '@/pages/Home'
import { Loading } from '@/components'
import axios from 'axios'
import { useUser } from './context'

const Accounts = lazy(() => import('./pages/accounts'))

const Routes = () => {
  const [user, setUser] = useUser()
  const url = import.meta.env.VITE_URL

  useEffect(() => {
    axios.get(url + '/user/status').then(({ data }) => {
      if (data.success) setUser({ ...user, isLogin: true, ...data.data })
    })
  }, [])

  return (
    <RoutesDom>
      <Route path='/' element={<Home />} />
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
