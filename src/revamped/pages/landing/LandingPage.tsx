import '../../css/index.css'
import HeroSection from './HeroSection'
import InfoSection from './InfoSection'
import FAQsSection from './FAQsSection'
import VideoSection from './VideoSection'
import AboutSection from './AboutSection'
import Footer from '../../components/Footer'
import FeaturesSection from './FeaturesSection'
import ScrollToTop from '../../components/ScrollToTop'
import NavigationBar from '../../components/NavigationBar'

/**
 * This is the Landing Page
 * @returns
 */
export default function LandingPage() {
  // const []
  return (
    <div className='revamped-wrapper'>
      <ScrollToTop />
      <NavigationBar />
      <main className='revamped-landing-page'>
        <HeroSection />
        <AboutSection />
        <VideoSection />
        <InfoSection />
        <FeaturesSection />
        <FAQsSection />
      </main>
      <Footer />
    </div>
  )
}
