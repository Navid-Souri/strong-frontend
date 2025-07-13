import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateSetForm({ theme, workoutSessionId, onClose, onSetCreated }) {
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    exercise: "",
    set_number: "",
    reps: "",
    weight_kg: "",
    distance_km: "",
    time_seconds: "",
    rpe: "",
    rest_seconds: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  // Define API Base URL from environment variable, with localhost fallback for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const colors = {
    background: theme === "dark" ? "#2d3748" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#1f2937",
    inputBg: theme === "dark" ? "#4a5568" : "#f3f4f6",
    inputBorder: theme === "dark" ? "#636363" : "#d1d5db",
    buttonBg: theme === "dark" ? "#10b981" : "#059669",
    buttonHover: theme === "dark" ? "#047857" : "#065f46",
    cancelButtonBg: theme === "dark" ? "#dc2626" : "#ef4444",
  };

  // Fetch exercises list for the dropdown
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          throw new Error("برای دریافت لیست تمرینات، لطفاً وارد شوید.");
        }
        const response = await axios.get(`${API_BASE_URL}/api/exercises/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setExercises(Array.isArray(response.data) ? response.data : response.data.results || []);
      } catch (err) {
        console.error("Error fetching exercises:", err);
        setError("خطا در دریافت لیست تمرینات.");
      }
    };
    fetchExercises();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Basic validation
    if (!formData.exercise || !formData.set_number) {
      setError("لطفاً تمرین و شماره ست را وارد کنید.");
      setLoading(false);
      return;
    }

    if (!workoutSessionId) {
      setError("لطفاً یک جلسه تمرینی را انتخاب کنید.");
      setLoading(false);
      return;
    }

    // Prepare payload, converting empty strings to null for optional fields
    const payload = {
      workout_session: workoutSessionId,
      exercise: parseInt(formData.exercise), // Exercise ID
      set_number: parseInt(formData.set_number),
      reps: formData.reps ? parseInt(formData.reps) : null,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      distance_km: formData.distance_km ? parseFloat(formData.distance_km) : null,
      time_seconds: formData.time_seconds ? parseInt(formData.time_seconds) : null,
      rpe: formData.rpe ? parseInt(formData.rpe) : null,
      rest_seconds: formData.rest_seconds ? parseInt(formData.rest_seconds) : null,
      notes: formData.notes || "",
    };

    try {
      const accessToken = localStorage.getItem("access");
      const response = await axios.post("http://localhost:8000/api/sets/", payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSuccessMessage("ست با موفقیت ایجاد شد!");
      console.log("Set created:", response.data);
      onSetCreated(); // Notify parent to refresh table and close modal
    } catch (err) {
      console.error("Error creating set:", err.response?.data || err.message);
      setError(
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.exercise?.[0] ||
        err.response?.data?.set_number?.[0] ||
        err.response?.data?.detail ||
        "خطا در ایجاد ست: " + (err.message || "نامشخص")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="relative p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        <h2 className="text-xl font-bold text-center mb-4">ایجاد ست جدید</h2>
        <p className="text-sm text-center mb-4">
          برای جلسه: {workoutSessionId ? `ID ${workoutSessionId}` : "انتخاب نشده"}
        </p>

        {loading && <p className="text-center text-sm mb-2">در حال ارسال...</p>}
        {error && <p className="text-center text-red-500 text-sm mb-2">{error}</p>}
        {successMessage && <p className="text-center text-green-500 text-sm mb-2">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="exercise" className="block text-sm font-medium mb-1">
              تمرین:
            </label>
            <select
              id="exercise"
              name="exercise"
              value={formData.exercise}
              onChange={handleChange}
              required
              className="w-full p-2 rounded border"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              disabled={loading}
            >
              <option value="">انتخاب تمرین</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="set_number" className="block text-sm font-medium mb-1">
              شماره ست:
            </label>
            <input
              type="number"
              id="set_number"
              name="set_number"
              value={formData.set_number}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-2 rounded border"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              disabled={loading}
            />
          </div>

          {/* Optional fields */}
          <div>
            <label htmlFor="reps" className="block text-sm font-medium mb-1">
              تعداد تکرار:
            </label>
            <input
              type="number"
              id="reps"
              name="reps"
              value={formData.reps}
              onChange={handleChange}
              min="0"
              className="w-full p-2 rounded border"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="weight_kg" className="block text-sm font-medium mb-1">
              وزن (کیلوگرم):
            </label>
            <input
              type="number"
              id="weight_kg"
              name="weight_kg"
              value={formData.weight_kg}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full p-2 rounded border"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="distance_km" className="block text-sm font-medium mb-1">
              مسافت (کیلومتر):
            </label>
            <input
              type="number"
              id="distance_km"
              name="distance_km"
              value={formData.distance_km}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full p-2 rounded border"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="time_seconds" className="block text-sm font-medium mb-1">
              زمان (ثانیه):
            </label>
            <input
              type="number"
              id="time_seconds"
              name="time_seconds"
              value={formData.time_seconds}
              onChange={handleChange}
              min="0"
              className="w-full p-2 rounded border"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="rpe" className="block text-sm font-medium mb-1">
              RPE (1-10):
            </label>
            <input
              type="number"
              id="rpe"
              name="rpe"
              value={formData.rpe}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full p-2 rounded border"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="rest_seconds" className="block text-sm font-medium mb-1">
              زمان استراحت (ثانیه):
            </label>
            <input
              type="number"
              id="rest_seconds"
              name="rest_seconds"
              value={formData.rest_seconds}
              onChange={handleChange}
              min="0"
              className="w-full p-2 rounded border"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              یادداشت‌ها:
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 rounded border"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              disabled={loading}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-md font-semibold transition-colors duration-200"
              style={{ backgroundColor: colors.cancelButtonBg, color: "white" }}
              disabled={loading}
            >
              لغو
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-md font-semibold transition-colors duration-200"
              style={{ backgroundColor: colors.buttonBg, color: "white" }}
              disabled={loading}
            >
              ایجاد ست
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSetForm;
