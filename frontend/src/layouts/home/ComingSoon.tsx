import { Section } from '@/components'

interface BoxProps {
  title: string
  img: string
}

const contents: Array<BoxProps> = [
  {
    title: 'Account Folders',
    img: '/img/folder.png',
  },
  {
    title: 'Public Profiles',
    img: '/img/public.png',
  },
  {
    title: 'Schedule Messages',
    img: '/img/schedule.png',
  },
  {
    title: 'Public Profiles',
    img: '/img/public.png',
  },
  {
    title: 'Schedule Messages',
    img: '/img/schedule.png',
  },
  {
    title: 'Account Folders',
    img: '/img/folder.png',
  },
]

export const ComingSoon = () => {
  return (
    <Section title='Coming Soon' desc='Exciting New Features Coming Soon!.'>
      <div className='grid justify-between grid-cols-2 md:grid-cols-3 gap-8'>
        {contents.map((content, i) => {
          return (
            <div key={i} className='flex justify-center items-center flex-col'>
              <img
                loading='lazy'
                src={content.img}
                className='w-32 h-32 sm:w-40 sm:h-40 grayscale'
                alt={`Image ${content.title}`}
              />
              <div className='md:text-lg text-center'>{content.title}</div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
