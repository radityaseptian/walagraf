import { Section } from '@/components'
import { useForm, useUser } from '../../context'
import { useNavigate } from 'react-router-dom'

export const FreeTrial = () => {
  const [, setForm] = useForm()
  const [user] = useUser()
  const navigate = useNavigate()

  const handleStartedButton = () => {
    if (!user?.isLogin) return setForm('login')
    navigate('/accounts')
  }

  return (
    <Section
      title='Free trial'
      desc='Want to easily manage and display your Whatsapp and Telegram account and conversations to your friends?
      Look no further than Walagraf'
    >
      <div className='text-center'>
        <button
          onClick={handleStartedButton}
          className='px-8 py-3 rounded text-secondary hover:text-white bg-red'
        >
          Get Started
        </button>
      </div>
    </Section>
  )
}
