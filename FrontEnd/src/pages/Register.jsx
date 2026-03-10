import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { RejisterUser } from "../slices/auth";
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    agencyName: "",
    managerName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
  });
  // Dispatch
  const Dispatch = useDispatch()
const navigate = useNavigate()
  const {loading,error} = useSelector((state)=>{return state.auth})

  const [Error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return; 
  }


  try {
    await Dispatch(RejisterUser(formData)).unwrap();
     navigate('/login')   
  } catch (err) {
    const message = err?.message || "Failed to send data.";
    setError(message);
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
        />

        <label htmlFor="managerName">Manager Name</label>
        <input
          id="managerName"
          name="managerName"
          type="text"
          value={formData.managerName}
          onChange={handleChange}
          placeholder="Enter manager name"
          
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          
        />

        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter phone number"
          
        />

        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
          
        />

        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          placeholder="Enter city"
          
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create password"
          
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          
        />

        {error && <p className="message error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;
