// Exercise UI: three feature cards explaining ElderWell's support areas
import "../styles/exercise.css";
import lunges from "../assets/img/lunges.png";
import yoga from "../assets/img/yoga-pose.png";
import ex from "../assets/img/extended.png";

const Exercise = () => {
  // Presentational component: static content only
  return (
    <section className="px-4 md:px-0">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Top Section: title + intro */}
        <div className="exercise__top mb-8 text-center">
          <h2 className="section__title text-3xl md:text-4xl font-bold mb-4">
            🌿 What <span className="highlights">ElderWell</span> Can Help You With
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-7">
            We believe that wellness is more than just exercise — it’s about feeling good,
            <br className="hidden sm:block" /> staying safe, and staying connected.
          </p>
        </div>
        {/* Exercise Cards: three responsive cards with icon + copy */}
        <div className="exercise__wrapper flex flex-col md:flex-row gap-8 md:gap-0 p-6 md:p-[80px] md:px-[60px] rounded-md bg-gradient-to-br from-purple-600 to-blue-500">
          {/* Card 1 - Health & Care */}
          <div className="exercise__item flex flex-col md:flex-row items-center md:items-start text-center md:text-left md:w-1/3 w-full gap-4" data-aos-duration="1500" data-aos="zoom-in">
            <span className="exercise__icon w-16 h-16 flex justify-center items-center bg-white p-2 rounded mx-auto md:mx-0">
              <img src={lunges} alt="lunges icon" />
            </span>
            <div className="exercise__content mt-4 md:mt-0">
              <h4 className="text-lg font-semibold text-white">Health & Care</h4>
              <p className="text-white/80">Keep track of medical info, find nearby hospitals, and access health tips.</p>
            </div>
          </div>
          {/* Card 2 - Mind & Movement */}
          <div className="exercise__item flex flex-col md:flex-row items-center md:items-start text-center md:text-left md:w-1/3 w-full gap-4" data-aos-duration="1500" data-aos="zoom-in">
            <span className="exercise__icon w-16 h-16 flex justify-center items-center bg-white p-2 rounded mx-auto md:mx-0">
              <img src={yoga} alt="yoga icon" />
            </span>
            <div className="exercise__content mt-4 md:mt-0">
              <h4 className="text-lg font-semibold text-white">Mind & Movement</h4>
              <p className="text-white/80">Gentle activities, stress relief techniques, and routines for better sleep and flexibility.</p>
            </div>
          </div>
          {/* Card 3 - Daily Life Support */}
          <div className="exercise__item flex flex-col md:flex-row items-center md:items-start text-center md:text-left md:w-1/3 w-full gap-4" data-aos-duration="1500" data-aos="zoom-in">
            <span className="exercise__icon w-16 h-16 flex justify-center items-center bg-white p-2 rounded mx-auto md:mx-0">
              <img src={ex} alt="daily life icon" />
            </span>
            <div className="exercise__content mt-4 md:mt-0">
              <h4 className="text-lg font-semibold text-white">Daily Life Support</h4>
              <p className="text-white/80">Helpful resources for nutrition, safety, caregiving, and emotional well-being.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Exercise;
