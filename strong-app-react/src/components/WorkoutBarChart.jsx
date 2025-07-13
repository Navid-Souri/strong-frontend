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

function WorkoutBarChart({ theme }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  // Define API Base URL from environment variable, with localhost fallback for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  // تشخیص سایز صفحه
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
          setError("برای مشاهده اطلاعات تمرین وارد شوید.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/workouts/workout-summary-by-day/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const days = [
          "شنبه",
          "یک",
          "دو",
          "سه‌",
          "چهار",
          "پنج‌",
          "جمعه",
        ];
        const map = new Map(
          response.data.map((item) => [item.day, item.total_unique_exercises])
        );
        const formatted = days.map((day) => ({
          day,
          exercises: map.get(day) || 0,
        }));

        setChartData(formatted);
      } catch (err) {
        console.error(err);
        setError(
          "خطا در دریافت اطلاعات: " +
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
        در حال بارگذاری...
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
        تعداد تمرینات انجام شده
      </h2>
      <div className="flex flex-col items-center">
        {/* برای موبایل: نمایش مقدار بالای هر ستون */}
        {isMobile && (
          <div className="grid grid-cols-7 gap-9 ml-4 mt-2">
            {chartData.map((item, idx) => (
              <div key={idx} className="text-center text-xs font-semibold">
                {item.exercises}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className=" flex-1 w-full  mx-auto p-2 sm:p-3 md:p-4">
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
              dataKey="day"
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
              formatter={(value) => [`${value} تمرین`, "تعداد تمرینات"]}
              labelFormatter={(label) => `روز: ${label}`}
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => (
                <span style={{ color: colors.text }}>{value}</span>
              )}
              payload={[
                { value: "تعداد تمرینات", type: "square", color: colors.bar },
              ]}
            />
            <Bar
              dataKey="exercises"
              name="تعداد تمرینات"
              fill={colors.bar}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default WorkoutBarChart;
