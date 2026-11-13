import Hero from "../components/Hero";
import Navbar from "../../../shared/components/Navbar";
import HowItWorks from "../components/HowItWorks";
import Benefits from "../components/Benefits";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default Home;
