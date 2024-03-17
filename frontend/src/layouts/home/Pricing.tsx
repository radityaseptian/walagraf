import { Section } from '@/components'
import { MdArrowForwardIos } from 'react-icons/md'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'

interface BoxProps {
  title: string
  img: string
  desc: string
  features: String[]
}

const contents: Array<BoxProps> = [
  {
    title: ' Account Details:',
    img: 'https://docrdsfx76ssb.cloudfront.net/static/1709236601/pages/wp-content/uploads/2022/06/link-in-bio-1.svg',
    desc: 'A comprehensive solution to help make every point of connection between your content and your audience more powerful',
    features: [
      'URL shortening at scale',
      'URL shortening at scale',
      'URL shortening at scale',
      'URL shortening at scale',
    ],
  },
  {
    title: ' Account Details:',
    img: 'https://docrdsfx76ssb.cloudfront.net/static/1709236601/pages/wp-content/uploads/2022/06/link-in-bio-1.svg',
    desc: 'A comprehensive solution to help make every point of connection between your content and your audience more powerful',
    features: [
      'URL shortening at scale',
      'URL shortening at scale',
      'URL shortening at scale',
      'URL shortening at scale',
    ],
  },
  {
    title: ' Account Details:',
    img: 'https://docrdsfx76ssb.cloudfront.net/static/1709236601/pages/wp-content/uploads/2022/06/link-in-bio-1.svg',
    desc: 'A comprehensive solution to help make every point of connection between your content and your audience more powerful',
    features: [
      'URL shortening at scale',
      'URL shortening at scale',
      'URL shortening at scale',
      'URL shortening at scale',
    ],
  },
]

export const Pricing = () => {
  return (
    <Section
      title='Pricing'
      desc='Discover the Powerful Features of Explorant.'
    >
      <div className='flex items-center gap-6'>
        {contents.map((content, i) => {
          return (
            <SectionBox
              key={i}
              title={content.title}
              img={content.img}
              desc={content.desc}
              features={content.features}
            />
          )
        })}
      </div>
    </Section>
  )
}

const SectionBox: React.FC<BoxProps> = (props) => {
  return (
    <div className='bg-secondary p-6 border border-secondary rounded-lg shadow-lg'>
      <div className='flex items-center gap-4'>
        <img src={props.img} alt={`Logo ${props.title}`} />
        <div className='text-lg font-semibold text-white'>{props.title}</div>
      </div>
      <div className='py-4'>{props.desc}</div>
      <ul className='border-t border-gray-700 py-4 space-y-2'>
        {props.features.map((feature, i) => {
          return (
            <li key={i} className='flex items-center gap-2'>
              <IoCheckmarkCircleOutline className='w-5 h-5 text-primary' />
              <span>{feature}</span>
            </li>
          )
        })}
      </ul>
      <button className='flex items-center gap-2 cursor-not-allowed px-4 py-2 bg-red text-secondary hover:text-white rounded w-full justify-center font-semibold'>
        <span>GET IT</span>
        <MdArrowForwardIos />
      </button>
    </div>
  )
}
