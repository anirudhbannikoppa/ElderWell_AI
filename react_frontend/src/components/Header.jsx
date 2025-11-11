// Header component: site navigation, responsive menu, and login/logout
import { useState } from "react"; // only useState is required
import { NavLink } from "react-router-dom"; // client routing
import logo from "../assets/img/logo.png"; // app logo image
import { useAuth0 } from "@auth0/auth0-react"; // Auth0 hooks for auth state
import "remixicon/fonts/remixicon.css"; // icon font used in UI

// Navigation links used in both desktop and mobile menus
const nav__links = [
  { path: "/#", display: "Home" },
  { path: "/aichat", display: "Ai-Assistant" },
  { path: "/newsfeed", display: "Health News" },
  { path: "/map", display: "Associated Hospitals" },
  { path: "/records", display: "My Health Records" },
];

const Header = () => {
  // Auth0 provides user info and login/logout helpers
  const { user, loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu open state

  return (
    <header className="fixed w-full z-50 bg-white shadow-md sticky__header font-questrial">
      <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-3">
            <a href="/#" className="flex items-center">
              <img
                src={logo}
                className="h-12 w-auto object-contain"
                alt="ElderWell Logo"
              />
              <span className="text-3xl md:text-4xl font-semibold text-gray-900 ml-4 mt-2 ">
                ElderWell
              </span>
            </a>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center">
          {nav__links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-gray-700 font-semibold font-medium hover:text-blue-600 transition ${
                  isActive ? "text-blue-600 border-b-2 border-blue-600 " : ""
                }`
              }
            >
              {link.display}
            </NavLink>
          ))}

          {isAuthenticated && (
            <span className="text-gray-600 font-bold text-sm">
              {/* show user name when logged in */}
              {user.name}
            </span>
          )}
          {isAuthenticated ? (
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="bg-customPurple hover:bg-red-600 text-white px-4 py-1 rounded"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={loginWithRedirect}
              className="bg-customPurple hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              Log In
            </button>
          )}
        </nav>

        {/* Mobile Menu Icon (visible on small screens) */}
        <div className="md:hidden">
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - shown when `menuOpen` is true */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white z-50 shadow-md px-4 py-4 space-y-3">
          {nav__links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className="block text-gray-700 font-semibold hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              {link.display}
            </NavLink>
          ))}
          {isAuthenticated && (
            <p className="text-gray-600 text-sm">{user.name}</p>
          )}
          {isAuthenticated ? (
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="bg-red-500 hover:bg-red-600 text-white w-full py-1 rounded"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={loginWithRedirect}
              className="bg-customPurple hover:bg-blue-600 text-white w-full py-1 rounded"
            >
              Log In
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
