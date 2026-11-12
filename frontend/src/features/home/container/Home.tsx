import Hero from "../components/Hero";
import Navbar from "../../../shared/components/Navbar";
import HowItWorks from "../components/HowItWorks";

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
      </main>
    </>
  );
};

export default Home;
