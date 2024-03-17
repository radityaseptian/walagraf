import { Wrapper } from '@/components'
import { useNavigate } from 'react-router-dom'
import { MdArrowForwardIos } from 'react-icons/md'
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
        <div className='flex items-center gap-8'>
          <div className='w-[26rem] space-y-5'>
            <h1 className='text-5xl tracking-widest py-4 font-valorant text-primary'>Walagraf</h1>
            <div>Explore and showcase your Valorant Account with Explorant</div>
            <div>
              The ultimate platform for managing Valorant account, viewing stats, inventory and
              store, and sharing with friends.
            </div>
            <div>EXPLORE NOW !!</div>
            <button
              onClick={handleStartedButton}
              className='px-8 py-3.5 bg-red hover:text-white font-semibold rounded flex items-center gap-1'
            >
              <span>GET STARTED</span>
              <MdArrowForwardIos />
            </button>
          </div>
          <div className='w-'>
            <img
              src='https://explorant.space/static/media/homefirst6.2151a754.png'
              alt='Hero Banner'
            />
          </div>
        </div>
      </Wrapper>
    </section>
  )
}
