import { useEffect } from 'react'
import { HeroExchange, HeroPlanner } from '../components/home'

const AboutPage = () => {
  useEffect(() => {
    if (!window.location.href.split('#')[1]) document.getElementById('layout').scrollIntoView()
  }, [])

  return (
    <div className="container mx-auto mb-8 w-full px-4 md:px-6">
      <HeroPlanner />
      <HeroExchange />
    </div>
  )
}

export default AboutPage
