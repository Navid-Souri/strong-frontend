import React, { useState, useEffect } from "react";
import {
  LineChart, // Using LineChart for weight trend
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function WeightLogChart({ theme }) {
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
    const fetchWeightLogSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          setError("Please log in to view weight log data.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/progress/weight-summary-last-30-days/", // Correct URL for WeightLog
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        // Filter out data points where weight is null (for days with no log)
        // Recharts LineChart handles nulls, but for a cleaner line,
        // we might want to only connect points where data exists.
        // The backend should be sending null for missing days, which Recharts handles.
        setChartData(response.data);

      } catch (err) {
        console.error(err);
        setError(
          "Error fetching weight log data: " +
            (err.response?.data?.detail || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeightLogSummary();
  }, []);

  const colors = {
    axis: theme === "dark" ? "#cbd5e1" : "#475569",
    grid: theme === "dark" ? "#4a5568" : "#e2e8f0",
    line: theme === "dark" ? "#ef4444" : "#dc2626", // Red for weight trend
    tooltipBg: theme === "dark" ? "#1f2937" : "#ffffff",
    tooltipText: theme === "dark" ? "#e5e7eb" : "#1f2937",
    background: theme === "dark" ? "#404040" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#1f2937",
  };

  // Custom Tick Formatter for XAxis to show only day for mobile or full date for desktop
  const formatXAxisTick = (tickItem) => {
    if (isMobile) {
      return tickItem.split('-')[2]; // Just day number
    }
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="text-center p-4" style={{ color: colors.text }}>
        Loading weight log data...
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
        Daily Weight Log (Last 30 Days)
      </h2>
      <div className="flex-1 w-full mx-auto p-2 sm:p-3 md:p-4">
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: isMobile ? 5 : 30,
              left: isMobile ? 5 : 20,
              bottom: isMobile ? 60 : 30,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.grid}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{
                fill: colors.axis,
                fontSize: isMobile ? 8 : 12,
                angle: isMobile ? -60 : 0,
                textAnchor: isMobile ? "end" : "middle",
              }}
              interval={isMobile ? Math.ceil(chartData.length / 10) : 0}
              height={isMobile ? 70 : 40}
              tickFormatter={formatXAxisTick}
            />
            <YAxis
              tick={{ fill: colors.axis, fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 25 : 35}
              label={{ value: "Weight (kg)", angle: -90, position: 'insideLeft', fill: colors.axis, fontSize: isMobile ? 10 : 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                borderColor: colors.grid,
                borderRadius: "8px",
                color: colors.tooltipText,
              }}
              formatter={(value) => [`${value} kg`, "Weight"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => (
                <span style={{ color: colors.text }}>{value}</span>
              )}
              payload={[
                { value: "Weight (kg)", type: "square", color: colors.line },
              ]}
            />
            <Line
              type="monotone" // Smooth line
              dataKey="weight_kg" // Data key matches the backend response's value_field
              name="Weight (kg)"
              stroke={colors.line}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default WeightLogChart;
