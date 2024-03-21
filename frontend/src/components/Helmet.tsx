import Helmet from 'react-helmet'
import { useLocation } from 'react-router-dom'
import { useUser } from '../context'

export default function useHelmet({ children }) {
  const { pathname } = useLocation()

  const [user] = useUser()

  const filterAccount = (): string => {
    try {
      const [, , , id] = pathname.split('/')
      const { name } = user.instances.find((inst) => inst.id === id)
      return name
    } catch (error) {
      return 'Not Found'
    }
  }

  return (
    <>
      <Helmet>
        <title>
          Walagraf -{' '}
          {pathname === '/'
            ? 'Home'
            : pathname === '/accounts' || pathname === '/accounts/'
            ? 'Accounts'
            : pathname.includes('/accounts')
            ? filterAccount()
            : 'Not Found'}
        </title>
      </Helmet>
      {children}
    </>
  )
}
