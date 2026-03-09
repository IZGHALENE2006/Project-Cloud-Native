import { useEffect, useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import CarCard from "../components/dashboard/CarCard";
import { Link } from "react-router-dom";
import { statsData, carsData } from "../data/dashboardData";
import "../styles/dashboard.css";

const CARS_STORAGE_KEY = "carsData";
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
  const [allCars, setAllCars] = useState(carsData);
  const [editingCarId, setEditingCarId] = useState(null);
  const [editForm, setEditForm] = useState(initialEditForm);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editFileInputKey, setEditFileInputKey] = useState(0);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    try {
      const storedCars = JSON.parse(localStorage.getItem(CARS_STORAGE_KEY) || "[]");
      if (!Array.isArray(storedCars) || storedCars.length === 0) {
        return;
      }

      const baseIds = new Set(carsData.map((car) => car.id));
      const hasBaseCars = storedCars.some((car) => baseIds.has(car.id));
      setAllCars(hasBaseCars ? storedCars : [...carsData, ...storedCars]);
    } catch (error) {
      console.error("Failed to read cars from storage:", error);
    }
  }, []);

  const saveCars = (nextCars) => {
    setAllCars(nextCars);
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(nextCars));
  };

  const handleDeleteCar = (carId) => {
    const nextCars = allCars.filter((car) => car.id !== carId);
    saveCars(nextCars);
  };

  const handleOpenUpdateModal = (carId) => {
    const currentCar = allCars.find((car) => car.id === carId);
    if (!currentCar) return;

    setEditingCarId(carId);
    setEditForm({
      brand: currentCar.brand || "",
      model: currentCar.model || "",
      carNumber: currentCar.carNumber || "",
      color: currentCar.color || "",
      pricePerDay: String(currentCar.pricePerDay ?? ""),
      image: currentCar.image || "",
      status: currentCar.status || "Available",
      year: String(currentCar.year ?? ""),
    });
    if (editImagePreview.startsWith("blob:")) URL.revokeObjectURL(editImagePreview);
    setEditImageFile(null);
    setEditImagePreview(currentCar.image || "");
    setEditFileInputKey((prev) => prev + 1);
    setEditError("");
  };

  const handleCloseUpdateModal = () => {
    if (editImagePreview.startsWith("blob:")) URL.revokeObjectURL(editImagePreview);
    setEditingCarId(null);
    setEditForm(initialEditForm);
    setEditImageFile(null);
    setEditImagePreview("");
    setEditError("");
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditError("");
  };

  const handleEditImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setEditImageFile(file);
    setEditError("");

    if (file) {
      if (editImagePreview.startsWith("blob:")) URL.revokeObjectURL(editImagePreview);
      setEditImagePreview(URL.createObjectURL(file));
      return;
    }

    if (editImagePreview.startsWith("blob:")) URL.revokeObjectURL(editImagePreview);
    setEditImagePreview(editForm.image || "");
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read image file."));
      reader.readAsDataURL(file);
    });

  const handleSaveUpdate = async (event) => {
    event.preventDefault();

    if (
      !editForm.brand.trim() ||
      !editForm.model.trim() ||
      !editForm.carNumber.trim() ||
      !editForm.color.trim()
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
    const selectedStatus = allowedStatuses.includes(editForm.status) ? editForm.status : "Available";

    let nextImage = editForm.image;
    if (editImageFile) {
      try {
        nextImage = await fileToDataUrl(editImageFile);
      } catch (error) {
        setEditError("Could not process image file.");
        return;
      }
    }

    const nextCars = allCars.map((car) =>
      car.id === editingCarId
        ? {
            ...car,
            brand: editForm.brand.trim(),
            model: editForm.model.trim(),
            carNumber: editForm.carNumber.trim(),
            color: editForm.color.trim(),
            pricePerDay: parsedPrice,
            image: nextImage,
            status: selectedStatus,
            year: editForm.year ? Number(editForm.year) : "",
          }
        : car
    );
    saveCars(nextCars);
    handleCloseUpdateModal();
  };

  return (
    <DashboardLayout>
      <DashboardHeader />

      <section className="stats-grid">
        {statsData.map((item) => (
          <StatCard key={item.id} {...item} />
        ))}
      </section>

      <section className="action-row">
        <Link to="/cars/add" className="btn-primary">
          Add Car
        </Link>
        <button type="button" className="btn-secondary">
          Add User
        </button>
      </section>

      <section>
        <h3 className="section-title">Cars</h3>
        <div className="cars-grid">
          {allCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onUpdate={() => handleOpenUpdateModal(car.id)}
              onDelete={() => handleDeleteCar(car.id)}
            />
          ))}
        </div>
      </section>

      {editingCarId !== null && (
        <div className="modal-overlay" onClick={handleCloseUpdateModal}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>Update Car</h3>
            <form className="modal-form" onSubmit={handleSaveUpdate}>
              <div className="modal-grid">
                <div className="modal-field">
                  <label htmlFor="editBrand">Car Brand</label>
                  <input
                    id="editBrand"
                    name="brand"
                    value={editForm.brand}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="editModel">Car Model</label>
                  <input
                    id="editModel"
                    name="model"
                    value={editForm.model}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="editCarNumber">Car Number</label>
                  <input
                    id="editCarNumber"
                    name="carNumber"
                    value={editForm.carNumber}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="editColor">Car Color</label>
                  <input
                    id="editColor"
                    name="color"
                    value={editForm.color}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="editPricePerDay">Price Per Day</label>
                  <input
                    id="editPricePerDay"
                    name="pricePerDay"
                    type="number"
                    min="0"
                    value={editForm.pricePerDay}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="editYear">Year</label>
                  <input
                    id="editYear"
                    name="year"
                    type="number"
                    min="1980"
                    max="2099"
                    value={editForm.year}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="modal-field modal-field-full">
                  <label htmlFor="editImageFile">Car Image File</label>
                  <input
                    id="editImageFile"
                    name="imageFile"
                    key={editFileInputKey}
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                  />
                  {editImagePreview && (
                    <img className="modal-image-preview" src={editImagePreview} alt="Car preview" />
                  )}
                </div>
                <div className="modal-field modal-field-full">
                  <label htmlFor="editStatus">Status</label>
                  <select
                    id="editStatus"
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                  >
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
