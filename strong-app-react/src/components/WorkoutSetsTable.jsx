import React, { useState, useEffect } from "react";
import axios from "axios";

// Helper components for better readability (defined outside the main component)
const TableHeader = ({ children, className = "" }) => (
  <th
    scope="col"
    className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider ${className}`}
  >
    {children}
  </th>
);

const TableCell = ({ children, className = "" }) => (
  <td className={`px-4 py-4 text-sm ${className}`}>
    {children}
  </td>
);
// Define API Base URL from environment variable, with localhost fallback for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://strong-backend-5caa.onrender.com';
const EditableInput = ({ value, onChange, type, min, step, colors, disabled }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    min={min}
    step={step}
    disabled={disabled}
    className="w-20 p-1 rounded border"
    style={{
      backgroundColor: colors.inputBg,
      borderColor: colors.inputBorder,
      color: colors.text,
    }}
  />
);

const ActionButton = ({ children, onClick, color, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="text-white font-bold py-1 px-2 rounded-md text-xs whitespace-nowrap"
    style={{ backgroundColor: color, opacity: disabled ? 0.5 : 1 }}
  >
    {children}
  </button>
);


function WorkoutSetsTable({ theme, workoutSessionId, refreshTrigger }) { // refreshTrigger به props اضافه شد
  const [setsData, setSetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSetId, setEditingSetId] = useState(null);
  const [editedValues, setEditedValues] = useState({
    reps: "",
    weight_kg: "",
  });

  const colors = {
    background: theme === "dark" ? "#404040" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#1f2937",
    headerBg: theme === "dark" ? "#262626" : "#e2e8f0",
    rowBgEven: theme === "dark" ? "#404040" : "#f7fafc",
    rowBgOdd: theme === "dark" ? "#525252" : "#ffffff",
    borderColor: theme === "dark" ? "#111111" : "#e2e8f0",
    editButton: theme === "dark" ? "#2563eb" : "#3b82f6",
    saveButton: theme === "dark" ? "#16a34a" : "#22c55e",
    cancelButton: theme === "dark" ? "#dc2626" : "#ef4444",
    inputBg: theme === "dark" ? "#525252" : "#f3f4f6",
    inputBorder: theme === "dark" ? "#636363" : "#d1d5db",
  };

  useEffect(() => {
    const fetchSetsData = async () => {
      setLoading(true);
      setError(null);

      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          throw new Error("برای مشاهده ست‌های تمرینی، لطفاً وارد شوید.");
        }

        let apiUrl = `${API_BASE_URL}/api/sets/`;
        if (workoutSessionId) {
          apiUrl += `?session_id=${workoutSessionId}`;
        }

        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const dataToSort = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        const sortedData = dataToSort.sort((a, b) => {
          const dateA = new Date(a.workout_session?.date || 0);
          const dateB = new Date(b.workout_session?.date || 0);
          return dateB - dateA || b.set_number - a.set_number;
        });

        setSetsData(sortedData);
      } catch (err) {
        console.error("Error fetching workout sets:", err);
        setError(
          err.response?.data?.detail || 
          err.message || 
          "خطا در دریافت اطلاعات ست‌های تمرینی"
        );
      } finally {
        setLoading(false);
      }
    };

    if (workoutSessionId !== undefined) {
      fetchSetsData();
    }
  }, [workoutSessionId, refreshTrigger]); // refreshTrigger به dependencies اضافه شد

  const formatDate = (dateString) => {
    if (!dateString) return "نامشخص";
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEditClick = (setEntry) => {
    setEditingSetId(setEntry.id);
    setEditedValues({
      reps: setEntry.reps?.toString() || "",
      weight_kg: setEntry.weight_kg?.toString() || "",
    });
  };

  const handleInputChange = (field, value) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (setId) => {
    if (!editedValues.reps && !editedValues.weight_kg) {
      setError("لطفاً حداقل یکی از فیلدها را پر کنید");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("برای ویرایش ست، لطفاً وارد شوید.");
      }

      const payload = {
        reps: editedValues.reps ? parseInt(editedValues.reps) : null,
        weight_kg: editedValues.weight_kg ? parseFloat(editedValues.weight_kg) : null,
      };

      const response = await axios.patch(
        `${API_BASE_URL}/api/sets/${setId}/`,
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setSetsData(prev => 
        prev.map(set => set.id === setId ? response.data : set)
      );
      setEditingSetId(null);
    } catch (err) {
      console.error("Error saving set:", err);
      setError(
        err.response?.data?.reps?.[0] ||
        err.response?.data?.weight_kg?.[0] ||
        err.response?.data?.non_field_errors ||
        err.response?.data?.detail ||
        "خطا در ذخیره تغییرات"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingSetId(null);
    setEditedValues({ reps: "", weight_kg: "" });
    setError(null);
  };

  if (loading && !editingSetId) {
    return (
      <div className="text-center p-4" style={{ color: colors.text }}>
        در حال بارگذاری اطلاعات ست‌های تمرینی...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        {error}
        <button 
          onClick={() => setError(null)}
          className="block mx-auto mt-2 text-sm underline"
        >
          بستن
        </button>
      </div>
    );
  }

  if (setsData.length === 0) {
    return (
      <div className="text-center p-4" style={{ color: colors.text }}>
        هنوز هیچ ستی ثبت نشده است.
      </div>
    );
  }

  return (
    <div
      className="w-full p-4 rounded-lg shadow-md mb-6 overflow-x-auto"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        maxWidth: "1200px",
      }}
    >
      <h2 className="text-center text-lg font-semibold mb-4">برنامه تمرینی</h2>
      
      {loading && editingSetId && (
        <p className="text-center mb-2 text-sm" style={{ color: colors.text }}>
          در حال ذخیره تغییرات...
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y" dir="rtl">
          <thead style={{ backgroundColor: colors.headerBg }}>
            <tr>
              <TableHeader>تاریخ جلسه</TableHeader>
              <TableHeader>تمرین</TableHeader>
              <TableHeader>ست</TableHeader>
              <TableHeader>تکرار</TableHeader>
              <TableHeader>وزن (کیلوگرم)</TableHeader>
              <TableHeader>مسافت (کیلومتر)</TableHeader>
              <TableHeader>زمان (ثانیه)</TableHeader>
              <TableHeader>RPE</TableHeader>
              <TableHeader>بار کل (کیلوگرم)</TableHeader>
              <TableHeader>یادداشت‌ها</TableHeader>
              <TableHeader className="rounded-tr-lg">عملیات</TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: colors.borderColor }}>
            {setsData.map((set, index) => (
              <tr
                key={set.id || index}
                style={{
                  backgroundColor: index % 2 === 0 ? colors.rowBgEven : colors.rowBgOdd,
                }}
              >
                <TableCell>{formatDate(set.workout_session?.date)}</TableCell>
                <TableCell>{set.exercise_name || "نامشخص"}</TableCell>
                <TableCell>{set.set_number || "-"}</TableCell>
                
                <TableCell>
                  {editingSetId === set.id ? (
                    <EditableInput
                      value={editedValues.reps}
                      onChange={(val) => handleInputChange("reps", val)}
                      type="number"
                      min="0"
                      colors={colors}
                      disabled={loading}
                    />
                  ) : (
                    set.reps || "-"
                  )}
                </TableCell>
                
                <TableCell>
                  {editingSetId === set.id ? (
                    <EditableInput
                      value={editedValues.weight_kg}
                      onChange={(val) => handleInputChange("weight_kg", val)}
                      type="number"
                      step="0.01"
                      min="0"
                      colors={colors}
                      disabled={loading}
                    />
                  ) : (
                    set.weight_kg !== null ? `${set.weight_kg} kg` : "-"
                  )}
                </TableCell>
                
                <TableCell>
                  {set.distance_km !== null ? `${set.distance_km} km` : "-"}
                </TableCell>
                
                <TableCell>
                  {set.time_seconds !== null ? `${set.time_seconds} s` : "-"}
                </TableCell>
                
                <TableCell>{set.rpe || "-"}</TableCell>
                
                <TableCell>
                  {set.load_kg !== null ? `${set.load_kg} kg` : "-"}
                </TableCell>
                
                <TableCell>{set.notes || "-"}</TableCell>
                
                <TableCell className="whitespace-nowrap">
                  {editingSetId === set.id ? (
                    <div className="flex gap-2">
                      <ActionButton
                        onClick={() => handleSave(set.id)}
                        color={colors.saveButton}
                        disabled={loading}
                      >
                        ذخیره
                      </ActionButton>
                      <ActionButton
                        onClick={handleCancel}
                        color={colors.cancelButton}
                        disabled={loading}
                      >
                        لغو
                      </ActionButton>
                    </div>
                  ) : (
                    <ActionButton
                      onClick={() => handleEditClick(set)}
                      color={colors.editButton}
                      disabled={loading}
                    >
                      ویرایش
                    </ActionButton>
                  )}
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkoutSetsTable;
