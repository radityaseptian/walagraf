import { Routes as RoutesDom, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { Home } from '@/pages/Home'
import { Loading } from '@/components'
import axios from 'axios'
import { useUser } from './context'

const Accounts = lazy(() => import('./pages/accounts'))

const dummyAccounts = [
  {
    id: '111b4405-8556-4373-a885-ac591a2e5756',
    name: '(fikri) Fikriansyah',
    type: 'whatsapp',
  },
  { id: '111b4405-8556-4373-a885-iiad82had22y', name: 'Sansudin jaddab', type: 'telegram' },
  {
    id: '111b4405-8556-4373-a885-77272tdh2ywy',
    name: '(saiful) sifaul qulub',
    type: 'whatsapp',
  },
  { id: '111b4405-8556-4373-a885-iia72ga26g2g', name: 'mahmudin', type: 'telegram' },
]

const Routes = () => {
  const [user, setUser] = useUser()
  const url = import.meta.env.VITE_URL

  useEffect(() => {
    axios.get(url + '/user/status').then(({ data }) => {
      if (data.success) setUser({ ...user, isLogin: true, ...data.data, instances: dummyAccounts })
    })

    setUser((user) => ({ ...user, instances: dummyAccounts }))
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
