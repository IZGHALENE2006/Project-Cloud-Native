import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import AddCar from "./pages/AddCar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { GetAllCar } from "./slices/carSlice";
import AddClient from "./pages/AddClient";

function App() {
  const dispatch = useDispatch()
  useEffect(()=>{
   dispatch(GetAllCar())
  },[dispatch])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cars/add" element={<AddCar />} />
      <Route path="/clients/add" element={<AddClient />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
