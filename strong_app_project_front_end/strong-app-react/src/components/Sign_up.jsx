import React, { useState } from "react";
import { Link } from "react-router-dom"; // Link is already imported, good.

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    body_weight: "",
    weight_unit: "kg", // Default to kg
    height: "",
    height_unit: "cm", // Default to cm
    position: "", // Will be 'client' or 'coach'
    gender: "", // Will be 'male' or 'female'
    // Conditional fields for 'client'
    gym_experience_months: "",
    // Conditional fields for 'coach'
    expertise_resume: "",
    license: "",
    license_number: "",
    // Body Measurements (optional initially, but can be made required)
    neck_size: "",
    shoulder_size: "",
    arm_r_biceps_size: "",
    arm_r_triceps_size: "",
    arm_l_biceps_size: "",
    arm_l_triceps_size: "",
    chest_size: "",
    waist_size: "",
    abdomen_size: "",
    hip_size: "",
    thigh_r_size: "", // Right thigh
    thigh_l_size: "", // Left thigh
    calves_r_size: "", // Right calves
    calves_l_size: "", // Left calves
    // Conditional field for 'female' gender
    under_chest_size: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleGenderSelect = (selectedGender) => {
    setForm({ ...form, gender: selectedGender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Prepare data for submission, removing empty strings for optional fields
    // This is important for fields that are conditionally required by the backend
    const dataToSend = { ...form };
    for (const key in dataToSend) {
      if (dataToSend[key] === "") {
        delete dataToSend[key];
      }
    }

    try {
      const res = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend), // Send all form data
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("ثبت نام با موفقیت انجام شد! لطفاً وارد شوید.");
        // Clear form after successful submission
        setForm({
          username: "",
          email: "",
          password: "",
          password2: "",
          first_name: "",
          last_name: "",
          phone_number: "",
          body_weight: "",
          weight_unit: "kg",
          height: "",
          height_unit: "cm",
          position: "",
          gender: "",
          gym_experience_months: "",
          expertise_resume: "",
          license: "",
          license_number: "",
          neck_size: "",
          shoulder_size: "",
          arm_r_biceps_size: "",
          arm_r_triceps_size: "",
          arm_l_biceps_size: "",
          arm_l_triceps_size: "",
          chest_size: "",
          waist_size: "",
          abdomen_size: "",
          hip_size: "",
          thigh_r_size: "",
          thigh_l_size: "",
          calves_r_size: "",
          calves_l_size: "",
          under_chest_size: "",
        });
      } else {
        // Display specific errors from backend if available
        let errorMessage = "خطا در ثبت نام";
        if (data) {
          if (data.password) errorMessage = data.password;
          else if (data.username) errorMessage = data.username;
          else if (data.email) errorMessage = data.email;
          // Add more specific error messages for new fields
          else if (data.phone_number) errorMessage = data.phone_number;
          else if (data.body_weight) errorMessage = data.body_weight;
          else if (data.height) errorMessage = data.height;
          else if (data.position) errorMessage = data.position;
          else if (data.gender) errorMessage = data.gender;
          else if (data.gym_experience_months)
            errorMessage = data.gym_experience_months;
          else if (data.expertise_resume) errorMessage = data.expertise_resume;
          else if (data.license) errorMessage = data.license;
          else if (data.license_number) errorMessage = data.license_number;
          else if (data.under_chest_size) errorMessage = data.under_chest_size;
          // You can add more specific error handling for other measurement fields
          // A good practice is to iterate through data.errors if it's a dict
          else if (typeof data === "object") {
            errorMessage =
              Object.values(data).flat().join(", ") || errorMessage;
          }
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      console.error(err); // Log the actual error for debugging
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" w-full max-w-[95%] sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1100px]
    mx-auto mt-44 lg:mt-64 px-4 py-6 
    rounded-lg shadow-2xl 
    dark:text-white dark:shadow-gray-700 
    transition-all"
    >
      <h2 className="text-2xl mb-12 font-bold text-center text-gray-800 dark:text-gray-200">
        ثبت نام کاربر جدید
      </h2>

      {error && (
        <div className="text-red-500 mb-4 p-2 bg-red-100 border border-red-400 rounded text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600 mb-4 p-2 bg-green-100 border border-green-400 rounded text-center">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Basic User Info */}
        <input
          name="username"
          placeholder="نام کاربری"
          value={form.username}
          onChange={handleChange}
          className="input-field dark:bg-slate-800"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="ایمیل"
          value={form.email}
          onChange={handleChange}
          className="input-field dark:bg-slate-800"
          required
        />
        <input
          name="first_name"
          placeholder="نام"
          value={form.first_name}
          onChange={handleChange}
          className="input-field dark:bg-slate-800"
          required
        />
        <input
          name="last_name"
          placeholder="نام خانوادگی"
          value={form.last_name}
          onChange={handleChange}
          className="input-field dark:bg-slate-800"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="رمز عبور"
          value={form.password}
          onChange={handleChange}
          className="input-field dark:bg-slate-800"
          required
        />
        <input
          name="password2"
          type="password"
          placeholder="تکرار رمز عبور"
          value={form.password2}
          onChange={handleChange}
          className="input-field dark:bg-slate-800"
          required
        />
        <input
          name="phone_number"
          placeholder="شماره تلفن (اختیاری)"
          value={form.phone_number}
          onChange={handleChange}
          className="input-field dark:bg-slate-800"
        />
      </div>

      {/* Weight Input */}
      <div className="mt-6 p-4 ">
        <label className="block text-gray-700 text-sm font-bold mb-2  dark:text-gray-200">
          : وزن بدن
        </label>
        <div className="flex items-center gap-2">
          <input
            name="body_weight"
            type="number"
            placeholder="وزن (مثلاً 70)"
            value={form.body_weight}
            onChange={handleChange}
            className="input-field flex-grow dark:bg-slate-800"
            step="0.1"
            required
          />
          <select
            name="weight_unit"
            value={form.weight_unit}
            onChange={handleChange}
            className="select-field dark:bg-slate-800"
            required
          >
            <option value="kg">کیلوگرم (kg)</option>
            <option value="lbs">پوند (lbs)</option>
          </select>
        </div>
      </div>

      {/* Height Input */}
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-200">
          : قد
        </label>
        <div className="flex items-center gap-2">
          <input
            name="height"
            type="number"
            placeholder="قد (مثلاً 175)"
            value={form.height}
            onChange={handleChange}
            className="input-field flex-grow dark:bg-slate-800"
            step="0.1"
            required
          />
          <select
            name="height_unit"
            value={form.height_unit}
            onChange={handleChange}
            className="select-field dark:bg-slate-800"
            required
          >
            <option value="cm">سانتی‌متر (cm)</option>
            <option value="inch">اینچ (inch)</option>
          </select>
        </div>
      </div>

      {/* Position Selection */}
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2  dark:text-gray-200">
          : نقش شما
        </label>
        <select
          name="position"
          value={form.position}
          onChange={handleChange}
          className="select-field w-full dark:bg-slate-800"
          required
        >
          <option value="">انتخاب کنید</option>
          <option value="client">ورزشکار/مشتری</option>
          <option value="coach">مربی</option>
        </select>
      </div>

      {/* Conditional fields based on Position */}
      {form.position === "client" && (
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2  dark:text-gray-200">
            :سابقه باشگاه (ماه)
          </label>
          <input
            name="gym_experience_months"
            type="number"
            placeholder="مثلاً 12 ماه"
            value={form.gym_experience_months}
            onChange={handleChange}
            className="input-field w-full  dark:bg-slate-800"
            required
          />
        </div>
      )}

      {form.position === "coach" && (
        <div className="mt-4 space-y-4">
          <label className="block text-gray-700 text-sm font-bold mb-2  dark:text-gray-200">
            : اطلاعات مربیگری
          </label>
          <textarea
            name="expertise_resume"
            placeholder="خلاصه تخصص و سابقه"
            value={form.expertise_resume}
            onChange={handleChange}
            className="input-field w-full h-24  dark:bg-slate-800"
            required
          ></textarea>
          <input
            name="license"
            placeholder="مجوز/گواهی‌نامه"
            value={form.license}
            onChange={handleChange}
            className="input-field w-full  dark:bg-slate-800"
            required
          />
          <input
            name="license_number"
            placeholder="شماره مجوز"
            value={form.license_number}
            onChange={handleChange}
            className="input-field w-full  dark:bg-slate-800"
            required
          />
        </div>
      )}

      {/* Gender Selection */}
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2 ">
          : جنسیت
        </label>
        <div className="flex justify-center ">
          <button
            type="button"
            onClick={() => handleGenderSelect("male")}
            className={`flex items-center justify-center p-3 rounded-s-3xl text-2xl border-2 ${
              form.gender === "male"
                ? "bg-blue-500 text-white border-blue-700"
                : "bg-gray-200 text-gray-700 border-gray-400"
            } hover:bg-blue-400 hover:text-white transition-colors duration-200`}
          >
            <span role="img" aria-label="Male symbol">
              ♂️
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleGenderSelect("female")}
            className={`flex items-center justify-center p-3 rounded-e-3xl text-2xl border-2 ${
              form.gender === "female"
                ? "bg-pink-500 text-white border-pink-700"
                : "bg-gray-200 text-gray-700 border-gray-400"
            } hover:bg-pink-400 hover:text-white transition-colors duration-200`}
          >
            <span role="img" aria-label="Female symbol">
              ♀️
            </span>
          </button>
        </div>
        {form.gender === "" && (
          <p className="text-red-500 text-xs mt-2 text-center">
            انتخاب جنسیت الزامی است.
          </p>
        )}
      </div>

      {/* Body Measurements */}
      {form.gender && ( // Only show measurements if gender is selected
        <div className="mt-6 p-4 ">
          <h3 className="text-lg font-bold mb-4 text-gray-700  dark:text-gray-200">
            <h1 className=" text-2xl">اختیاری</h1>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="neck_size"
              type="number"
              placeholder="دور گردن"
              value={form.neck_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            <input
              name="shoulder_size"
              type="number"
              placeholder="دور شانه"
              value={form.shoulder_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            <input
              name="arm_r_biceps_size"
              type="number"
              placeholder="دور بازوی راست (بایسپس)"
              value={form.arm_r_biceps_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            <input
              name="arm_r_triceps_size"
              type="number"
              placeholder="دور بازوی راست (ترایسپس)"
              value={form.arm_r_triceps_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            <input
              name="arm_l_biceps_size"
              type="number"
              placeholder="دور بازوی چپ (بایسپس)"
              value={form.arm_l_biceps_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            <input
              name="arm_l_triceps_size"
              type="number"
              placeholder="دور بازوی چپ (ترایسپس)"
              value={form.arm_l_triceps_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            <input
              name="chest_size"
              type="number"
              placeholder="دور سینه"
              value={form.chest_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            {form.gender === "female" && (
              <input
                name="under_chest_size"
                type="number"
                placeholder="دور زیر سینه"
                value={form.under_chest_size}
                onChange={handleChange}
                className="input-field  dark:bg-slate-800"
                step="0.1"
                required
              />
            )}
            <input
              name="waist_size"
              type="number"
              placeholder="دور کمر"
              value={form.waist_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            <input
              name="abdomen_size"
              type="number"
              placeholder="دور شکم"
              value={form.abdomen_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            <input
              name="hip_size"
              type="number"
              placeholder="دور باسن"
              value={form.hip_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            <input
              name="thigh_r_size"
              type="number"
              placeholder="دور ران راست"
              value={form.thigh_r_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            <input
              name="thigh_l_size"
              type="number"
              placeholder="دور ران چپ"
              value={form.thigh_l_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            <input
              name="calves_r_size"
              type="number"
              placeholder="دور ساق پای راست"
              value={form.calves_r_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
            <input
              name="calves_l_size"
              type="number"
              placeholder="دور ساق پای چپ"
              value={form.calves_l_size}
              onChange={handleChange}
              className="input-field  dark:bg-slate-800"
              step="0.1"
              required={form.gender !== ""}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold mt-6 transition-all"
      >
        ثبت نام
      </button>

      <Link
        to="/login"
        className="block text-center mt-4 text-blue-600 hover:underline dark:text-blue-400"
      >
        قبلاً ثبت‌نام کرده‌اید؟ اینجا کلیک کنید
      </Link>
    </form>
  );
}
