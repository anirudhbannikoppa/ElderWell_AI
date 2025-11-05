import Hero from "./Hero";
import Exercise from "./Exercise";
import Start from "./Start";

// Home component composing the main page sections: Hero, Exercise, and Start
const Home = () => {
  return (
    <main>
      <Hero />
      <Exercise />
      <Start />
    </main>
  );
};

export default Home;
