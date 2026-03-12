import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import "../styles/dashboard.css";
import "../styles/addCar.css";
import { Addcar } from "../slices/carSlice";
import { useDispatch, useSelector } from "react-redux";

const initialForm = {
  brand: "",
  model: "",
  registrationNumber: "",
  color: "",
  pricePerDay: "",
  status: "Available",
  year: "",
};

function AddCar() {

  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.Car);

  // validation
  const validate = () => {
    const newErrors = {};

    if (!formData.brand.trim()) newErrors.brand = "Car brand is required.";
    if (!formData.model.trim()) newErrors.model = "Car model is required.";
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = "Registration number is required.";
    if (!formData.color.trim()) newErrors.color = "Car color is required.";
    if (!formData.pricePerDay) newErrors.pricePerDay = "Price per day is required.";
    if (!formData.year) newErrors.year = "Year is required.";
    if (!imageFile) newErrors.imageFile = "Car image is required.";

    return newErrors;
  };

  // submit
  const handleSubmit = async (event) => {

    event.preventDefault();

    setErrors({});
    setSuccessMessage("");

    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("image", imageFile);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("model", formData.model);
    formDataToSend.append("registrationNumber", formData.registrationNumber);
    formDataToSend.append("color", formData.color);
    formDataToSend.append("pricePerDay", formData.pricePerDay);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("year", formData.year);

    try {

      await dispatch(Addcar(formDataToSend)).unwrap();

      setSuccessMessage("Car saved successfully.");

      // reset form
      setFormData(initialForm);
      setImageFile(null);
      setErrors({});

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <DashboardLayout>

      <section className="add-car-page">

        <div className="add-car-header">
          <h1>Add New Car</h1>
          <p>Fill in the details below to add a car.</p>
        </div>

        <form className="add-car-form" onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* brand */}
            <div className="form-group">
              <label>Car Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e)=>setFormData({...formData,brand:e.target.value})}
                placeholder="Toyota"
              />
              {errors.brand && <small className="error-text">{errors.brand}</small>}
            </div>

            {/* model */}
            <div className="form-group">
              <label>Car Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e)=>setFormData({...formData,model:e.target.value})}
                placeholder="Corolla"
              />
              {errors.model && <small className="error-text">{errors.model}</small>}
            </div>

            {/* registration */}
            <div className="form-group">
              <label>Registration Number</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e)=>setFormData({...formData,registrationNumber:e.target.value})}
                placeholder="1234-A-6"
              />
              {errors.registrationNumber && <small className="error-text">{errors.registrationNumber}</small>}
            </div>

            {/* color */}
            <div className="form-group">
              <label>Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e)=>setFormData({...formData,color:e.target.value})}
                placeholder="White"
              />
              {errors.color && <small className="error-text">{errors.color}</small>}
            </div>

            {/* price */}
            <div className="form-group">
              <label>Price Per Day</label>
              <input
                type="number"
                value={formData.pricePerDay}
                onChange={(e)=>setFormData({...formData,pricePerDay:e.target.value})}
                placeholder="300"
              />
              {errors.pricePerDay && <small className="error-text">{errors.pricePerDay}</small>}
            </div>

            {/* image */}
            <div className="form-group">
              <label>Car Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e)=>setImageFile(e.target.files[0])}
              />
              {errors.imageFile && <small className="error-text">{errors.imageFile}</small>}
            </div>

            {/* status */}
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e)=>setFormData({...formData,status:e.target.value})}
              >
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Under Repair">Under Repair</option>
              </select>
            </div>

            {/* year */}
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e)=>setFormData({...formData,year:e.target.value})}
                placeholder="2024"
              />
              {errors.year && <small className="error-text">{errors.year}</small>}
            </div>

          </div>

          {successMessage && <p className="success-text">{successMessage}</p>}

          <div className="form-actions">

            <button type="submit" className="btn-primary">

              {loading ? "Saving..." : "Save Car"}

            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={()=>navigate("/dashboard")}
            >
              Cancel
            </button>

          </div>

        </form>

      </section>

    </DashboardLayout>
  );
}

export default AddCar;