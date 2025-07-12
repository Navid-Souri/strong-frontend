import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateWorkoutPlanForm({ theme, onClose, onPlanCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_public: false,
  });
  const [exercises, setExercises] = useState([]); // List of all available exercises
  const [planExercises, setPlanExercises] = useState([]); // Exercises to be added to this plan
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const colors = {
    background: theme === "dark" ? "#2d3748" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#1f2937",
    inputBg: theme === "dark" ? "#4a5568" : "#f3f4f6",
    inputBorder: theme === "dark" ? "#636363" : "#d1d5db",
    buttonBg: theme === "dark" ? "#10b981" : "#059669",
    buttonHover: theme === "dark" ? "#047857" : "#065f46",
    cancelButtonBg: theme === "dark" ? "#dc2626" : "#ef4444",
  };

  // Fetch all exercises on component mount to populate dropdowns
  useEffect(() => {
    const fetchAllExercises = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          throw new Error("Please log in to fetch exercises.");
        }
        const response = await axios.get("http://localhost:8000/api/exercises/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setExercises(Array.isArray(response.data) ? response.data : response.data.results || []);
      } catch (err) {
        console.error("Error fetching exercises:", err);
        setError("Error fetching exercises list.");
      }
    };
    fetchAllExercises();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddExerciseToPlan = () => {
    setPlanExercises([...planExercises, {
      exercise: "", order: "", default_sets: "", default_reps: "",
      default_weight_kg: "", default_distance_km: "", default_time_seconds: "",
      default_rpe: "", default_rest_seconds: "", default_notes: ""
    }]);
  };

  const handleRemoveExerciseFromPlan = (index) => {
    const newPlanExercises = planExercises.filter((_, i) => i !== index);
    setPlanExercises(newPlanExercises);
  };

  const handlePlanExerciseChange = (index, field, value) => {
    const newPlanExercises = [...planExercises];
    newPlanExercises[index] = { ...newPlanExercises[index], [field]: value };
    setPlanExercises(newPlanExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!formData.name) {
      setError("Please enter a workout plan name.");
      setLoading(false);
      return;
    }

    // Validate plan exercises
    for (const ex of planExercises) {
      if (!ex.exercise || !ex.order) {
        setError("Please select an exercise and enter an order for all added exercises.");
        setLoading(false);
        return;
      }
    }

    try {
      const accessToken = localStorage.getItem("access");
      const payload = {
        ...formData,
        // Map planExercises to the structure expected by exercises_details in serializer
        exercises_details: planExercises.map(ex => ({
          exercise: parseInt(ex.exercise), // Ensure exercise ID is integer
          order: parseInt(ex.order),
          default_sets: ex.default_sets ? parseInt(ex.default_sets) : null,
          default_reps: ex.default_reps ? parseInt(ex.default_reps) : null,
          default_weight_kg: ex.default_weight_kg ? parseFloat(ex.default_weight_kg) : null,
          default_distance_km: ex.default_distance_km ? parseFloat(ex.default_distance_km) : null,
          default_time_seconds: ex.default_time_seconds ? parseInt(ex.default_time_seconds) : null,
          default_rpe: ex.default_rpe ? parseInt(ex.default_rpe) : null,
          default_rest_seconds: ex.default_rest_seconds ? parseInt(ex.default_rest_seconds) : null,
          default_notes: ex.default_notes || "",
        })),
      };

      const response = await axios.post(
        "http://localhost:8000/api/workout-plans/", // URL for WorkoutPlanViewSet
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSuccessMessage("Workout plan created successfully!");
      console.log("Workout Plan created:", response.data);
      onPlanCreated(); // Notify parent
    } catch (err) {
      console.error("Error creating workout plan:", err.response?.data || err.message);
      setError(
        err.response?.data?.name?.[0] ||
        err.response?.data?.exercises_details?.[0]?.exercise?.[0] || // Specific error for nested exercise
        err.response?.data?.exercises_details?.[0]?.order?.[0] ||
        err.response?.data?.detail ||
        "Error creating workout plan: " + (err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="relative p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" // Increased max-w
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        <h2 className="text-xl font-bold text-center mb-4">Create New Workout Plan</h2>

        {loading && <p className="text-center text-sm mb-2">Submitting...</p>}
        {error && <p className="text-center text-red-500 text-sm mb-2">{error}</p>}
        {successMessage && <p className="text-center text-green-500 text-sm mb-2">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Workout Plan Basic Details */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Plan Name:
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
              Description:
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_public"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder }}
              disabled={loading}
            />
            <label htmlFor="is_public" className="ml-2 block text-sm font-medium">
              Is Public?
            </label>
          </div>

          <hr style={{ borderColor: colors.inputBorder }} className="my-6" />

          {/* Exercises for the Plan */}
          <h3 className="text-lg font-semibold mb-3">Exercises in this Plan:</h3>
          {planExercises.map((planEx, index) => (
            <div key={index} className="border p-4 rounded-lg mb-4" style={{ borderColor: colors.inputBorder }}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Exercise #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveExerciseFromPlan(index)}
                  className="py-1 px-2 rounded-md text-xs font-semibold"
                  style={{ backgroundColor: colors.cancelButtonBg, color: "white" }}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`exercise-${index}`} className="block text-sm font-medium mb-1">
                    Exercise:
                  </label>
                  <select
                    id={`exercise-${index}`}
                    name="exercise"
                    value={planEx.exercise}
                    onChange={(e) => handlePlanExerciseChange(index, e.target.name, e.target.value)}
                    required
                    className="w-full p-2 rounded border"
                    style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
                    disabled={loading}
                  >
                    <option value="">Select an exercise</option>
                    {exercises.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`order-${index}`} className="block text-sm font-medium mb-1">
                    Order:
                  </label>
                  <input
                    type="number"
                    id={`order-${index}`}
                    name="order"
                    value={planEx.order}
                    onChange={(e) => handlePlanExerciseChange(index, e.target.name, e.target.value)}
                    required
                    min="1"
                    className="w-full p-2 rounded border"
                    style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
                    disabled={loading}
                  />
                </div>
                
                {/* Default Set Details */}
                <div className="col-span-full mt-2">
                  <p className="text-sm font-medium mb-2">Default Set Details:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`default_sets-${index}`} className="block text-xs font-medium mb-1">Sets:</label>
                      <input type="number" id={`default_sets-${index}`} name="default_sets" value={planEx.default_sets} onChange={(e) => handlePlanExerciseChange(index, e.target.name, e.target.value)} min="0" className="w-full p-1 rounded border text-xs" style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }} disabled={loading} />
                    </div>
                    <div>
                      <label htmlFor={`default_reps-${index}`} className="block text-xs font-medium mb-1">Reps:</label>
                      <input type="number" id={`default_reps-${index}`} name="default_reps" value={planEx.default_reps} onChange={(e) => handlePlanExerciseChange(index, e.target.name, e.target.value)} min="0" className="w-full p-1 rounded border text-xs" style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }} disabled={loading} />
                    </div>
                    <div>
                      <label htmlFor={`default_weight_kg-${index}`} className="block text-xs font-medium mb-1">Weight (kg):</label>
                      <input type="number" step="0.01" id={`default_weight_kg-${index}`} name="default_weight_kg" value={planEx.default_weight_kg} onChange={(e) => handlePlanExerciseChange(index, e.target.name, e.target.value)} min="0" className="w-full p-1 rounded border text-xs" style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }} disabled={loading} />
                    </div>
                    <div>
                      <label htmlFor={`default_distance_km-${index}`} className="block text-xs font-medium mb-1">Distance (km):</label>
                      <input type="number" step="0.01" id={`default_distance_km-${index}`} name="default_distance_km" value={planEx.default_distance_km} onChange={(e) => handlePlanExerciseChange(index, e.target.name, e.target.value)} min="0" className="w-full p-1 rounded border text-xs" style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }} disabled={loading} />
                    </div>
                    <div>
                      <label htmlFor={`default_time_seconds-${index}`} className="block text-xs font-medium mb-1">Time (s):</label>
                      <input type="number" id={`default_time_seconds-${index}`} name="default_time_seconds" value={planEx.default_time_seconds} onChange={(e) => handlePlanExerciseChange(index, e.target.name, e.target.value)} min="0" className="w-full p-1 rounded border text-xs" style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }} disabled={loading} />
                    </div>
                    <div>
                      <label htmlFor={`default_rpe-${index}`} className="block text-xs font-medium mb-1">RPE (1-10):</label>
                      <input type="number" id={`default_rpe-${index}`} name="default_rpe" value={planEx.default_rpe} onChange={(e) => handlePlanExerciseChange(index, e.target.name, e.target.value)} min="1" max="10" className="w-full p-1 rounded border text-xs" style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }} disabled={loading} />
                    </div>
                    <div>
                      <label htmlFor={`default_rest_seconds-${index}`} className="block text-xs font-medium mb-1">Rest (s):</label>
                      <input type="number" id={`default_rest_seconds-${index}`} name="default_rest_seconds" value={planEx.default_rest_seconds} onChange={(e) => handlePlanExerciseChange(index, e.target.name, e.target.value)} min="0" className="w-full p-1 rounded border text-xs" style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }} disabled={loading} />
                    </div>
                    <div className="col-span-full">
                      <label htmlFor={`default_notes-${index}`} className="block text-xs font-medium mb-1">Notes:</label>
                      <textarea id={`default_notes-${index}`} name="default_notes" value={planEx.default_notes} onChange={(e) => handlePlanExerciseChange(index, e.target.name, e.target.value)} rows="2" className="w-full p-1 rounded border text-xs" style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }} disabled={loading}></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddExerciseToPlan}
            className="py-2 px-4 rounded-md font-semibold transition-colors duration-200 mt-2"
            style={{ backgroundColor: colors.buttonBg, color: "white" }}
            disabled={loading}
          >
            Add Exercise to Plan
          </button>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-md font-semibold transition-colors duration-200"
              style={{ backgroundColor: colors.cancelButtonBg, color: "white" }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-md font-semibold transition-colors duration-200"
              style={{ backgroundColor: colors.buttonBg, color: "white" }}
              disabled={loading}
            >
              Create Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkoutPlanForm;
