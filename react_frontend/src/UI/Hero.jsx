import { useNavigate } from "react-router-dom";
import "../styles/hero.css";
import heroImg from "../assets/img/hero.png";

// Hero component displaying the main landing page content with call-to-action
const Hero = () => {
  const navigate = useNavigate();

  // Navigate to AI chat when Get Started is clicked
  const handleGetStarted = () => navigate("/aichat");

  return (
    <section id="#" className="px-4 md:px-0">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="hero__wrapper flex flex-col-reverse md:flex-row items-center justify-between gap-8 pt-12">
          {/* Hero content section with title and description */}
          <div className="hero__content w-full md:w-1/2 text-center md:text-left">
            <h1 
              className="section__title text-xl md:text-5xl font-bold leading-tight mb-6"
              data-aos-duration="1000"
              data-aos="fade-up"
            >
              Stay Active, Stay <span className="highlights">Healthy</span> with
              ElderWell
            </h1>
            <p data-aos-duration="1100" data-aos="fade-up" data-aos-delay="100">
              Your Wellness, Our Priority at ElderWell
              <br />
              <br />
              ElderWell is your trusted companion for aging well. Whether it's
              staying active, managing your health, finding nearby care, or
              simply learning something new — we’re here to support your full
              well-being every step of the way.
              <br /> <br />
              Let's take the first step and ask our AI Assistant about your
              health.
            </p>

            <div
              className="hero__btns flex justify-center md:justify-start gap-6"
              data-aos-duration="1200"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <button className="register__btn" onClick={handleGetStarted}>
                Get Started
              </button>
            </div>
          </div>

          <div className="hero__img">
            <div className="hero__img-wrapper">
              <div className="box-01">
                <div className="box-02">
                  <div className="box-03">
                    <div className="box__img">
                      <img className="heroposter" src={heroImg} alt="Elderly people staying active and healthy" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
