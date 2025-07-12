import React, { useState } from "react";
import WorkoutBarChartMonth from "./WorkoutBarChartMonth"; // Monthly unique exercises
import WorkoutBarChart from "./WorkoutBarChart"; // Original daily unique exercises (7 days)
import WorkoutBarChart30Days from "./WorkoutBarChart30Days"; // 30-day unique exercises
import DailyMoodChart from "./DailyMoodChart"; // Daily Mood Chart
import DailyWaterLogChart from "./DailyWaterLogChart"; // Daily Water Log Chart
import WeightLogChart from "./WeightLogChart"; // NEW: Weight Log Chart

function Progress({ theme }) {
  // State to manage which view/chart is currently active
  // Possible values: "monthlyExercises", "dailyExercises7Days", "dailyExercises30Days", "dailyMood", "dailyWaterLog", "weightLog"
  const [activeView, setActiveView] = useState("monthlyExercises"); // Default to monthly exercises

  const colors = {
    background: theme === "dark" ? "#262626" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#262626",
    buttonBg: theme === "dark" ? "#374151" : "#e2e8f0",
    buttonHover: theme === "dark" ? "#4a5568" : "#d1d5db",
    selectedButtonBg: theme === "dark" ? "#6366f1" : "#4f46e5", // Color for selected button
  };

  return (
    <div
      className="w-full min-h-screen p-4 pt-20"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <h1 className="text-2xl font-bold text-center mb-6">Your Progress</h1>

      {/* Buttons to select the view */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveView("monthlyExercises")}
          className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-200
            ${activeView === "monthlyExercises" ? `bg-opacity-90 ${colors.selectedButtonBg} text-white` : `bg-opacity-75 ${colors.buttonBg} text-white`}
            hover:bg-opacity-100
          `}
          style={{ backgroundColor: activeView === "monthlyExercises" ? colors.selectedButtonBg : colors.buttonBg }}
        >
          Monthly Unique Exercises
        </button>

        <button
          onClick={() => setActiveView("dailyExercises7Days")}
          className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-200
            ${activeView === "dailyExercises7Days" ? `bg-opacity-90 ${colors.selectedButtonBg} text-white` : `bg-opacity-75 ${colors.buttonBg} text-white`}
            hover:bg-opacity-100
          `}
          style={{ backgroundColor: activeView === "dailyExercises7Days" ? colors.selectedButtonBg : colors.buttonBg }}
        >
          Daily Exercises (7 Days)
        </button>
        
        <button
          onClick={() => setActiveView("dailyExercises30Days")}
          className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-200
            ${activeView === "dailyExercises30Days" ? `bg-opacity-90 ${colors.selectedButtonBg} text-white` : `bg-opacity-75 ${colors.buttonBg} text-white`}
            hover:bg-opacity-100
          `}
          style={{ backgroundColor: activeView === "dailyExercises30Days" ? colors.selectedButtonBg : colors.buttonBg }}
        >
          Daily Exercises (30 Days)
        </button>

        <button
          onClick={() => setActiveView("dailyMood")}
          className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-200
            ${activeView === "dailyMood" ? `bg-opacity-90 ${colors.selectedButtonBg} text-white` : `bg-opacity-75 ${colors.buttonBg} text-white`}
            hover:bg-opacity-100
          `}
          style={{ backgroundColor: activeView === "dailyMood" ? colors.selectedButtonBg : colors.buttonBg }}
        >
          Daily Mood
        </button>

        <button
          onClick={() => setActiveView("dailyWaterLog")}
          className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-200
            ${activeView === "dailyWaterLog" ? `bg-opacity-90 ${colors.selectedButtonBg} text-white` : `bg-opacity-75 ${colors.buttonBg} text-white`}
            hover:bg-opacity-100
          `}
          style={{ backgroundColor: activeView === "dailyWaterLog" ? colors.selectedButtonBg : colors.buttonBg }}
        >
          Daily Water Log
        </button>

        {/* NEW Button for Weight Log */}
        <button
          onClick={() => setActiveView("weightLog")}
          className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-200
            ${activeView === "weightLog" ? `bg-opacity-90 ${colors.selectedButtonBg} text-white` : `bg-opacity-75 ${colors.buttonBg} text-white`}
            hover:bg-opacity-100
          `}
          style={{ backgroundColor: activeView === "weightLog" ? colors.selectedButtonBg : colors.buttonBg }}
        >
          Weight Log
        </button>
      </div>

      {/* Conditionally render components based on activeView */}
      <div className="w-full max-w-4xl mx-auto">
        {activeView === "monthlyExercises" && (
          <WorkoutBarChartMonth theme={theme} />
        )}

        {activeView === "dailyExercises7Days" && (
          <WorkoutBarChart theme={theme} />
        )}
        
        {activeView === "dailyExercises30Days" && (
          <WorkoutBarChart30Days theme={theme} />
        )}

        {activeView === "dailyMood" && (
          <DailyMoodChart theme={theme} />
        )}
        
        {activeView === "dailyWaterLog" && (
          <DailyWaterLogChart theme={theme} />
        )}

        {activeView === "weightLog" && ( // NEW: Render Weight Log Chart
          <WeightLogChart theme={theme} />
        )}
      </div>
    </div>
  );
} 

export default Progress;
