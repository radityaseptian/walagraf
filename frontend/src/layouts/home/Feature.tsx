import clsx from 'clsx'
import { Section } from '@/components'

interface SectionBoxProps {
  title: string
  img: string
  desc1: string
  desc2: string
  reverse: boolean
}

const contents: Array<SectionBoxProps> = [
  {
    title: ' Account Details:',
    img: 'https://explorant.space/static/media/feature1.7d570606.png',
    desc1:
      'Access and view your complete Valorant account information, including your username, rank, region, and in-game statistics. Stay informed about your progress and performance ',
    desc2:
      'Gain a comprehensive overview of your Valorant account, including your current rank and any account bans. Stay informed about your progress and performance, track your rank advancements, and take note of any penalties or restrictions imposed on your account.',
    reverse: true,
  },
  {
    title: ' Account Details:',
    img: 'https://explorant.space/static/media/feature1.7d570606.png',
    desc1:
      'Access and view your complete Valorant account information, including your username, rank, region, and in-game statistics. Stay informed about your progress and performance ',
    desc2:
      'Gain a comprehensive overview of your Valorant account, including your current rank and any account bans. Stay informed about your progress and performance, track your rank advancements, and take note of any penalties or restrictions imposed on your account.',
    reverse: false,
  },
  {
    title: ' Account Details:',
    img: 'https://explorant.space/static/media/feature1.7d570606.png',
    desc1:
      'Access and view your complete Valorant account information, including your username, rank, region, and in-game statistics. Stay informed about your progress and performance ',
    desc2:
      'Gain a comprehensive overview of your Valorant account, including your current rank and any account bans. Stay informed about your progress and performance, track your rank advancements, and take note of any penalties or restrictions imposed on your account.',
    reverse: true,
  },
  {
    title: ' Account Details:',
    img: 'https://explorant.space/static/media/feature1.7d570606.png',
    desc1:
      'Access and view your complete Valorant account information, including your username, rank, region, and in-game statistics. Stay informed about your progress and performance ',
    desc2:
      'Gain a comprehensive overview of your Valorant account, including your current rank and any account bans. Stay informed about your progress and performance, track your rank advancements, and take note of any penalties or restrictions imposed on your account.',
    reverse: false,
  },
]

export const Feature = () => {
  return (
    <Section
      title='Features'
      desc='Discover the Powerful Features of Explorant.'
    >
      <div className='space-y-12'>
        {contents.map((content, i) => {
          return (
            <SectionBox
              key={i}
              title={content.title}
              img={content.img}
              desc1={content.desc1}
              desc2={content.desc2}
              reverse={content.reverse}
            />
          )
        })}
      </div>
    </Section>
  )
}

const SectionBox: React.FC<SectionBoxProps> = (props) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-20',
        props.reverse && 'flex-row-reverse'
      )}
    >
      <div className='flex-1 space-y-5'>
        <h3 className='text-3xl text-primary py-2'>{props.title}</h3>
        <p>{props.desc1}</p>
        <p>{props.desc2}</p>
      </div>
      <div className='w-1/2'>
        <img src={props.img} alt='Image Description' />
      </div>
    </div>
  )
}
