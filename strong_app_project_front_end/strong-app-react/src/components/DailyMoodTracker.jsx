import React, { useState, useEffect } from "react";
import axios from "axios";

function DailyMoodTracker({ theme }) {
  const [selectedScore, setSelectedScore] = useState(null); // 1-5
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  // تم رنگی بر اساس props theme
  const colors = {
    background: theme === "dark" ? "#404040" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#1f2937",
    buttonHover: theme === "dark" ? "#374151" : "#f0f0f0",
    selectedBorder: theme === "dark" ? "#6366f1" : "#4f46e5",
  };

  // Emoji representations for each score
  const moodEmojis = {
    1: "😭", // Very bad
    2: "😞", // Bad
    3: "😐", // Neutral
    4: "🙂", // Good
    5: "😊"  // Very good
  };

  // تابعی برای ارسال حال و هوا به بک‌اند
  const sendMoodToBackend = async (score) => {
    setLoading(true);
    setMessage(""); // پاک کردن پیام قبلی
    setMessageType("");

    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("برای ثبت حال و هوا، ابتدا وارد شوید.");
      }

      const today = new Date().toISOString().split('T')[0]; // فرمت تاریخ YYYY-MM-DD
      
      // First check if mood exists for today
      const existingResponse = await axios.get(
        `http://localhost:8000/api/daily-moods/?date=${today}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (existingResponse.data.results?.length > 0) {
        // Update existing mood
        const existingId = existingResponse.data.results[0].id;
        await axios.patch(
          `http://localhost:8000/api/daily-moods/${existingId}/`,
          { mood_score: score },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } else {
        // Create new mood
        await axios.post(
          "http://localhost:8000/api/daily-moods/",
          { mood_score: score, date: today },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }

      setMessage("حال و هوای شما با موفقیت ثبت شد!");
      setMessageType("success");
      setSelectedScore(score);
    } catch (err) {
      console.error("Error saving mood:", err);
      setMessage(
        "خطا در ثبت حال و هوا: " +
          (err.response?.data?.mood_score?.[0] || 
           err.response?.data?.date?.[0] || 
           err.response?.data?.detail || 
           err.message)
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // هندلر کلیک روی امتیاز
  const handleScoreClick = (score) => {
    if (selectedScore === score) {
      // اگر روی امتیاز انتخاب شده کلیک شد، آن را لغو انتخاب کن
      setSelectedScore(null);
      setMessage("انتخاب لغو شد.");
      setMessageType("info");
    } else {
      setSelectedScore(score);
      sendMoodToBackend(score);
    }
  };

  // بارگذاری حال و هوای امروز هنگام مونتاژ کامپوننت
  useEffect(() => {
    const fetchTodayMood = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) return;

        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get(
          `http://localhost:8000/api/daily-moods/?date=${today}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (response.data.results?.length > 0) {
          setSelectedScore(response.data.results[0].mood_score);
        }
      } catch (err) {
        console.error("Error fetching today's mood:", err);
      }
    };

    fetchTodayMood();
  }, []);

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
        حال و هوای امروزت چطوره؟
      </h3>
      
      <div className="flex justify-between items-center mb-4">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            className={`text-2xl sm:text-3xl p-1 sm:p-2 rounded-full transition-all duration-200
              ${selectedScore === score ? `border-4 ${colors.selectedBorder}` : "border-4 border-transparent"}
              hover:bg-opacity-75 ${colors.buttonHover}
              ${loading && selectedScore !== score ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onClick={() => handleScoreClick(score)}
            disabled={loading && selectedScore !== score}
            aria-label={`Mood score ${score}`}
          >
            {moodEmojis[score]}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-xs mb-4">
        <span>بد</span>
        <span>عالی</span>
      </div>

      {loading && (
        <p className="text-center text-sm" style={{ color: colors.text }}>
          در حال ثبت...
        </p>
      )}
      {message && (
        <p
          className={`text-center text-sm ${
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

export default DailyMoodTracker;