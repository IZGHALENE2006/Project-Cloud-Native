import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import "../styles/dashboard.css";
import "../styles/addCar.css";
import { Addcar } from "../slices/carSlice";
import { useDispatch, useSelector } from "react-redux";

const initialForm = {
  image:"",
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
  const [imagePreview, setImagePreview] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
console.log(FormData);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);


const dispatch = useDispatch()


  const validate = () => {
    const newErrors = {};

    if (!formData.brand.trim()) newErrors.brand = "Car brand is required.";
    if (!formData.model.trim()) newErrors.model = "Car model is required.";
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required.";
    }
    if (!formData.color.trim()) newErrors.color = "Car color is required.";
    if (!formData.pricePerDay) newErrors.pricePerDay = "Price per day is required.";
    if (!imageFile) newErrors.imageFile = "Car image file is required.";

    return newErrors;
  };


const handleSubmit = async (event) => {
  event.preventDefault();
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

    setFormData(initialForm);
    setImageFile(null);
    setImagePreview("");
    setFileInputKey((prev) => prev + 1);
    setErrors({});

    navigate("/dashboard");

  } catch (error) {
console.log(error);

  }
};
  return (
    <DashboardLayout>
      <section className="add-car-page">
        <div className="add-car-header">
          <h1>Add New Car</h1>
          <p>Fill in the details below to add a car to your fleet.</p>
        </div>

        <form className="add-car-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="brand">Car Brand</label>
              <input
                id="brand"
                name="brand"
                type="text"
                value={formData.brand}
                onChange={(e)=>setFormData({...formData,brand:e.target.value})}
                placeholder="Toyota"
              />
              {errors.brand && <small className="error-text">{errors.brand}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="model">Car Model</label>
              <input
                id="model"
                name="model"
                type="text"
                value={formData.model}
                onChange={(e)=>setFormData({...formData,model:e.target.value})}
                placeholder="Corolla"
              />
              {errors.model && <small className="error-text">{errors.model}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="registrationNumber">Car Number / Registration Number</label>
              <input
                id="registrationNumber"
                name="registrationNumber"
                type="text"
                value={formData.registrationNumber}
                onChange={(e)=>setFormData({...formData,registrationNumber:e.target.value})}
                placeholder="12345-A-6"
              />
              {errors.registrationNumber && (
                <small className="error-text">{errors.registrationNumber}</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="color">Car Color</label>
              <input
                id="color"
                name="color"
                type="text"
                value={formData.color}
                onChange={(e)=>setFormData({...formData,color:e.target.value})}
                placeholder="White"
              />
              {errors.color && <small className="error-text">{errors.color}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="pricePerDay">Price Per Day</label>
              <input
                id="pricePerDay"
                name="pricePerDay"
                type="number"
                min="0"
                value={formData.pricePerDay}
                onChange={(e)=>setFormData({...formData,pricePerDay:e.target.value})}
                placeholder="300"
              />
              {errors.pricePerDay && <small className="error-text">{errors.pricePerDay}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="imageFile">Car Image File</label>
              <input
                id="imageFile"
                name="imageFile"
                key={fileInputKey}
                type="file"
                accept="image/*"
                 onChange={(e)=>setFormData({...formData,image:e.target.files[0]})}
              />
              <small className="hint-text">
                Image is saved locally and shown مباشرة ف dashboard.
              </small>
              {errors.imageFile && <small className="error-text">{errors.imageFile}</small>}
              {imagePreview && (
                <img className="image-preview" src={imagePreview} alt="Selected car preview" />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status}
                onChange={(e)=>setFormData({...formData,status:e.target.value})}
              
              >
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Under Repair">Under Repair</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input
                id="year"
                name="year"
                type="number"
                min="1980"
                max="2099"
                value={formData.year}
                onChange={(e)=>setFormData({...formData,year:e.target.value})}
                placeholder="2024"
              />
            </div>
          </div>

          {successMessage && <p className="success-text">{successMessage}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save Car
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard")}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default AddCar;
