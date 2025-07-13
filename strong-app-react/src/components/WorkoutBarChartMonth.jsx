import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function WorkoutBarChartMonth({ theme }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  // Define API Base URL from environment variable, with localhost fallback for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchWorkoutSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          setError("Please log in to view workout data.");
          setLoading(false);
          return;
        }

        // Changed API endpoint to fetch monthly data
        const response = await axios.get(
          `${API_BASE_URL}/workouts/workout-summary-by-month/`, // Changed URL
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        // The backend now returns data with 'month_year' and 'exercises' fields
        // No need for manual mapping of days/months on the frontend
        setChartData(response.data);

      } catch (err) {
        console.error(err);
        setError(
          "Error fetching data: " +
            (err.response?.data?.detail || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutSummary();
  }, []);

  const colors = {
    axis: theme === "dark" ? "#cbd5e1" : "#475569",
    grid: theme === "dark" ? "#4a5568" : "#e2e8f0",
    bar: theme === "dark" ? "#6366f1" : "#4f46e5",
    tooltipBg: theme === "dark" ? "#1f2937" : "#ffffff",
    tooltipText: theme === "dark" ? "#e5e7eb" : "#1f2937",
    background: theme === "dark" ? "#404040" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#1f2937",
  };

  if (loading) {
    return (
      <div className="text-center p-4" style={{ color: colors.text }}>
        Loading data...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div
      className={`w-full p-4 rounded-lg shadow-md mb-6`}
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <h2 className="text-center text-lg font-semibold mb-4">
        Total Unique Exercises by Month
      </h2>
      {/* Removed mobile-specific value display above bars for monthly data as it can get cluttered */}
      <div className="flex-1 w-full mx-auto p-2 sm:p-3 md:p-4">
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: isMobile ? 10 : 30,
              left: isMobile ? 5 : 20,
              bottom: isMobile ? 50 : 30,
            }}
            barSize={isMobile ? 18 : 28}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.grid}
              vertical={false}
            />
            <XAxis
              dataKey="month_year" // Changed dataKey to 'month_year'
              tick={{
                fill: colors.axis,
                fontSize: isMobile ? 10 : 12,
                angle: isMobile ? -45 : 0,
                textAnchor: isMobile ? "end" : "middle",
              }}
              interval={0}
              height={isMobile ? 60 : 40}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: colors.axis, fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 25 : 35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                borderColor: colors.grid,
                borderRadius: "8px",
                color: colors.tooltipText,
              }}
              formatter={(value) => [`${value} exercises`, "Unique Exercises"]} // Updated text
              labelFormatter={(label) => `Month: ${label}`} // Updated text
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => (
                <span style={{ color: colors.text }}>{value}</span>
              )}
              payload={[
                { value: "Unique Exercises", type: "square", color: colors.bar }, // Updated text
              ]}
            />
            <Bar
              dataKey="exercises" // Data key remains 'exercises' as defined in backend response
              name="Unique Exercises" // Updated text
              fill={colors.bar}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default WorkoutBarChartMonth;
