import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile({ theme, toggleTheme }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    body_weight: '',
    weight_unit: '',
    height: '',
    height_unit: '',
    gender: '',
  });
  const [message, setMessage] = useState('');

  // Color scheme based on theme
  const colors = {
    background: theme === "dark" ? "#262626" : "#f9fafb",
    text: theme === "dark" ? "#e5e7eb" : "#262626",
    cardBg: theme === "dark" ? "#404040" : "#ffffff",
    inputBg: theme === "dark" ? "#4b5563" : "#ffffff",
    inputBorder: theme === "dark" ? "#6b7280" : "#e5e7eb",
    buttonBg: theme === "dark" ? "#6366f1" : "#4f46e5",
    buttonHover: theme === "dark" ? "#4f46e5" : "#6366f1",
    cancelButtonBg: theme === "dark" ? "#ef4444" : "#dc2626",
    cancelButtonHover: theme === "dark" ? "#dc2626" : "#ef4444",
    messageSuccess: theme === "dark" ? "text-green-400" : "text-green-600",
    messageError: theme === "dark" ? "text-red-400" : "text-red-600",
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
          setError("You need to be logged in to view your profile.");
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8000/api/me/', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setUser(response.data);
        setFormData({
          username: response.data.username || '',
          email: response.data.email || '',
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          phone_number: response.data.phone_number || '',
          body_weight: response.data.body_weight || '',
          weight_unit: response.data.weight_unit || '',
          height: response.data.height || '',
          height_unit: response.data.height_unit || '',
          gender: response.data.gender || '',
        });
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.response?.data?.detail || err.message || 'Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const accessToken = localStorage.getItem('access');
      const response = await axios.patch('http://localhost:8000/api/me/', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      setUser(response.data);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage(err.response?.data?.detail || err.message || 'Failed to update profile.');
    }
  };

  const renderField = (label, name, type = 'text', options = []) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
        {label}:
      </label>
      {isEditing ? (
        type === 'select' ? (
          <select
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full p-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            style={{
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.inputBorder,
            }}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full p-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            style={{
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.inputBorder,
            }}
            required={name === 'username' || name === 'email'}
          />
        )
      ) : (
        <p className="text-base font-medium" style={{ color: colors.text }}>
          {user[name] || 'N/A'}
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4" style={{ borderColor: colors.text }}></div>
          <p style={{ color: colors.text }}>در حال بارگذاری پروفایل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="bg-red-100 border-l-4 border-red-500 p-4 max-w-md" style={{ backgroundColor: theme === 'dark' ? '#4b1d1d' : '#fef2f2' }}>
          <p className="font-bold" style={{ color: theme === 'dark' ? '#fca5a5' : '#b91c1c' }}>خطا:</p>
          <p style={{ color: theme === 'dark' ? '#fca5a5' : '#b91c1c' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: colors.background }}>
        <p style={{ color: colors.text }}>اطلاعات کاربری در دسترس نیست. لطفا وارد شوید.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 mt-32 pb-20" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Profile Card */}
          <div className="w-full md:w-2/3">
            <div className="p-6 rounded-xl shadow-md" style={{ backgroundColor: colors.cardBg }}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold" style={{ color: colors.text }}>پروفایل من</h1>
                <button
                  onClick={toggleTheme}
                  className={`
                    relative w-14 h-8 rounded-full transition-colors duration-300
                    ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}
                  `}
                  title="تغییر تم"
                >
                  <span
                    className={`
                      absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md
                      transform transition-transform duration-300
                      ${theme === "dark" ? "translate-x-6" : "translate-x-0"}
                    `}
                  />
                </button>
              </div>

              {message && (
                <div className={`mb-4 p-3 rounded-md ${message.includes('successfully') ? 'bg-green-100' : 'bg-red-100'}`}>
                  <p className={message.includes('successfully') ? colors.messageSuccess : colors.messageError}>
                    {message}
                  </p>
                </div>
              )}

              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderField('نام کاربری', 'username')}
                  {renderField('ایمیل', 'email')}
                  {renderField('نام', 'first_name')}
                  {renderField('نام خانوادگی', 'last_name')}
                  {renderField('شماره تلفن', 'phone_number')}
                  {renderField('وزن', 'body_weight', 'number')}
                  {renderField('واحد وزن', 'weight_unit', 'select', [
                    { value: 'kg', label: 'کیلوگرم' },
                    { value: 'lb', label: 'پوند' }
                  ])}
                  {renderField('قد', 'height', 'number')}
                  {renderField('واحد قد', 'height_unit', 'select', [
                    { value: 'cm', label: 'سانتی‌متر' },
                    { value: 'inch', label: 'اینچ' }
                  ])}
                  {renderField('جنسیت', 'gender', 'select', [
                    { value: '', label: 'انتخاب کنید' },
                    { value: 'male', label: 'مرد' },
                    { value: 'female', label: 'زن' }
                  ])}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>نقش:</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>
                      {user.role === 'coach' ? 'مربی' : (user.role === 'user' ? 'ورزشکار' : 'کاربر')}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderField('نام کاربری', 'username')}
                    {renderField('ایمیل', 'email', 'email')}
                    {renderField('نام', 'first_name')}
                    {renderField('نام خانوادگی', 'last_name')}
                    {renderField('شماره تلفن', 'phone_number', 'tel')}
                    {renderField('وزن', 'body_weight', 'number')}
                    {renderField('واحد وزن', 'weight_unit', 'select', [
                      { value: 'kg', label: 'کیلوگرم' },
                      { value: 'lb', label: 'پوند' }
                    ])}
                    {renderField('قد', 'height', 'number')}
                    {renderField('واحد قد', 'height_unit', 'select', [
                      { value: 'cm', label: 'سانتی‌متر' },
                      { value: 'inch', label: 'اینچ' }
                    ])}
                    {renderField('جنسیت', 'gender', 'select', [
                      { value: '', label: 'انتخاب کنید' },
                      { value: 'male', label: 'مرد' },
                      { value: 'female', label: 'زن' }
                    ])}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 rounded-lg font-semibold text-white transition hover:opacity-90"
                      style={{ backgroundColor: colors.buttonBg }}
                    >
                      ذخیره تغییرات
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setMessage('');
                        setFormData({
                          username: user.username || '',
                          email: user.email || '',
                          first_name: user.first_name || '',
                          last_name: user.last_name || '',
                          phone_number: user.phone_number || '',
                          body_weight: user.body_weight || '',
                          weight_unit: user.weight_unit || '',
                          height: user.height || '',
                          height_unit: user.height_unit || '',
                          gender: user.gender || '',
                        });
                      }}
                      className="flex-1 py-2 px-4 rounded-lg font-semibold text-white transition hover:opacity-90"
                      style={{ backgroundColor: colors.cancelButtonBg }}
                    >
                      لغو
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Measurements Section */}
          <div className="w-full md:w-1/3">
            <div className="p-6 rounded-xl shadow-md h-full" style={{ backgroundColor: colors.cardBg }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>اندازه‌گیری‌ها</h2>
              
              <div className="space-y-4">
                {user.user_position === 'client' && (
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>سابقه باشگاه (ماه):</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.gym_experience_months || 'N/A'}</p>
                  </div>
                )}
                
                {user.user_position === 'coach' && (
                  <>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text }}>خلاصه تخصص:</p>
                      <p className="text-base font-medium" style={{ color: colors.text }}>{user.expertise_resume || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text }}>مجوز:</p>
                      <p className="text-base font-medium" style={{ color: colors.text }}>{user.license || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text }}>شماره مجوز:</p>
                      <p className="text-base font-medium" style={{ color: colors.text }}>{user.license_number || 'N/A'}</p>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>گردن:</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.neck_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>شانه:</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.shoulder_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>بازوی راست (دو سر):</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.arm_r_biceps_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>بازوی راست (سه سر):</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.arm_r_triceps_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>بازوی چپ (دو سر):</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.arm_l_biceps_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>بازوی چپ (سه سر):</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.arm_l_triceps_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>سینه:</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.chest_size || 'N/A'}</p>
                  </div>
                  {user.gender === 'female' && (
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text }}>زیر سینه:</p>
                      <p className="text-base font-medium" style={{ color: colors.text }}>{user.under_chest_size || 'N/A'}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>کمر:</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.waist_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>شکم:</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.abdomen_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>باسن:</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.hip_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>ران راست:</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.thigh_r_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>ران چپ:</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.thigh_l_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>ساق راست:</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.calves_r_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>ساق چپ:</p>
                    <p className="text-base font-medium" style={{ color: colors.text }}>{user.calves_l_size || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-6 py-2 px-4 rounded-lg font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: colors.buttonBg }}
                >
                  ویرایش پروفایل
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;