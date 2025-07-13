import React, { useState } from "react";
import axios from "axios";

function CreateExerciseForm({ theme, onClose, onExerciseCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    video_url: "",
    is_cardio: false,
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!formData.name) {
      setError("لطفاً نام تمرین را وارد کنید.");
      setLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("access");
      const response = await axios.post(
        `${API_BASE_URL}/api/exercises/`, // URL for ExerciseViewSet
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSuccessMessage("تمرین با موفقیت ایجاد شد!");
      console.log("Exercise created:", response.data);
      onExerciseCreated(); // Notify parent
    } catch (err) {
      console.error("Error creating exercise:", err.response?.data || err.message);
      setError(
        err.response?.data?.name?.[0] || // Specific error for name field
        err.response?.data?.detail ||
        "خطا در ایجاد تمرین: " + (err.message || "نامشخص")
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
        <h2 className="text-xl font-bold text-center mb-4">ایجاد تمرین جدید</h2>

        {loading && <p className="text-center text-sm mb-2">در حال ارسال...</p>}
        {error && <p className="text-center text-red-500 text-sm mb-2">{error}</p>}
        {successMessage && <p className="text-center text-green-500 text-sm mb-2">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              نام تمرین:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 rounded border"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              توضیحات:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 rounded border"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              disabled={loading}
            ></textarea>
          </div>

          <div>
            <label htmlFor="video_url" className="block text-sm font-medium mb-1">
              لینک ویدئو:
            </label>
            <input
              type="url"
              id="video_url"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              className="w-full p-2 rounded border"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              disabled={loading}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_cardio"
              name="is_cardio"
              checked={formData.is_cardio}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder }}
              disabled={loading}
            />
            <label htmlFor="is_cardio" className="ml-2 block text-sm font-medium">
              آیا کاردیو است؟
            </label>
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
              ایجاد تمرین
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateExerciseForm;
