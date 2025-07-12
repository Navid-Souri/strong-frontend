// App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import User_Home from "./components/User_Home";
import Progress from "./components/Progress";
import Workout from "./components/Workout";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile"; // Make sure Profile is imported
import { HomeIcon, ChartIcon, PlanIcon, ProfileIcon } from "./components/Icons";
import SignUp from "./components/Sign_up";
import Login from "./components/Login";
import Couch_Home from "./components/Couch_Home";
import Header from "./components/Header";
import "./App.css";
import SideNavbar from "./components/SideNavbar";
function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    console.log("Toggle theme clicked!");
  };

  const menuItems = [
    { id: 1, icon: <HomeIcon />, path: "/User_Home" },
    { id: 2, icon: <ChartIcon />, path: "/Progress" },
    { id: 3, icon: <PlanIcon />, path: "/Workout" },
    { id: 4, icon: <ProfileIcon />, path: "/Profile" },
  ];

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div
      dir="auto"
      className="w-full min-h-screen  text-gray-900 dark:bg-neutral-800 dark:text-white transition-colors duration-300"
    >
      {/* Header component (no theme button here anymore) */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 pb-20">
        <Routes>
          <Route path="/Home" element={<Navigate to="/login" />} />
          <Route path="/home" element={<Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/User_Home" element={<User_Home theme={theme}/>} />
          <Route path="/Couch_Home" element={<Couch_Home />} />
          <Route path="/Progress" element={<Progress theme={theme} />} />
          <Route path="/Workout" element={<Workout theme={theme}/>} />
          {/* PASSS THEME AND TOGGLETHEME AS PROPS TO PROFILE */}
          <Route path="/Profile" element={<Profile theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>

      {/* Navbar at the bottom */}
      {!hideNavbar && (
        <div className="fixed bottom-0 left-0 w-full z-49">
          <Navbar menuItems={menuItems} />
        </div>
      )}
      {!hideNavbar && (
        <div className="fixed  left-0 w-full z-49">
          <SideNavbar menuItems={menuItems} />
        </div>
      )}
    </div>
    
  );
}

function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Root;