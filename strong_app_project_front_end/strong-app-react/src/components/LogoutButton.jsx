import React from "react";
import { useNavigate } from "react-router-dom";
import { LogoutIcon } from "./Icons"; // Import the LogoutIcon

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Remove tokens from localStorage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // 2. Redirect the user to the login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="
        hover:shadow-lg text-black dark:shadow-md dark:hover:shadow-gray-700
        dark:text-white      
        font-bold rounded-full
        transition-colors duration-300
        flex items-center justify-center 
        
        
      "
    >
      {/* Render the LogoutIcon component */}
      <LogoutIcon className="" />{" "}
      {/* Adjust size with w- and h- classes */}
      {/* Optionally, keep the text for accessibility or larger screens, or remove it */}
      {/* <span className="hidden sm:inline">خروج</span> */}{" "}
      {/* Example: hide text on small, show on sm+ */}
    </button>
  );
}

export default LogoutButton;
