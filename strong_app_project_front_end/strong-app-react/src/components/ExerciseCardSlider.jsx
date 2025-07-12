import React from 'react';
import ExerciseCard from './ExerciseCard'; // New import

function ExerciseCardSlider({ theme, exercises }) {
  const colors = {
    background: theme === "dark" ? "#404040" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#404040",
  };

  return (
    <div
      className="p-4 rounded-lg shadow-md mb-6"
      style={{ backgroundColor: colors.background }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
        تمرینات موجود
      </h3>
      <div
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide" // scrollbar-hide is a custom utility or needs to be configured
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // For Firefox and IE/Edge
      >
        {exercises.map(exercise => (
          <ExerciseCard key={exercise.id} theme={theme} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}

export default ExerciseCardSlider;
