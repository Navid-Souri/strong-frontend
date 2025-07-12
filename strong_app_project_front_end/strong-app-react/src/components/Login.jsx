import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.access) {
        setSuccess("ورود موفقیت آمیز بود!");
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        // Redirect based on user role (assuming data.role is returned by your backend)
        // این قسمت با MyTokenObtainPairSerializer شما که role و user_position را برمی‌گرداند، کار می‌کند.
        if (data.role === "coach" || data.user_position === "coach") {
          // هر دو حالت را چک می‌کنیم
          navigate("/Couch_Home"); // Redirect to coach homepage
        } else {
          navigate("/User_Home"); // Redirect to user homepage (default for 'user' role)
        }
      } else {
        setError(data?.detail || "نام کاربری یا رمز عبور اشتباه است");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" w-full max-w-[95%] sm:max-w-[600px] md:max-w-[600px] lg:max-w-[600px]
    mx-auto mt-44 lg:mt-64 px-4 py-6 
    rounded-lg shadow-2xl 
    dark:text-white dark:shadow-gray-700 
    transition-all"
    >
      <h2 className="text-2xl font-bold mb-12 text-center text-gray-800 dark:text-gray-200">
        ورود به حساب
      </h2>

      <input
        name="username"
        placeholder="نام کاربری"
        value={form.username}
        onChange={handleChange}
        className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white transition-all"
        required
      />

      <input
        name="password"
        type="password"
        placeholder="رمز عبور"
        value={form.password}
        onChange={handleChange}
        className="mb-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white transition-all"
        required
      />

      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
      {success && <div className="text-green-500 text-sm mb-3">{success}</div>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
      >
        ورود
      </button>

      <Link
        to="/signup"
        className="block text-center mt-8 text-blue-500 hover:underline dark:text-blue-400 text-sm"
      >
        هنوز ثبت‌نام نکرده‌اید؟ کلیک کنید
      </Link>
    </form>
  );
}
