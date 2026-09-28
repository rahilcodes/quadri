import About from '@/components/About';
import Contact from '@/components/Contact';
import Disclaimer from '@/components/Disclaimer';
import FactStrip from '@/components/FactStrip';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import HowWeWork from '@/components/HowWeWork';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import Notary from '@/components/Notary';
import Practice from '@/components/Practice';
import StickyBar from '@/components/StickyBar';

export default function Home() {
  return (
    <>
      <a className="skip-link button on-ivory" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <FactStrip />
        <Practice />
        <About />
        <HowWeWork />
        <Notary />
        <Contact />
      </main>
      <Footer />
      <StickyBar />
      <Disclaimer />
      <Motion />
    </>
  );
}
