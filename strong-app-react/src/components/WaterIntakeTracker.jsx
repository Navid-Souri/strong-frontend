import React, { useState, useEffect } from "react";
import axios from "axios";
import water_bottle from "./img/water_bottle.png"; // مسیر ایمیج بطری آب را اینجا قرار دهید
const WATER_INCREMENT_ML = 250; // مقدار افزایش آب با هر کلیک
const MAX_BOTTLE_IMAGES = 10; // حداکثر تعداد ایمیج‌های بطری آب

function WaterIntakeTracker({ theme }) {
  const [todayWaterMl, setTodayWaterMl] = useState(0);
  const [todayWaterLogId, setTodayWaterLogId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  // Define API Base URL from environment variable, with localhost fallback for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://strong-backend-5caa.onrender.com';
  const colors = {
    background: theme === "dark" ? "#404040" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#1f2937",
    buttonBg: theme === "dark" ? "#374151" : "#e2e8f0",
    buttonHover: theme === "dark" ? "#4a5568" : "#d1d5db",
    resetButtonBg: theme === "dark" ? "#dc2626" : "#ef4444", // Red for reset
    resetButtonHover: theme === "dark" ? "#b91c1c" : "#dc2626",
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Fetch today's water log on component mount
  useEffect(() => {
    const fetchTodayWaterLog = async () => {
      setLoading(true);
      setError(null);
      setMessage("");

      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          setError("برای مشاهده مقدار آب، لطفاً وارد شوید.");
          setLoading(false);
          return;
        }

        const today = getTodayDate();
        const response = await axios.get(
          `${API_BASE_URL}/api/daily-water-logs/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const waterLogs = Array.isArray(response.data) ? response.data : response.data.results;
        const todayLog = waterLogs.find(log => log.date === today);

        if (todayLog) {
          setTodayWaterMl(todayLog.amount_ml);
          setTodayWaterLogId(todayLog.id);
        } else {
          setTodayWaterMl(0);
          setTodayWaterLogId(null);
        }

      } catch (err) {
        console.error("خطا در دریافت اطلاعات آب روزانه:", err);
        setError("خطا در دریافت اطلاعات آب: " + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchTodayWaterLog();
  }, []);

  // Function to send/update water log to backend
  const updateWaterLog = async (newAmountMl) => {
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("برای ثبت مقدار آب، ابتدا وارد شوید.");
      }

      const today = getTodayDate();
      let response;

      if (todayWaterLogId) {
        // Update existing record (PUT)
        response = await axios.put(
          `${API_BASE_URL}/api/daily-water-logs/${todayWaterLogId}/`,
          { amount_ml: newAmountMl, date: today },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setMessage("مقدار آب با موفقیت به‌روزرسانی شد!");
      } else {
        // Create new record (POST)
        response = await axios.post(
          `${API_BASE_URL}/api/daily-water-logs/`,
          { date: today, amount_ml: newAmountMl },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setMessage("مقدار آب با موفقیت ثبت شد!");
        setTodayWaterLogId(response.data.id);
      }
      setMessageType("success");
      setTodayWaterMl(newAmountMl);
      console.log("Water log updated/created:", response.data);

    } catch (err) {
      console.error("خطا در ثبت/به‌روزرسانی آب:", err);
      setMessage(
        "خطا در ثبت مقدار آب: " +
          (err.response?.data?.amount_ml || err.response?.data?.non_field_errors || err.response?.data?.detail || err.message)
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Handler for adding water
  const handleAddWaterClick = () => {
    const newAmount = todayWaterMl + WATER_INCREMENT_ML;
    updateWaterLog(newAmount);
  };

  // Handler for resetting water
  const handleResetWaterClick = () => {
    updateWaterLog(0); // Reset to 0ml
  };

  // Calculate number of bottles to display
  const numberOfBottles = Math.min(
    MAX_BOTTLE_IMAGES,
    Math.floor(todayWaterMl / WATER_INCREMENT_ML)
  );

  // Convert milliliters to liters for display
  const displayAmountLiters = (todayWaterMl / 1000).toFixed(2);

  if (loading) {
    return (
      <div className="text-center p-4" style={{ color: colors.text }}>
        در حال بارگذاری مقدار آب...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div
      className="w-full p-4 rounded-lg shadow-md mb-6"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        maxWidth: "500px",
      }}
    >
      <h3 className="text-center text-lg font-semibold mb-4">
        امروز چقدر آب نوشیدی؟
      </h3>
      <p className="text-center text-2xl font-bold mb-4">
        {displayAmountLiters} لیتر
      </p>

      {/* نمایش ایمیج‌های بطری آب */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {Array.from({ length: numberOfBottles }).map((_, i) => (
          <span key={i} className="text-4xl"><img src={water_bottle} alt="water_bottle"  className="w-12 h-12 sm:w-16 sm:h-16"/></span> // ایموجی بطری آب
        ))}
      </div>

      <div className="flex space-x-4 mb-4">
        {/* دکمه اضافه کردن آب */}
        <button
          className={`text-2xl px-4 rounded-full transition-all duration-200 
            ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-75"}
          `}
          style={{ backgroundColor: colors.buttonBg, color: colors.text }}
          onClick={handleAddWaterClick}
          disabled={loading}
          aria-label="Add 250ml water"
        >
          +
        </button>

        {/* دکمه صفر کردن مقدار آب */}
        <button
          className={`text-xl px-4  rounded-full transition-all duration-200 font-semibold
            ${loading ? "opacity-50 cursor-not-allowed" : `hover:bg-opacity-75 ${colors.resetButtonHover}`}
          `}
          style={{ backgroundColor: colors.resetButtonBg, color: "white" }}
          onClick={handleResetWaterClick}
          disabled={loading}
          aria-label="Reset water intake"
        >
          ↻
        </button>
      </div>
      
      <p className="text-center text-sm mt-2" style={{ color: colors.text }}>
        هر کلیک: {WATER_INCREMENT_ML} میلی‌لیتر
      </p>

      {message && (
        <p
          className={`text-center text-sm mt-4 ${
            messageType === "success" ? "text-green-500" :
            messageType === "error" ? "text-red-500" : "text-blue-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default WaterIntakeTracker;
