import { Suspense, lazy } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wrapper } from '@/components'
import { FaGithub } from 'react-icons/fa'
import { useUser, useForm } from '../context'
import { Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react'
import axios from 'axios'

const Auth = lazy(() => import('../components/Auth'))

export const Navbar = () => {
  const [user, setUser, initial] = useUser()
  const [form, setForm] = useForm()

  const url = import.meta.env.VITE_URL
  const navigate = useNavigate()

  const handleLogout = async () => {
    axios.delete(url + '/user/logout').finally(() => {
      setUser(initial)
      navigate('/')
    })
  }

  return (
    <>
      <nav className='bg-secondary shadow shadow-black/50 '>
        <Wrapper>
          <div className='flex items-center justify-between h-12'>
            <Link to={'/'}>
              <span className='text-2xl text-primary tracking-wide'>Walagraf</span>
            </Link>
            <div className='flex items-center gap-6'>
              <a
                href='http://github.com/radityaseptian/walagraf'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-white'
              >
                <div className='flex items-center gap-1'>
                  <FaGithub />
                  <span>Github</span>
                </div>
              </a>

              {!user?.isLogin ? (
                <>
                  <button onClick={() => setForm('login')} className='hover:text-primary px-2 py-1'>
                    LOGIN
                  </button>
                  <button
                    onClick={() => setForm('register')}
                    className='border border-secondary hover:border-primary hover:bg-red px-4 py-2 rounded'
                  >
                    REGISTER
                  </button>
                </>
              ) : (
                <>
                  <Link to='/accounts' className='hover:text-primary px-2 py-1'>
                    ACCOUNTS
                  </Link>
                  <Menu animate={{ mount: { y: 0 }, unmount: { y: 25 } }}>
                    <MenuHandler>
                      <button className='max-w-52 truncate text-primary'>{user.email}</button>
                    </MenuHandler>
                    <MenuList className='p-0 bg-primary border-0 rounded text-gray-200 font-semibold'>
                      <MenuItem onClick={handleLogout} className='rounded-none'>
                        Logout
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </>
              )}
            </div>
          </div>
        </Wrapper>
      </nav>

      {form && (
        <Suspense
          fallback={
            <div className='fixed inset-0 bg-white/20 z-50 grid place-content-center font-semibold text-white'>
              Loading...
            </div>
          }
        >
          <Auth />
        </Suspense>
      )}
    </>
  )
}
