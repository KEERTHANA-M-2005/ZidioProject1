import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default role
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup
      ? "http://localhost:5000/api/auth/signup" // ✅ Corrected route
      : "http://localhost:5000/api/auth/login";

    // Prevent direct admin signup on client too
    if (isSignup && formData.role === 'admin') {
      alert('Admin access requires approval from admin: keerthigowli05@gmail.com');
      return;
    }

    try {
      const res = await axios.post(url, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId); 

      // Redirect based on role
      // Route to dashboard; DashboardRouter will render Admin or User view
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Authentication Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf5ff]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-purple-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#6b21a8]">
          {isSignup ? "Sign Up" : "Log In"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <select
                name="role"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {formData.role === 'admin' && (
                <p className="text-xs text-red-600 mt-2">Admin access requires approval from admin: keerthigowli05@gmail.com</p>
              )}
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />

          <button
            type="submit"
            className="w-full bg-[#6b21a8] text-white py-3 rounded-md hover:bg-[#5a189a] transition"
          >
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-[#6b21a8] cursor-pointer ml-2 font-medium"
          >
            {isSignup ? "Log in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
