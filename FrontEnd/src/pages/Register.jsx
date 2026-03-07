import { useState } from "react";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";

function Register() {
  const [formData, setFormData] = useState({
    agencyName: "",
    managerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/register", formData);
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
      title="Register"
      subtitle="Create a new account"
      linkText="Already have an account?"
      linkTo="/login"
      linkLabel="Login"
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="agencyName">Agency Name</label>
        <input
          id="agencyName"
          name="agencyName"
          type="text"
          value={formData.agencyName}
          onChange={handleChange}
          placeholder="Enter agency name"
          required
        />

        <label htmlFor="managerName">Manager Name</label>
        <input
          id="managerName"
          name="managerName"
          type="text"
          value={formData.managerName}
          onChange={handleChange}
          placeholder="Enter manager name"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />

        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          required
        />

        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
          required
        />

        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          placeholder="Enter city"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create password"
          required
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          required
        />

        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;
