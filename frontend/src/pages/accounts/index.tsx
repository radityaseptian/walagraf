import { Routes, Route, useNavigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { Loading } from '@/components'
import { useUser } from '@/context'

const Base = lazy(() => import('./Base'))
const Whatsapp = lazy(() => import('./whatsapp'))
const Telegram = lazy(() => import('./telegram'))

const routes = [
  { path: '*', element: Base },
  { path: 'w/:account/*', element: Whatsapp },
  { path: 't/:account/*', element: Telegram },
]

const Accounts = () => {
  const [user] = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.isLogin) navigate('/')
  }, [])

  return (
    <Routes>
      {routes.map(({ path, element: Element }) => {
        return (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<Loading />}>
                <Element />
              </Suspense>
            }
          />
        )
      })}
    </Routes>
  )
}

export default Accounts
