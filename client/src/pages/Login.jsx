import { useState } from "react";
import client, { setToken } from "../api/client";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock } from "react-icons/fi";
import "../styles/auth.css";

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage("");
    setType("");

    if (!data.username || !data.password) {
      setType("error");
      setMessage("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await client.post("auth/", data);

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("username", data.username);
      setToken(res.data.access);

      setType("success");
      setMessage("Login successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);

    } catch (err) {
      setType("error");
      setMessage(err.response?.data?.detail || "Invalid credentials");
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
          <h2>Welcome Back</h2>

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

          <button
            className="auth-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className={`form-message ${type}`}>
              {message}
            </p>
          )}

          <button
            className="link-btn"
            onClick={() => navigate("/signup")}
          >
            New user? Signup
          </button>
        </div>
      </div>
    </div>
  );
}