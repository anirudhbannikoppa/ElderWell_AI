import trainer from "../assets/img/start.png";
import { useNavigate } from "react-router-dom";
import "../styles/start.css";

// Start component promoting health record management with call-to-action
const Start = () => {
  const navigate = useNavigate();

  const handleHealthTracking = () => {
    navigate("/records");
  };

  return (
    <section className="px-4 md:px-0">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="start__wrapper flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mt-[-100px]">
          {/* Image Section */}
          <div
            className="start__img w-full pt-9 md:w-1/2 mb-8 md:mb-0"
            data-aos-duration="1500"
            data-aos="fade-left"
          >
            <img
              src={trainer}
              alt="Person tracking health records on a device"
              className="w-full h-auto"
            />
          </div>

          {/* Text Section */}
          <div
            className="start__content w-full md:w-1/2 text-center md:text-left"
            data-aos-duration="1100"
            data-aos="fade-right"
          >
            <h2 className="section__title text-3xl md:text-4xl font-bold mb-4">
              Ready to Take a Step Toward{" "}
              <span className="highlights"> Wellness?</span>
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-7 mb-8">
              Making small, steady steps in managing your health starts with
              staying organized. With ElderWell, you can safely store and access
              your medical reports, prescriptions, and health records all in one
              place. Whether you're preparing for a doctor visit or keeping
              track of long-term health, we're here to support you every step of
              the way. Stay informed, stay secure—and take control of your
              wellness journey today.
            </p>
            <button
              onClick={handleHealthTracking}
              className="register__btn px-6 py-2 bg-customPurple text-white rounded hover:bg-purple-700 transition"
              aria-label="Start tracking your health records"
            >
              Track My Health
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Start;
