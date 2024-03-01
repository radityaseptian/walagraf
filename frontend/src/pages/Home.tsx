import {
  Navbar,
  Hero,
  Carousel,
  Feature,
  ComingSoon,
  Pricing,
  FreeTrial,
} from '@/layouts'
import { Section } from '@/components'

export const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Carousel />
      <Feature />
      <ComingSoon />
      <Pricing />
      <FreeTrial />
    </div>
  )
}
