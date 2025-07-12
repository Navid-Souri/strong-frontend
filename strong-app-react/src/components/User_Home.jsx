import React, { useState, useEffect } from "react";
import WorkoutBarChart from "./WorkoutBarChart";
import axios from "axios";
import DailyMoodTracker from "./DailyMoodTracker";
import WorkoutSetsTable from "./WorkoutSetsTable";
import WaterIntakeTracker from "./WaterIntakeTracker";

function User_Home({ theme }) {
  const [username, setUsername] = useState("کاربر");
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  // States for workout session selection
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null); // null means show all sets
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessionsError, setSessionsError] = useState(null);

  const colors = {
    background: theme === "dark" ? "#262626" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#262626",
    buttonBg: theme === "dark" ? "#374151" : "#e2e8f0",
    buttonHover: theme === "dark" ? "#4a5568" : "#d1d5db",
    selectedButtonBg: theme === "dark" ? "#6366f1" : "#4f46e5", // Color for selected button
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "نامشخص";
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          setUserError("لطفاً برای مشاهده پروفایل وارد شوید");
          setLoadingUser(false);
          return;
        }

        const response = await axios.get("http://localhost:8000/api/me/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsername(response.data.username);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setUserError(
          "خطا در بارگذاری پروفایل کاربر: " +
            (err.response?.data?.detail || err.message)
        );
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch workout sessions
  useEffect(() => {
    const fetchWorkoutSessions = async () => {
      setLoadingSessions(true);
      setSessionsError(null);
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          throw new Error("برای مشاهده جلسات تمرینی، لطفاً وارد شوید.");
        }

        const response = await axios.get(
          "http://localhost:8000/api/workout-sessions/", // URL for WorkoutSessionViewSet
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const sessionsData = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        
        setWorkoutSessions(sessionsData);
        // Default to selecting the first session, or null if none exist
        if (sessionsData.length > 0) {
          setSelectedSessionId(sessionsData[0].id);
        } else {
          setSelectedSessionId(null); // No sessions, no filter
        }

      } catch (err) {
        console.error("Error fetching workout sessions:", err);
        setSessionsError(
          err.response?.data?.detail ||
          err.message ||
          "خطا در دریافت لیست جلسات تمرینی"
        );
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchWorkoutSessions();
  }, []); // Run only once on mount

  if (loadingUser || loadingSessions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
        در حال بارگذاری اطلاعات...
      </div>
    );
  }

  if (userError || sessionsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-red-500 p-4">
        {userError || sessionsError}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-neutral-800 pb-20">
      {/* Main Content */}
      <main className="pt-24 w-full">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center py-4 text-gray-900 dark:text-white font-mono uppercase animate-bounce">
            سلام {username} 👋
          </h1>



          {/* Mobile View (Stacked) */}
          <div className="flex flex-col md:hidden space-y-6 w-full">
            {/* Pass selectedSessionId to WorkoutSetsTable */}
            <WorkoutSetsTable theme={theme} workoutSessionId={selectedSessionId} />
            <DailyMoodTracker theme={theme} />
            <WaterIntakeTracker theme={theme} />
            <div className=" top-24 z-0 w-full">
              <WorkoutBarChart theme={theme} />
            </div>
          </div>

          {/* Tablet View (2-column) */}
          <div className="hidden md:flex lg:hidden w-full flex-col">
            <div className="w-full mb-6">
              <WorkoutBarChart theme={theme} />
            </div>
            <div className="flex w-full gap-6">
              <div className="flex-1 flex flex-col gap-6">
                <DailyMoodTracker theme={theme} />
                <WaterIntakeTracker theme={theme} />
              </div>
              <div className="flex-1">
                {/* Pass selectedSessionId to WorkoutSetsTable */}
                <WorkoutSetsTable theme={theme} workoutSessionId={selectedSessionId} />
              </div>
            </div>
          </div>

          {/* Desktop View (3-column equivalent) */}
          <div className="hidden lg:flex w-full gap-6">
            <div className="flex-[2] flex flex-col gap-6">
              {/* Pass selectedSessionId to WorkoutSetsTable */}
              <WorkoutSetsTable theme={theme} workoutSessionId={selectedSessionId} />
              <WorkoutBarChart theme={theme} />
            </div>
            <div className="flex-1 top-24 h-fit">
              <div className="flex flex-col gap-6">
                <DailyMoodTracker theme={theme} />
                <WaterIntakeTracker theme={theme} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default User_Home;
