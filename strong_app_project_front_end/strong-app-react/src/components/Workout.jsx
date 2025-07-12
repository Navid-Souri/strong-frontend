import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import WorkoutSetsTable from "./WorkoutSetsTable";
import CreateSetForm from "./CreateSetForm";
import CreateWorkoutPlanForm from "./CreateWorkoutPlanForm";
import CreateExerciseForm from "./CreateExerciseForm";
import ExerciseCardSlider from "./ExerciseCardSlider";

function Workout({ theme }) {
  // State management
   console.log("Current theme:", theme);
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState({
    sessions: true,
    exercises: true,
  });
  const [errors, setErrors] = useState({
    sessions: null,
    exercises: null,
  });
  const [modals, setModals] = useState({
    createSet: false,
    createPlan: false,
    createExercise: false,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // Theme colors
  const colors = {
    background: theme === "dark" ? "#262626" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#262626",
    buttonBg: theme === "dark" ? "#374151" : "#e2e8f0",
    buttonHover: theme === "dark" ? "#4a5568" : "#d1d5db",
    selectedButtonBg: theme === "dark" ? "#6366f1" : "#4f46e5",
    createButtonBg: theme === "dark" ? "#10b981" : "#059669",
    borderColor: theme === "dark" ? "#4b5563" : "#d1d5db",
    error: theme === "dark" ? "#ef4444" : "#dc2626",
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // API fetch functions
  const fetchWorkoutSessions = useCallback(async () => {
    setLoading((prev) => ({ ...prev, sessions: true }));
    setErrors((prev) => ({ ...prev, sessions: null }));

    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken)
        throw new Error("Please log in to view workout sessions.");

      const response = await axios.get(
        "http://localhost:8000/api/workout-sessions/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const sessionsData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setWorkoutSessions(sessionsData);
      if (sessionsData.length > 0 && !selectedSessionId) {
        setSelectedSessionId(sessionsData[0]?.id || null);
      }
    } catch (err) {
      console.error("Error fetching workout sessions:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Error fetching workout sessions";
      setErrors((prev) => ({ ...prev, sessions: errorMessage }));
    } finally {
      setLoading((prev) => ({ ...prev, sessions: false }));
    }
  }, [selectedSessionId]);

  const fetchExercises = useCallback(async () => {
    setLoading((prev) => ({ ...prev, exercises: true }));
    setErrors((prev) => ({ ...prev, exercises: null }));

    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) throw new Error("Please log in to view exercises.");

      const response = await axios.get("http://localhost:8000/api/exercises/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const exercisesData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setExercises(exercisesData);
    } catch (err) {
      console.error("Error fetching exercises:", err);
      const errorMessage =
        err.response?.data?.detail || err.message || "Error fetching exercises";
      setErrors((prev) => ({ ...prev, exercises: errorMessage }));
    } finally {
      setLoading((prev) => ({ ...prev, exercises: false }));
    }
  }, []);

  // Event handlers
  const toggleModal = useCallback((modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: !prev[modalName] }));
  }, []);

  const handleSetCreated = useCallback(() => {
    toggleModal("createSet");
    setRefreshKey((prev) => prev + 1);
  }, [toggleModal]);

  const handleExerciseCreated = useCallback(() => {
    toggleModal("createExercise");
    fetchExercises();
  }, [toggleModal, fetchExercises]);

  const handlePlanCreated = useCallback(() => {
    toggleModal("createPlan");
    fetchWorkoutSessions();
  }, [toggleModal, fetchWorkoutSessions]);

  const handleRetry = useCallback(() => {
    if (errors.sessions) fetchWorkoutSessions();
    if (errors.exercises) fetchExercises();
  }, [errors.sessions, errors.exercises, fetchWorkoutSessions, fetchExercises]);

  // Initial data loading
  useEffect(() => {
    fetchWorkoutSessions();
    fetchExercises();
  }, [fetchWorkoutSessions, fetchExercises]);

  // Loading and error states
  if (loading.sessions || loading.exercises) {
    return (
      <div
        className="mt-20 flex items-center justify-center min-h-screen"
        style={{ color: colors.text }}
      >
        <div className="text-center">
          <div
            className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
            style={{ borderColor: colors.text }}
            aria-label="Loading data"
          ></div>
          <p className="mt-2">Loading data...</p>
        </div>
      </div>
    );
  }

  if (errors.sessions || errors.exercises) {
    return (
      <div className="mt-20 flex items-center justify-center min-h-screen">
        <div className="text-center p-4 max-w-md">
          <div className="text-red-500 mb-4">
            {errors.sessions || errors.exercises}
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg font-medium"
            style={{
              backgroundColor: colors.buttonBg,
              color: colors.text,
            }}
            aria-label="Retry data loading"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-20 min-h-screen p-4 md:p-6"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1
          className=" mt-20 text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8"
          style={{ color: colors.text }}
          role="heading"
          aria-level="1"
        >
          Your Workout Sessions
        </h1>

        {/* Action Buttons */}
        <div
          className=" mt-20 flex flex-wrap justify-center gap-3 mb-6"
          role="group"
          aria-label="Workout actions"
        >
          <ActionButton
            onClick={() => setSelectedSessionId(null)}
            isActive={selectedSessionId === null}
            colors={colors}
            aria-label="Show all sets"
          >
            Show All Sets
          </ActionButton>

          <ActionButton
            onClick={() => toggleModal("createSet")}
            isActive={false}
            colors={colors}
            disabled={!selectedSessionId}
            customBg={colors.createButtonBg}
            aria-label="Create new set"
          >
            Create New Set
          </ActionButton>

          <ActionButton
            onClick={() => toggleModal("createPlan")}
            isActive={false}
            colors={colors}
            customBg={colors.createButtonBg}
            aria-label="Create workout plan"
          >
            Create Workout Plan
          </ActionButton>

          <ActionButton
            onClick={() => toggleModal("createExercise")}
            isActive={false}
            colors={colors}
            customBg={colors.createButtonBg}
            aria-label="Create exercise"
          >
            Create Exercise
          </ActionButton>
        </div>

        {/* Workout Sessions Selector */}
        <SessionSelector
          sessions={workoutSessions}
          selectedId={selectedSessionId}
          onSelect={setSelectedSessionId}
          formatDate={formatDate}
          colors={colors}
        />

        {/* Workout Sets Table */}
        <WorkoutSetsTable
          theme={theme}
          workoutSessionId={selectedSessionId}
          refreshKey={refreshKey}
        />
        {/* Exercise Card Slider */}
        <SectionHeader colors={colors}>Exercise Catalog</SectionHeader>
        <ExerciseCardSlider
          theme={theme}
          exercises={exercises}
          loading={loading.exercises}
        />

        {/* Modals */}
        {modals.createSet && (
          <CreateSetForm
            theme={theme}
            workoutSessionId={selectedSessionId}
            isOpen={modals.createSet}
            onClose={() => toggleModal("createSet")}
            onSetCreated={handleSetCreated}
          />
        )}

        {modals.createPlan && (
          <CreateWorkoutPlanForm
            theme={theme}
            isOpen={modals.createPlan}
            onClose={() => toggleModal("createPlan")}
            onPlanCreated={handlePlanCreated}
          />
        )}

        {modals.createExercise && (
          <CreateExerciseForm
            theme={theme}
            isOpen={modals.createExercise}
            onClose={() => toggleModal("createExercise")}
            onExerciseCreated={handleExerciseCreated}
          />
        )}
      </div>
    </div>
  );
}

// Reusable Components
const ActionButton = React.memo(
  ({
    children,
    onClick,
    isActive,
    colors,
    disabled = false,
    customBg,
    ariaLabel,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}
    `}
      style={{
        backgroundColor: isActive
          ? colors.selectedButtonBg
          : customBg || colors.buttonBg,
        color: isActive ? "white" : colors.text,
      }}
      aria-pressed={isActive}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
);

const SessionSelector = React.memo(
  ({ sessions, selectedId, onSelect, formatDate, colors }) => (
    <div className="mb-6">
      <h2 className="sr-only" id="session-selector-heading">
        Workout Sessions
      </h2>
      {sessions.length > 0 ? (
        <div
          className="flex flex-wrap justify-center gap-2 max-h-60 overflow-y-auto p-3 rounded-lg"
          style={{ border: `1px solid ${colors.borderColor}` }}
          role="tablist"
          aria-labelledby="session-selector-heading"
        >
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelect(session.id)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${selectedId === session.id ? "ring-2 ring-offset-2" : ""}
            `}
              style={{
                backgroundColor:
                  selectedId === session.id
                    ? colors.selectedButtonBg
                    : colors.buttonBg,
                color: selectedId === session.id ? "white" : colors.text,
              }}
              role="tab"
              aria-selected={selectedId === session.id}
              id={`session-tab-${session.id}`}
              tabIndex={selectedId === session.id ? 0 : -1}
            >
              Session {formatDate(session.date)}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500" style={{ color: colors.text }}>
          No workout sessions recorded yet.
        </p>
      )}
    </div>
  )
);

const SectionHeader = React.memo(({ children, colors }) => (
  <h2
    className="text-xl font-semibold text-center mb-4"
    style={{ color: colors.text }}
    role="heading"
    aria-level="2"
  >
    {children}
  </h2>
));

export default React.memo(Workout);
