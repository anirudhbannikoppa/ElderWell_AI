import { useEffect } from "react";
import AOS from "aos";
import "./App.css";
import "aos/dist/aos.css";
import Header from "./components/Header";
import AllRoutes from "./components/AllRoutes";
import Footer from "./UI/Footer";

// Root component initializing AOS (Animate On Scroll) and providing app layout
function App() {
  // Initialize AOS animations when component mounts
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="app-container">
      <Header />
      <AllRoutes />
      <Footer />
    </div>
  );
}

export default App;
