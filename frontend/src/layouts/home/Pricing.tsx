import { Section } from '@/components'

interface BoxProps {
  title: string
  icon: string
  desc: string
  features: String[]
}

const contents: Array<BoxProps> = [
  {
    title: 'Basic',
    icon: '&#9829;',
    desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium, mollitia impedit fugiat earum rerum natus illum culpa quod suscipit animi.',
    features: [
      'Lorem ipsum dolor sit.',
      'Lorem ipsum dolor sit.',
      'Lorem ipsum dolor sit.',
      'Lorem ipsum dolor sit.',
    ],
  },
  {
    title: 'Standard',
    icon: ' &#9733;',
    desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium, mollitia impedit fugiat earum rerum natus illum culpa quod suscipit animi.',
    features: [
      'Lorem ipsum dolor sit.',
      'Lorem ipsum dolor sit.',
      'Lorem ipsum dolor sit.',
      'Lorem ipsum dolor sit.',
    ],
  },
  {
    title: 'Premium',
    icon: '&#10070;',
    desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium, mollitia impedit fugiat earum rerum natus illum culpa quod suscipit animi.',
    features: [
      'Lorem ipsum dolor sit.',
      'Lorem ipsum dolor sit.',
      'Lorem ipsum dolor sit.',
      'Lorem ipsum dolor sit.',
    ],
  },
]

export const Pricing = () => {
  return (
    <Section title='Pricing' desc='Discover the Powerful Features of Walagraf.'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-6'>
        {contents.map((content, i) => {
          return (
            <SectionBox
              key={i}
              title={content.title}
              icon={content.icon}
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
    <div className='bg-secondary p-6 pb-4 border border-gray-600 rounded-lg shadow-lg'>
      <div className='flex items-center gap-2'>
        <div className='text-2xl mb-0.5' dangerouslySetInnerHTML={{ __html: props.icon }} />
        <div className='text-lg font-semibold text-white'>{props.title}</div>
      </div>
      <div className='py-4'>{props.desc}</div>
      <ul className='border-t border-gray-700 py-4 space-y-2'>
        {props.features.map((feature, i) => (
          <li key={i}>{feature}</li>
        ))}
      </ul>
      <button className='cursor-not-allowed px-4 py-2 bg-red text-secondary hover:text-white rounded w-full font-semibold'>
        GET IT
      </button>
    </div>
  )
}
