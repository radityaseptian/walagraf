import { Wrapper } from '@/components'
import Slider from 'infinite-react-carousel'
import { GrSync, GrSecure } from 'react-icons/gr'
import { BsLightningFill, BsTagFill, BsQrCode } from 'react-icons/bs'
import { FaUserGroup } from 'react-icons/fa6'
import { RiOpenSourceFill } from 'react-icons/ri'
import { useEffect, useState } from 'react'

const className = 'w-12 h-12 text-primary'

const contents = [
  {
    icon: <GrSync className={className} />,
    title: 'Synchronized',
    desc: 'Walagraf ensures real-time updates and accurate information everytime you update conversation.',
  },
  {
    icon: <BsLightningFill className={className} />,
    title: 'Fast',
    desc: 'Walagraf excels in speed, providing swift and seamless access to your Whatsapp and Telegram accounts data.',
  },
  {
    icon: <FaUserGroup className={className} />,
    title: 'Multi Account',
    desc: 'Walagraf can easily add multiple Whatsapp and Telegram accounts at once easily and can be managed at one time.',
  },
  {
    icon: <GrSecure className={className} />,
    title: 'Secure',
    desc: 'Walagraf prioritizes security, keeping your Whatsapp and Telegram accounts information safe and private.',
  },
  {
    icon: <RiOpenSourceFill className={className} />,
    title: 'Open Source',
    desc: 'The code is open source so you can run it yourself from your computer or contribute to the Walagraf project.',
  },

  {
    icon: <BsTagFill className={className} />,
    title: 'Free To Use',
    desc: 'Walagraf is free to use, providing access to valuable Whatsapp and Telegram accounts data without any cost.',
  },
  {
    icon: <BsQrCode className={className} />,
    title: 'Easy To Use',
    desc: 'The connection uses a QR code from the Whatsapp and Telegram applications to add an account to Walagraf.',
  },
]

export const Carousel = () => {
  const [countBox, setCountBox] = useState(1)

  useEffect(() => {
    const calculateSize = (size: number) => {
      return size <= 550 ? 1 : size <= 660 ? 2 : size <= 960 ? 3 : 4
    }

    setCountBox(calculateSize(window.innerWidth))

    const onResize = () => {
      setCountBox(calculateSize(window.innerWidth))
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const settings = {
    arrows: false,
    autoplay: true,
    adaptiveHeight: true,
    dots: true,
    dotsScroll: 1,
    duration: 100,
    overScan: 1,
  }

  return (
    <section className='py-8'>
      <Wrapper>
        <Slider {...settings} slidesToShow={countBox}>
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
