// Import required dependencies and components
import { Routes, Route } from "react-router-dom";
// Import page components
import Home from "../UI/Home";
import Aichat from "./Aichat";
import NewsFeed from "./NewsFeed";
import Hospitalmap from "./Hospitalmap";
import MyHealthRecords from "./MyHelathRecord";
// Main routing component that manages application navigation
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Landing/Home page */}
      <Route path="/aichat" element={<Aichat />} /> {/* AI Health Assistant */}
      <Route path="/newsfeed" element={<NewsFeed />} /> {/* Health News Feed */}
      <Route path="/map" element={<Hospitalmap />} /> {/* Hospital Locator */}
      <Route path="/records" element={<MyHealthRecords />} /> {/* Health Records */}
    </Routes>
  );
};

export default AllRoutes;