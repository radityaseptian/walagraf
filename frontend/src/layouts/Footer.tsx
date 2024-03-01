import { Wrapper } from '@/components'
import { FaGithub } from 'react-icons/fa'

export const Footer = () => {
  return (
    <footer className='bg-secondary p-8'>
      <Wrapper>
        <div className='text-center md:w-7/12 mx-auto'>
          <div className='font-valorant font-semibold text-xl tracking-widest text-primary'>
            WALAGRAF
          </div>
          <div className='py-4'>
            The ultimate platform for managing Valorant account, viewing stats,
            inventory and store, and sharing with friends.
          </div>
          <div className='flex items-center gap-4 justify-center'>
            <a
              href='https://github.com/radityaseptian/walagraf'
              target='_blank'
              className='flex items-center gap-1'
            >
              <FaGithub />
              <span>Github</span>
            </a>
          </div>
        </div>
      </Wrapper>
    </footer>
  )
}
