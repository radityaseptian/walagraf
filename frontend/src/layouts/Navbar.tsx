import { Suspense, lazy, useState } from 'react'
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
  const [showRoute, setShowRoute] = useState(false)

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
          <div className='flex items-center justify-between h-12 relative'>
            <Link to={'/'}>
              <span
                className={`${showRoute && 'hidden sm:block'} text-2xl text-primary tracking-wide`}
              >
                Walagraf
              </span>
            </Link>

            <div
              className={`${
                showRoute ? 'translate-x-0 mr-14 sm:mr-0' : 'translate-x-[120%] sm:translate-x-0'
              } transition duration-200 justify-end flex-1 flex items-center gap-6`}
            >
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
                    className='border text-primary border-primary hover:bg-red hover:text-white px-3 py-2 sm:px-4 rounded'
                  >
                    REGISTER
                  </button>
                </>
              ) : (
                <Menu animate={{ mount: { y: 0 }, unmount: { y: 25 } }}>
                  <MenuHandler>
                    <button className='max-w-44 truncate text-primary'>{user.email}</button>
                  </MenuHandler>
                  <MenuList className='p-0 bg-primary border-0 rounded text-gray-200 font-semibold'>
                    <MenuItem className='rounded-none'>
                      <Link to='/accounts'>
                        <div>ACCOUNTS</div>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleLogout} className='rounded-none text-primary'>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </div>

            <button
              onClick={() => setShowRoute(!showRoute)}
              className={`${
                showRoute && 'rotate-180'
              } inline-block sm:hidden absolute top-[6.5px] right-1 text-2xl bg-red px-2 border border-gray-600 rounded-sm pb-[1px]`}
            >
              <span>⇤</span>
            </button>
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
