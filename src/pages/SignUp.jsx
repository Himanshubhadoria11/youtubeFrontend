import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/signUp.css";
const API_URL = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    avatar: "",
  });

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      navigate("/");
    }
  }, [navigate, user]);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.userName || !formData.avatar) {
      toast.error("All fields are required");
      return;
    }

    try {
      const { userName, email, password, avatar } = formData;
      let { data } = await axios.post(`${API_URL}/api/users/signup`, {
        userName, email, password, avatar
      });

      if (data) {
        toast.success("User registered successfully!");
        navigate("/login"); // Redirect to login page after signup
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="signupContainer">
      <form onSubmit={handleFormSubmit} className="signUpForm">
        <h2>User Sign-Up From</h2>

        <label htmlFor="userName">Username</label>
        <input className="inputs" required value={formData.userName} onChange={handleChange} name="userName" id="userName" type="text" />

        <label htmlFor="email">Email</label>
        <input className="inputs" required id="email" type="email" value={formData.email} name="email" onChange={handleChange} />

        <label htmlFor="password">Password</label>
        <input className="inputs" required id="password" type="password" value={formData.password} name="password" autoComplete="true" onChange={handleChange} />

        <label htmlFor="avatar">Avatar Link</label>
        <input className="inputs" required id="avatar" type="text" value={formData.avatar} name="avatar" onChange={handleChange} />

        <button type="submit">Submit</button>
        <p>
          Already have an account? <Link to="/login" className="login-link">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;

