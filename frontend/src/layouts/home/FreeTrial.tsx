import { Section } from '@/components'

export const FreeTrial = () => {
  return (
    <Section
      title='Free trial'
      desc='Want to easily manage and display your Whatsapp and Telegram account and message schedule to your friends?
      Look no further than Walagraf'
    >
      <div className='text-center'>
        <button className='px-8 py-3 rounded text-secondary hover:text-white bg-red'>
          Get Started
        </button>
      </div>
    </Section>
  )
}
