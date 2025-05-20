import React, { useState } from "react";
import NavbarComponent from "../../components/navbar";
import image from "../../assets/image.png";
import { sendData } from "../../../utils/helpus";
import { servers } from "../../../utils/api";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    const result = await sendData(
      `${servers.activities}/auth/net/register`,
      payload,
      ""
    );

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate("/login");
  };

  return (
    <>
      {/* <NavbarComponent /> */}
      <div className="min-h-screen flex font-sans">
        {/* Left Side with Image and Overlay */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src={image}
            alt="Register Visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900 opacity-60" />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8 py-16">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600 mb-6">
              Sign up to get started and continue exploring.
            </p>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* First Name */}
              <div>
                <label className="block text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter your last name"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            {/* Bottom Text */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login here →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
