import { Wrapper } from '@/components'
import { useNavigate } from 'react-router-dom'
import { useForm, useUser } from '../../context'

export const Hero = () => {
  const [, setForm] = useForm()
  const [user] = useUser()
  const navigate = useNavigate()

  const handleStartedButton = () => {
    if (!user?.isLogin) return setForm('login')
    navigate('/accounts')
  }

  return (
    <section className='py-8'>
      <Wrapper>
        <div className='flex items-center flex-col lg:flex-row gap-8'>
          <div className='md:w-[40rem] lg:w-[26rem] space-y-5'>
            <h1 className='text-4xl md:text-5xl tracking-widest py-4 font-valorant text-primary'>Walagraf</h1>
            <div>Explore and showcase your Whatsapp and Telegram Accounts with Walagraf</div>
            <div>
              The ultimate platform for managing Whatsapp and Telegram accounts, sending message,
              update profile, and sharing with friends.
            </div>
            <div>EXPLORE NOW !!</div>
            <button
              onClick={handleStartedButton}
              className='px-8 py-3.5 bg-red hover:text-white font-semibold rounded'
            >
              GET STARTED
            </button>
          </div>
          <div className='md:p-10 lg:p-0'>
            <img
              src='/img/profile.png?url'
              alt='Hero Banner'
            />
          </div>
        </div>
      </Wrapper>
    </section>
  )
}
