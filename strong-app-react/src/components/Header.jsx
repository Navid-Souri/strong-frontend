// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";

import logoLight from "./img/logo-black.png";
import logoDark from "./img/logo-white.png";

function Header({ theme }) {
  const location = useLocation();

  const hideHeaderElements =
    location.pathname === "/login" || location.pathname === "/signup";

  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  // OpenWeatherMap API details
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // For Vite. Use process.env.REACT_APP_OPENWEATHER_API_KEY for CRA.
  const CITY_NAME = "Berlin"; // Your city
  const UNITS = "metric"; // For Celsius

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (!API_KEY) {
          throw new Error("OpenWeather API key is missing. Check your .env file.");
        }
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&units=${UNITS}&appid=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Weather data fetch failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherError(error.message); // Set the error message directly from the catch
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather(); // Call fetchWeather immediately

  }, [API_KEY, CITY_NAME, UNITS]); // Dependencies for useEffect

  // Weather Widget JSX - extracted for reusability and clarity
  const weatherWidget = (
    <> {/* Use a fragment if you need multiple elements at this level */}
      {loadingWeather && <p className="text-sm">Loading weather...</p>}
      {weatherError && <p className="text-sm text-red-500">{weatherError}</p>}
      {weather && (
        <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
            className="w-8 h-8"
            title={weather.weather[0].description}
          />
          <span>
            {Math.round(weather.main.temp)}°C
          </span>
          <span className="ml-2 text-gray-600 dark:text-gray-300 hidden sm:inline">
            {weather.name}
          </span>
        </div>
      )}
    </>
  );

  return (
    <div className="z-50 fixed top-0 left-0 w-full bg-white dark:bg-neutral-900 shadow-md" dir="ltr">
      <div className="flex items-center h-16 sm:h-20 px-4 py-3 sm:px-6 md:px-10 lg:px-20"> {/* Add a min-height for consistency */}

        {/* Conditional rendering for header layout */}
        {hideHeaderElements ? (
          // Scenario 1: Login/Signup - Logo is the only visible element, so center it
          <div className="w-full flex justify-center">
            <img
              className="h-auto w-full max-w-20 sm:max-w-xs md:max-w-[50px] lg:max-w-[100px]"
              src={theme === "dark" ? logoDark : logoLight}
              alt="logo"
            />
          </div>
        ) : (
          // Scenario 2: Other Pages - Logo Left, Weather Middle, Logout Right
          <React.Fragment> {/* Use React.Fragment to group multiple elements */}
            {/* Left Section: Logo */}
            <div className="flex-shrink-0"> {/* Prevents logo from shrinking */}
              <img
                className="h-auto w-full max-w-20 sm:max-w-xs md:max-w-[50px] lg:max-w-[100px]"
                src={theme === "dark" ? logoDark : logoLight}
                alt="logo"
              />
            </div>

            {/* Middle Section: Weather Widget */}
            <div className="flex-grow flex justify-center"> {/* Takes available space and centers content */}
              {weatherWidget}
            </div>

            {/* Right Section: Logout Button */}
            <div className="flex-shrink-0"> {/* Prevents button from shrinking */}
              <LogoutButton />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default Header;