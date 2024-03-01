import { Wrapper } from '@/components'
import { Link } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'

export const Navbar = () => {
  return (
    <nav className='bg-secondary'>
      <Wrapper>
        <div className='flex items-center justify-between'>
          <div>
            <span className='text-2xl text-primary tracking-wide'>Walagraf</span>
          </div>
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

            <Link to='/dashboard' className='hover:text-primary px-2 py-1'>
              DASHBOARD
            </Link>
            <Link to='/auth/login' className='hover:text-primary px-2 py-1'>
              LOGIN
            </Link>
            <Link
              to='/auth/register'
              className='border border-secondary hover:border-primary hover:bg-red px-4 py-2 rounded'
            >
              REGISTER
            </Link>
          </div>
        </div>
      </Wrapper>
    </nav>
  )
}
