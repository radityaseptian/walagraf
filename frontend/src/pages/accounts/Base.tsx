import { Wrapper } from '@/components'
import { Footer } from '@/layouts'
import { CiMenuKebab } from 'react-icons/ci'

const Base = () => {
  return (
    <div>
      <div className='py-8'>
        <Wrapper>
          <div>
            <div className='flex items-center justify-between border-b border-gray-600 pb-5 mb-5'>
              <div>
                <select value={'all'}>
                  <option value='all'>Show All</option>
                  <option value='whatsapp'>Whatsapp Only</option>
                  <option value='telegram'>Telegram Only</option>
                </select>
              </div>
              <div>
                <button className='px-4 py-2 bg-red hover:text-white rounded'>
                  Add Account
                </button>
              </div>
            </div>
            <div className='grid gap-6 grid-cols-3'>
              <div className='bg-secondary shadow shadow-black/50'>
                <div className='relative h-16 bg-center bg-cover bg-whatsapp border-2 border-green-700'>
                  <div className='w-14 h-14 bg-white border-2 border-green-700 mt-4 ml-3'>
                    <img
                      src={
                        'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'
                      }
                      alt='Whatsapp Profile'
                      className='w-full h-full'
                    />
                  </div>
                </div>
                <div className='p-4 flex items-center gap-2'>
                  <span className='flex-1 truncate'>Lorem Ipsum</span>
                  <button className='p-2 rounded hover:bg-primary duration-200 hover:shadow shadow-black'>
                    <CiMenuKebab />
                  </button>
                </div>
              </div>
              <div className='bg-secondary shadow shadow-black/50'>
                <div className='relative h-16 bg-center bg-cover bg-whatsapp border-2 border-green-700'>
                  <div className='w-14 h-14 bg-white border-2 border-green-700 mt-4 ml-3'>
                    <img
                      src={
                        'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'
                      }
                      alt='Whatsapp Profile'
                      className='w-full h-full'
                    />
                  </div>
                </div>
                <div className='p-4 flex items-center gap-2'>
                  <span className='flex-1 truncate'>Lorem Ipsum</span>
                  <button className='p-2 rounded hover:bg-primary duration-200 hover:shadow shadow-black'>
                    <CiMenuKebab />
                  </button>
                </div>
              </div>
              <div className='bg-secondary shadow shadow-black/50'>
                <div className='relative h-16 bg-center bg-cover bg-whatsapp border-2 border-green-700'>
                  <div className='w-14 h-14 bg-white border-2 border-green-700 mt-4 ml-3'>
                    <img
                      src={
                        'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'
                      }
                      alt='Whatsapp Profile'
                      className='w-full h-full'
                    />
                  </div>
                </div>
                <div className='p-4 flex items-center gap-2'>
                  <span className='flex-1 truncate'>Lorem Ipsum</span>
                  <button className='p-2 rounded hover:bg-primary duration-200 hover:shadow shadow-black'>
                    <CiMenuKebab />
                  </button>
                </div>
              </div>
              <div className='bg-secondary shadow shadow-black/50'>
                <div className='relative h-16 bg-center bg-cover bg-whatsapp border-2 border-green-700'>
                  <div className='w-14 h-14 bg-white border-2 border-green-700 mt-4 ml-3'>
                    <img
                      src={
                        'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'
                      }
                      alt='Whatsapp Profile'
                      className='w-full h-full'
                    />
                  </div>
                </div>
                <div className='p-4 flex items-center gap-2'>
                  <span className='flex-1 truncate'>Lorem Ipsum</span>
                  <button className='p-2 rounded hover:bg-primary duration-200 hover:shadow shadow-black'>
                    <CiMenuKebab />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
      <Footer />
    </div>
  )
}

export default Base
