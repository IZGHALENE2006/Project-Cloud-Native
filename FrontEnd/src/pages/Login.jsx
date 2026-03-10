import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { Loginuser } from "../slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
    const {loading,error} = useSelector((state)=>{return state.auth})
  const Dispatch = useDispatch()
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();


  try {
    await Dispatch(Loginuser(formData)).unwrap();
      navigate('/dashboard')

}catch(error){
console.log(error);

}


}

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

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
}
export default Login;
