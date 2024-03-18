import { Wrapper } from '@/components'
import { Footer } from '@/layouts'
import { CiMenuKebab } from 'react-icons/ci'
import { FaTelegram, FaWhatsapp, FaTrash } from 'react-icons/fa'
import { useUser } from '../../context'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from '@material-tailwind/react'
import fakeQr from '/img/qr.jpg?url'

const instances = [
  { id: '111b4405-8556-4373-a885-ac591a2e5756', name: '(fikri) Fikriansyah', type: 'whatsapp' },
  { id: '111b4405-8556-4373-a885-iiad82had22y', name: 'Sansudin jaddab', type: 'telegram' },
  { id: '111b4405-8556-4373-a885-77272tdh2ywy', name: '(saiful) sifaul qulub', type: 'whatsapp' },
  { id: '111b4405-8556-4373-a885-iia72ga26g2g', name: 'mahmudin', type: 'telegram' },
]

const Base = () => {
  const [filter, setFilter] = useState('all')

  const initDialogState = {
    notif: false,
    confirm: false,
    init: false,
    type: 'whatsapp',
    loading: false,
    name: '',
    qr: fakeQr,
  }
  const [dialog, setDialog] = useState(initDialogState)

  const [user, setUser] = useUser()

  useEffect(() => {
    setUser({ ...user, instances })
  }, [])

  const handleRemoveInstance = (id) => {
    try {
      console.log(id)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleOpenNotif = () => {
    setDialog({ ...dialog, notif: !dialog.notif })
  }

  const handleOpenAddAccount = () => {
    if (dialog.loading) return
    setDialog({ ...dialog, notif: false, confirm: !dialog.confirm })
  }

  const handleTypeChange = (type) => {
    if (dialog.loading || dialog.init) return
    setDialog({ ...dialog, type })
  }

  const handleInitAccount = (e) => {
    e.preventDefault()
    if (dialog.loading || dialog.init) return
    try {
      setDialog((state) => ({ ...state, init: true, loading: true }))
    } catch (error) {
      alert(error.message)
      setDialog(initDialogState)
    }
  }

  return (
    <>
      <div className='py-8'>
        <Wrapper>
          <div>
            <div className='flex items-center justify-between border-b border-gray-600 pb-5 mb-5'>
              <select
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
                className='bg-secondary p-2 rounded-sm'
              >
                <option value='all'>Show All</option>
                <option value='whatsapp'>Whatsapp Only</option>
                <option value='telegram'>Telegram Only</option>
              </select>
              <div>
                <button
                  onClick={handleOpenNotif}
                  className='px-4 py-2 bg-red hover:text-white rounded'
                >
                  Add Account
                </button>
                <Dialog
                  size='xs'
                  className='bg-secondary'
                  open={dialog.notif}
                  handler={handleOpenNotif}
                >
                  <DialogHeader>
                    <Typography variant='h5' color='white'>
                      Your Attention is Required!
                    </Typography>
                  </DialogHeader>
                  <DialogBody divider className='grid place-items-center gap-4'>
                      <svg
                      viewBox='0 0 40 40'
                      fill='none'
                      className='h-16 w-16'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M39.2001 3.19999C39.1998 2.79105 39.0951 2.38895 38.8959 2.03184C38.6966 1.67473 38.4094 1.37446 38.0615 1.15952C37.7136 0.944581 37.3166 0.8221 36.908 0.8037C36.4995 0.785301 36.0931 0.871593 35.7272 1.05439L17.0312 10.4H8.00005C6.09049 10.4 4.25914 11.1586 2.90888 12.5088C1.55862 13.8591 0.800049 15.6904 0.800049 17.6C0.800049 19.5095 1.55862 21.3409 2.90888 22.6912C4.25914 24.0414 6.09049 24.8 8.00005 24.8H8.67205L12.9225 37.5584C13.0817 38.0365 13.3874 38.4523 13.7962 38.747C14.205 39.0416 14.6961 39.2001 15.2 39.2H17.6C18.2366 39.2 18.847 38.9471 19.2971 38.497C19.7472 38.047 20 37.4365 20 36.8V26.2832L35.7272 34.1456C36.0931 34.3284 36.4995 34.4147 36.908 34.3963C37.3166 34.3779 37.7136 34.2554 38.0615 34.0405C38.4094 33.8255 38.6966 33.5252 38.8959 33.1681C39.0951 32.811 39.1998 32.4089 39.2001 32V3.19999Z'
                        fill='#fff'
                      />
                    </svg>
                    <Typography className='text-secondary' variant='h4'>
                      You should read this!
                    </Typography>
                    <Typography className='text-center font-normal text-gray-200'>
                      A small river named Duden flows by their place and supplies it with the
                      necessary regelialia.
                    </Typography>
                  </DialogBody>
                  <DialogFooter className='space-x-2'>
                    <Button
                      variant='text'
                      color='blue-gray'
                      className='text-primary'
                      onClick={handleOpenNotif}
                    >
                      close
                    </Button>
                    <Button color='blue' variant='gradient' onClick={handleOpenAddAccount}>
                      Got it
                    </Button>
                  </DialogFooter>
                </Dialog>
                {dialog.confirm && (
                  <>
                    <div
                      onClick={handleOpenAddAccount}
                      className='fixed inset-0 z-40 bg-white/40'
                    />
                    <div className='fixed z-50 bg-secondary rounded p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96'>
                      <div className='pb-3 flex items-center justify-between'>
                        <h3 className='text-xl text-center text-secondary capitalize'>
                          for {dialog.type}
                        </h3>
                        <div className='flex items-center gap-1'>
                          <button
                            onClick={() => handleTypeChange('whatsapp')}
                            className={clsx(
                              'p-1',
                              dialog.type === 'whatsapp' && 'bg-primary text-[#25D366]'
                            )}
                          >
                            <FaWhatsapp className='w-6 h-6' />
                          </button>
                          <button
                            onClick={() => handleTypeChange('telegram')}
                            className={clsx(
                              'p-1',
                              dialog.type === 'telegram' && 'bg-primary text-[#0088cc]'
                            )}
                          >
                            <FaTelegram className='w-6 h-6' />
                          </button>
                        </div>
                      </div>
                      <form onSubmit={handleInitAccount} className='flex items-center gap-2'>
                        <input
                          type='text'
                          value={dialog.name}
                          placeholder='Name (Optional)'
                          className='bg-primary tracking-wide w-52 rounded border-[1.5px] px-2 py-1.5 border-gray-800'
                          onChange={(e) => setDialog({ ...dialog, name: e.target.value })}
                        />
                        <button
                          className={clsx(
                            'px-3 py-1.5 rounded w-full text-white font-semibold',
                            dialog.type === 'whatsapp' ? 'bg-[#25D366]' : 'bg-[#0088cc]'
                          )}
                        >
                          {!dialog.loading ? 'Init' : 'Wait'}
                        </button>
                      </form>
                      <hr className='my-3 border-gray-400' />
                      <img src={dialog.qr} alt='Scan QR' className='w-full h-[15.2rem]' />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className='min-h-80'>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {user?.instances
                  .filter((instance) => filter === 'all' || filter === instance.type)
                  .map((instance) => {
                    const href = `${instance.type.substring(0, 1)}/${instance.id}`
                    return (
                      <div key={instance.id} className='bg-secondary shadow shadow-black/50'>
                        <Link
                          to={href}
                          className='block relative h-16 bg-center bg-cover border-2 border-primary'
                        >
                          <div className='font-valorant text-3xl text-center mt-[.9rem] text-primary'>
                            Walagraf
                          </div>
                          <div
                            className={clsx(
                              'absolute w-12 h-12 bg-white border-2 top-6 left-3',
                              instance.type === 'whatsapp' ? 'border-[#25D366]' : 'border-[#0088cc]'
                            )}
                          >
                            {instance.type === 'whatsapp' ? (
                              <FaWhatsapp className='w-full h-full text-[#25D366]' />
                            ) : (
                              <FaTelegram className='w-full h-full text-[#0088cc]' />
                            )}
                          </div>
                        </Link>
                        <div className='p-4 flex items-center gap-2'>
                          <Link to={href} className='flex-1 truncate hover:text-white'>
                            {instance.name}
                          </Link>
                          <Menu
                            placement='bottom-end'
                            animate={{ mount: { y: 0 }, unmount: { y: 10 } }}
                          >
                            <MenuHandler>
                              <button className='p-2 rounded hover:bg-primary duration-200 hover:shadow shadow-black'>
                                <CiMenuKebab />
                              </button>
                            </MenuHandler>
                            <MenuList className='p-1 bg-primary border-0 rounded text-gray-200 font-semibold'>
                              <MenuItem
                                onClick={() => handleRemoveInstance(instance.id)}
                                className='rounded-none'
                              >
                                <div className='flex items-center gap-2'>
                                  <FaTrash />
                                  <span>Remove</span>
                                </div>
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </div>
                      </div>
                    )
                  })}
                {!user?.instances.length && <div>No Account Available :(</div>}
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
      <Footer />
    </>
  )
}

export default Base
