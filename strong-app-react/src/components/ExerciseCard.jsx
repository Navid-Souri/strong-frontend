import React from 'react';

function ExerciseCard({ theme, exercise }) {
  const colors = {
    cardBg: theme === "dark" ? "#262626" : "#f7fafc",
    cardText: theme === "dark" ? "#e5e7eb" : "#262626",
    cardBorder: theme === "dark" ? "#4a5568" : "#e2e8f0",
    tagBg: theme === "dark" ? "#4f46e5" : "#6366f1", // Indigo for tags
    tagText: "#ffffff",
    // New hover colors for a subtle effect
    cardHoverBg: theme === "dark" ? "#374151" : "#edf2f7", // Slightly lighter/darker on hover
    cardHoverBorder: theme === "dark" ? "#6366f1" : "#4f46e5", // Accent color on hover
  };

  return (
    <div
      className="flex-none w-64 p-4 rounded-lg shadow-md border 
                 transform transition-all duration-300 ease-in-out 
                 hover:scale-105 hover:shadow-xl cursor-pointer" // Added animation classes
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
        color: colors.cardText,
        // Apply hover styles directly if Tailwind's hover:bg-opacity-80 isn't enough
        // Or define a hover state with useState if more complex logic is needed
      }}
    >
      <h4 className="text-lg font-bold mb-2 group-hover:font-extrabold">{exercise.name}</h4> {/* group-hover for text bold */}
      {exercise.is_cardio && (
        <span
          className="inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2"
          style={{ backgroundColor: colors.tagBg, color: colors.tagText }}
        >
          کاردیو
        </span>
      )}
      <p className="text-sm mb-3 line-clamp-3">{exercise.description || "توضیحات ندارد."}</p>
      {exercise.video_url && (
        <a
          href={exercise.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm"
        >
          مشاهده ویدئو
        </a>
      )}
    </div>
  );
}

export default ExerciseCard;
