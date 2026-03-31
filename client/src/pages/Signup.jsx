import { useState } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock } from "react-icons/fi";
import "../styles/auth.css";

export default function Signup() {
  const [data, setData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    setMessage("");
    setType("");

    if (!data.username || !data.password || !data.confirmPassword) {
      setType("error");
      setMessage("Please fill all fields");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setType("error");
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await client.post("users/signup/", {
        username: data.username,
        password: data.password,
      });

      setType("success");
      setMessage("Account created successfully");

      setData({
        username: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setMessage("");
        navigate("/login");
      }, 1200);

    } catch (err) {
      setType("error");
      setMessage(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-info">
        <h1>VendorHub</h1>

        <p className="tagline">
          Manage your products. Track inventory. Grow your business.
        </p>

        <ul>
          <li>✔ Add & manage products easily</li>
          <li>✔ Track stock in real-time</li>
          <li>✔ Secure vendor dashboard</li>
        </ul>
      </div>

      <div className="auth-card">
        <div className="auth-form-box">

          <h2>Create Account</h2>

          {message && (
            <p className={`form-message ${type}`}>
              {message}
            </p>
          )}

          {/* Username */}
          <div className="input-field">
            <FiUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={data.username}
              onChange={(e) =>
                setData({ ...data, username: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="input-field">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
            />
          </div>

          {/* Confirm Password */}
          <div className="input-field">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={data.confirmPassword}
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
            />
          </div>

          <button
            className="auth-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating..." : "Register"}
          </button>

          <button
            className="link-btn"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </button>

        </div>
      </div>

    </div>
  );
}