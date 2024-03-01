import { Wrapper } from '@/components'
import Slider from 'infinite-react-carousel'
import { GrSync, GrSecure } from 'react-icons/gr'
import { BsLightningFill, BsTagFill, BsQrCode } from 'react-icons/bs'
import { FaUserGroup } from 'react-icons/fa6'
import { RiOpenSourceFill } from 'react-icons/ri'

const className = 'w-12 h-12 text-primary'

const contents = [
  {
    icon: <GrSync className={className} />,
    title: 'Synchronized',
    desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. laudantium necessitatibus vel',
  },
  {
    icon: <BsLightningFill className={className} />,
    title: 'Fast',
    desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. laudantium necessitatibus vel',
  },
  {
    icon: <FaUserGroup className={className} />,
    title: 'Multi Account',
    desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. laudantium necessitatibus vel',
  },
  {
    icon: <GrSecure className={className} />,
    title: 'Secure',
    desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. laudantium necessitatibus vel',
  },
  {
    icon: <RiOpenSourceFill className={className} />,
    title: 'Open Source',
    desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. laudantium necessitatibus vel',
  },

  {
    icon: <BsTagFill className={className} />,
    title: 'Free To Use',
    desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. laudantium necessitatibus vel',
  },
  {
    icon: <BsQrCode className={className} />,
    title: 'Easy To Use',
    desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. laudantium necessitatibus vel',
  },
]

export const Carousel = () => {
  const settings = {
    arrows: false,
    autoplay: true,
    adaptiveHeight: true,
    dots: true,
    dotsScroll: 1,
    duration: 100,
    overScan: 1,
    slidesToShow: 4,
  }

  return (
    <section className='py-8'>
      <Wrapper>
        <Slider {...settings}>
          {contents.map((content, i) => {
            return (
              <Box key={i} title={content.title} decription={content.desc}>
                {content.icon}
              </Box>
            )
          })}
        </Slider>
      </Wrapper>
    </section>
  )
}

interface BoxProps {
  children: React.ReactNode
  title: string
  decription: string
}

const Box: React.FC<BoxProps> = (props) => {
  return (
    <div className='bg-secondary mx-2 p-6 rounded-sm text-center'>
      <div className='flex justify-center'>{props.children}</div>
      <div className='py-4 text-lg text-white'>{props.title}</div>
      <span>{props.decription}</span>
    </div>
  )
}
