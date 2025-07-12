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

function WorkoutBarChart30Days({ theme }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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

        // Changed API endpoint to fetch 30-day data
        const response = await axios.get(
          "http://localhost:8000/workouts/workout-summary-last-30-days/", // New URL
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setChartData(response.data);

      } catch (err) {
        console.error(err);
        setError(
          "Error fetching 30-day data: " +
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

  // Custom Tick Formatter for XAxis to show only day for mobile or full date for desktop
  const formatXAxisTick = (tickItem) => {
    if (isMobile) {
      // For mobile, just show the day (e.g., '15' for 2023-07-15)
      return tickItem.split('-')[2];
    }
    // For desktop, show the full date or a more readable format
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="text-center p-4" style={{ color: colors.text }}>
        Loading 30-day data...
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
        Unique Exercises in Last 30 Days
      </h2>
      <div className="flex-1 w-full mx-auto p-2 sm:p-3 md:p-4">
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: isMobile ? 5 : 30, // Adjusted right margin for mobile
              left: isMobile ? 5 : 20,
              bottom: isMobile ? 60 : 30, // Increased bottom margin for mobile x-axis labels
            }}
            barSize={isMobile ? 10 : 18} // Smaller bars for more data points
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.grid}
              vertical={false}
            />
            <XAxis
              dataKey="date" // Data key is 'date' now
              tick={{
                fill: colors.axis,
                fontSize: isMobile ? 8 : 12, // Smaller font for mobile
                angle: isMobile ? -60 : 0, // More aggressive angle for mobile
                textAnchor: isMobile ? "end" : "middle",
              }}
              interval={isMobile ? Math.ceil(chartData.length / 10) : 0} // Skip labels on mobile if too many
              height={isMobile ? 70 : 40} // Increased height for rotated labels
              tickFormatter={formatXAxisTick} // Use custom formatter
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
              formatter={(value) => [`${value} exercises`, "Unique Exercises"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => (
                <span style={{ color: colors.text }}>{value}</span>
              )}
              payload={[
                { value: "Unique Exercises", type: "square", color: colors.bar },
              ]}
            />
            <Bar
              dataKey="exercises"
              name="Unique Exercises"
              fill={colors.bar}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default WorkoutBarChart30Days;
