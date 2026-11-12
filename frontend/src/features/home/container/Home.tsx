import Hero from "../components/Hero";
import Navbar from "../../../shared/components/Navbar";
import HowItWorks from "../components/HowItWorks";
import Benefits from "../components/Benefits";

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
      </main>
    </>
  );
};

export default Home;
