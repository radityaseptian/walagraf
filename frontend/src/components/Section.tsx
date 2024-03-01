import { Wrapper } from '@/components'

interface SectionProps {
  title: string
  desc: string
  children: React.ReactNode
}

export const Section: React.FC<SectionProps> = (props) => {
  return (
    <section className='py-8'>
      <Wrapper>
        <div className='pb-12 text-center md:w-7/12 mx-auto'>
          <h2 className='mb-4 font-valorant text-primary text-5xl font-semibold'>
            {props.title}
          </h2>
          <span>{props.desc}</span>
        </div>
        {props.children}
      </Wrapper>
    </section>
  )
}
