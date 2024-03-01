import { Section } from '@/components'

interface BoxProps {
  title: string
  img: string
}

const contents: Array<BoxProps> = [
  {
    title: 'Gun Buddies',
    img: 'https://explorant.space/static/media/teaser2b.94cd1416.png',
  },
  {
    title: 'Unlocked Agents',
    img: 'https://explorant.space/static/media/teaser2b.94cd1416.png',
  },
  {
    title: 'Skin Variants',
    img: 'https://explorant.space/static/media/teaser2b.94cd1416.png',
  },
  {
    title: 'Match History',
    img: 'https://explorant.space/static/media/teaser2b.94cd1416.png',
  },
  {
    title: 'Account Folders',
    img: 'https://explorant.space/static/media/teaser2b.94cd1416.png',
  },
  {
    title: 'Account Folders',
    img: 'https://explorant.space/static/media/teaser2b.94cd1416.png',
  },
]

export const ComingSoon = () => {
  return (
    <Section
      title='Coming Soon'
      desc='Unlock the Future of Valorant Exploration: Exciting New Features Coming Soon!.'
    >
      <div className='grid justify-between grid-cols-3 gap-8'>
        {contents.map((content, i) => {
          return <Box key={i} title={content.title} img={content.img} />
        })}
      </div>
    </Section>
  )
}

const Box: React.FC<BoxProps> = (props) => {
  return (
    <div className='flex justify-center items-center flex-col'>
      <img src={props.img} alt={`Image ${props.title}`} />
      <span className='text-lg'>{props.title}</span>
    </div>
  )
}
