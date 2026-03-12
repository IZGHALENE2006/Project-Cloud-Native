import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import CarCard from "../components/dashboard/CarCard";
import { getCars } from "../data/carsStorage";

import { DeleteCar, UpdateCar } from "../slices/carSlice"; // افترض slice فيها update/delete

import "../styles/dashboard.css";

const initialEditForm = {
  brand: "",
  model: "",
  carNumber: "",
  color: "",
  pricePerDay: "",
  image: "",
  status: "Available",
  year: "",
};

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { Cars } = useSelector((state) => state.Car);
  const { Token } = useSelector((state) => state.auth);

  const [editingCarId, setEditingCarId] = useState(null);
  const [editForm, setEditForm] = useState(initialEditForm);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editFileInputKey, setEditFileInputKey] = useState(0);
  const [editError, setEditError] = useState("");

  // Redirect to login if no token
  useEffect(() => {
    if (!Token) navigate("/login");
  }, [Token]);

  // Open Update Modal
  const handleOpenUpdateModal = (carId) => {
    const currentCar = Cars.find((car) => car._id === carId);
    if (!currentCar) return;

    setEditingCarId(carId);
    setEditForm({
      brand: currentCar.brand || "",
      model: currentCar.model || "",
      carNumber: currentCar.registrationNumber || "",
      color: currentCar.color || "",
      pricePerDay: String(currentCar.pricePerDay ?? ""),
      image: currentCar.image || "",
      status: currentCar.status || "Available",
      year: String(currentCar.year ?? ""),
    });
    setEditImagePreview(currentCar.image || "");
    setEditImageFile(null);
    setEditFileInputKey((prev) => prev + 1);
    setEditError("");
  };

  // Close modal
  const handleCloseUpdateModal = () => {
    setEditingCarId(null);
    setEditForm(initialEditForm);
    setEditImageFile(null);
    setEditImagePreview("");
    setEditError("");
  };

  // Handle input change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditError("");
  };

  // Handle image file change
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setEditImagePreview(previewUrl);
    setEditForm((prev) => ({ ...prev, image: file }));
  };

  // Handle Update Car submit
  const handleSaveUpdate = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !editForm.brand.trim() ||
      !editForm.model.trim() ||
      !editForm.carNumber.trim() ||
      !editForm.color.trim() ||
      !editForm.pricePerDay
    ) {
      setEditError("Please fill all required fields.");
      return;
    }

    const parsedPrice = Number(editForm.pricePerDay);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setEditError("Price per day must be a valid number.");
      return;
    }

    const allowedStatuses = ["Available", "Rented", "Under Repair"];
    const selectedStatus = allowedStatuses.includes(editForm.status)
      ? editForm.status
      : "Available";

    // Prepare FormData for image upload
    const formDataToSend = new FormData();
    formDataToSend.append("brand", editForm.brand.trim());
    formDataToSend.append("model", editForm.model.trim());
    formDataToSend.append("registrationNumber", editForm.carNumber.trim());
    formDataToSend.append("color", editForm.color.trim());
    formDataToSend.append("pricePerDay", parsedPrice);
    formDataToSend.append("status", selectedStatus);
    formDataToSend.append("year", editForm.year ? Number(editForm.year) : "");
    if (editImageFile) formDataToSend.append("image", editImageFile);

    try {
      await dispatch(UpdateCar({ id: editingCarId, data: formDataToSend })).unwrap();
      handleCloseUpdateModal();
    } catch (err) {
      setEditError("Failed to update car.");
      console.log(err);
    }
  };

  // Handle Delete Car
  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await dispatch(DeleteCar(carId)).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader />

      <section className="action-row">
        <Link to="/cars/add" className="btn-primary">
          Add Car
        </Link>
      </section>

      <section>
        <h3 className="section-title">Cars</h3>
        <div className="cars-grid">
          {Cars?.map((car) => (
            <CarCard
              key={car._id}
              car={car}
              onUpdate={() => handleOpenUpdateModal(car._id)}
              onDelete={() => handleDeleteCar(car._id)}
            />
          ))}
        </div>
      </section>

      {/* Update Modal */}
      {editingCarId && (
        <div className="modal-overlay" onClick={handleCloseUpdateModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Update Car</h3>
            <form className="modal-form" onSubmit={handleSaveUpdate}>
              <div className="modal-grid">
                <div className="modal-field">
                  <label>Car Brand</label>
                  <input name="brand" value={editForm.brand} onChange={handleEditChange} />
                </div>
                <div className="modal-field">
                  <label>Car Model</label>
                  <input name="model" value={editForm.model} onChange={handleEditChange} />
                </div>
                <div className="modal-field">
                  <label>Car Number</label>
                  <input name="carNumber" value={editForm.carNumber} onChange={handleEditChange} />
                </div>
                <div className="modal-field">
                  <label>Color</label>
                  <input name="color" value={editForm.color} onChange={handleEditChange} />
                </div>
                <div className="modal-field">
                  <label>Price Per Day</label>
                  <input
                    name="pricePerDay"
                    type="number"
                    min="0"
                    value={editForm.pricePerDay}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="modal-field">
                  <label>Year</label>
                  <input
                    name="year"
                    type="number"
                    min="1980"
                    max="2099"
                    value={editForm.year}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="modal-field modal-field-full">
                  <label>Car Image</label>
                  <input
                    key={editFileInputKey}
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                  />
                  {editImagePreview && (
                    <img className="modal-image-preview" src={editImagePreview} alt="preview" />
                  )}
                </div>
                <div className="modal-field modal-field-full">
                  <label>Status</label>
                  <select name="status" value={editForm.status} onChange={handleEditChange}>
                    <option value="Available">Available</option>
                    <option value="Rented">Rented</option>
                    <option value="Under Repair">Under Repair</option>
                  </select>
                </div>
              </div>

              {editError && <p className="modal-error">{editError}</p>}

              <div className="modal-actions">
                <button type="submit" className="car-btn update">
                  Save Changes
                </button>
                <button type="button" className="car-btn delete" onClick={handleCloseUpdateModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;