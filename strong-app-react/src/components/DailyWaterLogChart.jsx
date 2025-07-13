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

function DailyWaterLogChart({ theme }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  // Define API Base URL from environment variable, with localhost fallback for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://strong-backend-5caa.onrender.com';

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchWaterLogSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          setError("Please log in to view water log data.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/progress/daily-water-summary-last-30-days/`, // Correct URL for DailyWaterLog
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setChartData(response.data);

      } catch (err) {
        console.error(err);
        setError(
          "Error fetching water log data: " +
            (err.response?.data?.detail || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWaterLogSummary();
  }, []);

  const colors = {
    axis: theme === "dark" ? "#cbd5e1" : "#475569",
    grid: theme === "dark" ? "#4a5568" : "#e2e8f0",
    bar: theme === "dark" ? "#3b82f6" : "#2563eb", // Blue for water
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
        Loading water log data...
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
        Daily Water Log (Last 30 Days)
      </h2>
      <div className="flex-1 w-full mx-auto p-2 sm:p-3 md:p-4">
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: isMobile ? 5 : 30,
              left: isMobile ? 5 : 20,
              bottom: isMobile ? 60 : 30,
            }}
            barSize={isMobile ? 10 : 18}
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
              allowDecimals={false}
              tick={{ fill: colors.axis, fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 25 : 35}
              label={{ value: "Amount (ml)", angle: -90, position: 'insideLeft', fill: colors.axis, fontSize: isMobile ? 10 : 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                borderColor: colors.grid,
                borderRadius: "8px",
                color: colors.tooltipText,
              }}
              formatter={(value) => [`${value} ml`, "Water Log"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => (
                <span style={{ color: colors.text }}>{value}</span>
              )}
              payload={[
                { value: "Water Log (ml)", type: "square", color: colors.bar },
              ]}
            />
            <Bar
              dataKey="amount_ml" // Data key matches the backend response's value_field
              name="Water Log (ml)"
              fill={colors.bar}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DailyWaterLogChart;
