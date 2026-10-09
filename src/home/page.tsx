import Contact from "../components/Contact"
import FeaturedProjects from "../components/FeaturedProjects"
import Footer from "../components/Footer"
import HeroAbout from "../components/HeroAbout"
import Nav from "../components/Nav"
import Reveal from "../components/Reveal"
import Services from "../components/Services"
import Testimonials from "../components/Testimonials"
import Thoughts from "../components/Thoughts"

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroAbout />
        <Reveal />
        <Services />
        <FeaturedProjects />
        <Testimonials />
        <Thoughts />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
