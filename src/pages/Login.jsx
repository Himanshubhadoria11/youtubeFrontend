import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signin } from "../redux/authSlice";
import "../styles/login.css";
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!formData.email || !formData.password) {
            setError("Email and password are required!");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/users/login`,{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log("Login Result:", result);

            if (!response.ok) {
                throw new Error(result.message || "Login failed");
            }

            localStorage.setItem("results", result);

            dispatch(signin(result));
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="loginForm" onSubmit={handleSubmit}>
                <h2> User Login </h2>
                <label> Email </label>
                <input className="loginInput" type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />

                <label> Password </label>
                <input className="loginInput" type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />

                <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Submit"}</button>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <p>Not a user? <Link to="/signup">Sign Up</Link></p>
            </form>
        </div>
    );
}

export default Login;
