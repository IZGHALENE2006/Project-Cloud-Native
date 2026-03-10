import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getCars, saveCars } from "../data/carsStorage";
import "../styles/dashboard.css";
import "../styles/addCar.css";

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
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setErrors((prev) => ({ ...prev, imageFile: "" }));

    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview("");
  };

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

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read image file."));
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");

    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const imageDataUrl = await fileToDataUrl(imageFile);
      const carPayload = {
        id: Date.now(),
        brand: formData.brand.trim(),
        model: formData.year ? `${formData.model.trim()} ${formData.year}` : formData.model.trim(),
        carNumber: formData.registrationNumber.trim(),
        color: formData.color.trim(),
        pricePerDay: Number(formData.pricePerDay),
        status: formData.status,
        image: imageDataUrl,
        imagePath: `/images/cars/${imageFile.name}`,
      };

      saveCars([...getCars(), carPayload]);

      console.log("New car data:", carPayload);
      setSuccessMessage("Car saved successfully.");
      setFormData(initialForm);
      setImageFile(null);
      setImagePreview("");
      setFileInputKey((prev) => prev + 1);
      setErrors({});
      navigate("/dashboard");
    } catch (error) {
      setErrors((prev) => ({ ...prev, imageFile: "Could not process image file." }));
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleImageChange}
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
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
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
                onChange={handleChange}
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
