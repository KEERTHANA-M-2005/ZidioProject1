import React, { useState } from "react";
import axios from "axios";

const AuthPage = () => {
  const [formType, setFormType] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    const endpoint = formType === "login" ? "/api/login" : "/api/register";
    try {
      const res = await axios.post(endpoint, { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Success!");
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">
          {formType === "login" ? "Login" : "Register"}
        </h2>
        <input
          className="w-full p-2 border rounded mb-3"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleAuth}
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800"
        >
          {formType === "login" ? "Login" : "Sign Up"}
        </button>
        <p className="mt-4 text-sm text-center text-gray-600">
          {formType === "login" ? "New user?" : "Already have an account?"}
          <button
            className="text-purple-600 ml-1 underline"
            onClick={() => setFormType(formType === "login" ? "register" : "login")}
          >
            {formType === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
