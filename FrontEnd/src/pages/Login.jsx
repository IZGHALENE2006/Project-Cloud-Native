import { useState } from "react";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/api/auth/login", formData);
      setSuccess("Data sent successfully.");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to send data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Login"
      subtitle="Sign in to your account"
      linkText="Do not have an account?"
      linkTo="/register"
      linkLabel="Register"
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
