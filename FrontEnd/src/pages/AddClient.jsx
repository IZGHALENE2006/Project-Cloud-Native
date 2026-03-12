import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { AddClient, GetAllClients, UpdateClient, DeleteClient, clearError, clearMessage } from "../slices/ClientSlice";
import "../styles/dashboard.css";
import "../styles/addClient.css";

const initialClientForm = {
  fullName: "",
  phoneNumber: "",
  drivingLicenseNumber: "",
  nationalId: "",
  address: "",
};

const initialRentalForm = {
  carId: "",
  startDate: "",
  endDate: "",
  price: "",
  mileage: "",
};

function Clients() {
  const dispatch = useDispatch();
  const { clients, loading, error, successMessage } = useSelector((state) => state.client || { clients: [] });
  
  // Local states
  const [clientForm, setClientForm] = useState(initialClientForm);
  const [formErrors, setFormErrors] = useState({});
  const [editingClientId, setEditingClientId] = useState(null);
  const [editClientForm, setEditClientForm] = useState(initialClientForm);
  const [editErrors, setEditErrors] = useState({});
  const [rentingClientId, setRentingClientId] = useState(null);
  const [rentalForm, setRentalForm] = useState(initialRentalForm);
  const [rentErrors, setRentErrors] = useState({});
  
  // Cars state (keep local or move to Redux)
  const [cars, setCars] = useState([]);
  
  // Fetch clients on mount
  useEffect(() => {
    dispatch(GetAllClients());
    // Load cars from localStorage or API

  }, [dispatch]);
console.log(Clients);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const availableCars = cars.filter((car) => car.status === "Available");
  const rentingClient = clients.find((client) => client._id === rentingClientId);

  const handleClientChange = (event) => {
    const { name, value } = event.target;
    setClientForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditClientChange = (event) => {
    const { name, value } = event.target;
    setEditClientForm((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateClientForm = (form) => {
    const nextErrors = {};
    if (!form.fullName?.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.phoneNumber?.trim()) nextErrors.phoneNumber = "Phone number is required.";
    if (!form.drivingLicenseNumber?.trim()) nextErrors.drivingLicenseNumber = "Driving license number is required.";
    if (!form.nationalId?.trim()) nextErrors.nationalId = "National ID / CIN is required.";
    if (!form.address?.trim()) nextErrors.address = "Address is required.";
    return nextErrors;
  };

  const handleAddClient = async (event) => {
    event.preventDefault();
    const nextErrors = validateClientForm(clientForm);
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    const result = await dispatch(AddClient(clientForm));
    if (!result.error) {
      setClientForm(initialClientForm);
      setFormErrors({});
    }
  };

  const openEditModal = (client) => {
    setEditingClientId(client._id);
    setEditClientForm({
      fullName: client.fullName || "",
      phoneNumber: client.phoneNumber || "",
      drivingLicenseNumber: client.drivingLicenseNumber || "",
      nationalId: client.nationalId || "",
      address: client.address || "",
    });
    setEditErrors({});
  };

  const closeEditModal = () => {
    setEditingClientId(null);
    setEditClientForm(initialClientForm);
    setEditErrors({});
  };

  const handleUpdateClient = async (event) => {
    event.preventDefault();
    const nextErrors = validateClientForm(editClientForm);
    if (Object.keys(nextErrors).length > 0) {
      setEditErrors(nextErrors);
      return;
    }

    const result = await dispatch(UpdateClient({ 
      id: editingClientId, 
      data: editClientForm 
    }));
    
    if (!result.error) {
      closeEditModal();
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      await dispatch(DeleteClient(id));
    }
  };

  const openRentModal = (client) => {
    setRentingClientId(client._id);
    setRentalForm(initialRentalForm);
    setRentErrors({});
  };

  const closeRentModal = () => {
    setRentingClientId(null);
    setRentalForm(initialRentalForm);
    setRentErrors({});
  };

  const handleRentalChange = (event) => {
    const { name, value } = event.target;
    if (name === "carId") {
      const selectedCar = cars.find((car) => String(car.id) === value);
      setRentalForm((prev) => ({
        ...prev,
        carId: value,
        price: selectedCar ? String(selectedCar.pricePerDay ?? "") : prev.price,
      }));
      setRentErrors((prev) => ({ ...prev, [name]: "", price: "" }));
      return;
    }
    setRentalForm((prev) => ({ ...prev, [name]: value }));
    setRentErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateRentalForm = () => {
    const nextErrors = {};
    if (!rentalForm.carId) nextErrors.carId = "Please select a car.";
    if (!rentalForm.startDate) nextErrors.startDate = "Start date is required.";
    if (!rentalForm.endDate) nextErrors.endDate = "End date is required.";
    if (!rentalForm.price) nextErrors.price = "Price is required.";
    if (!rentalForm.mileage) nextErrors.mileage = "Mileage is required.";
    if (rentalForm.startDate && rentalForm.endDate && 
        new Date(rentalForm.endDate) < new Date(rentalForm.startDate)) {
      nextErrors.endDate = "End date must be after start date.";
    }
    return nextErrors;
  };

  const handleConfirmRental = (event) => {
    event.preventDefault();
    const nextErrors = validateRentalForm();
    if (Object.keys(nextErrors).length > 0) {
      setRentErrors(nextErrors);
      return;
    }

    // Implement rental logic here (create rental record)
    // Update car status, client activeRental, etc.
    closeRentModal();
  };

  const handleDownloadContract = (client) => {
    if (!client.activeRental) return;
    
    const contractNumber = `CTR-${client._id}-${client.activeRental.carId}`;
    const generatedAt = new Date().toLocaleDateString("fr-MA");
    const rental = client.activeRental;
    
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 18;
    let cursorY = 20;

    const addLine = (text, options = {}) => {
      const fontSize = options.fontSize || 11;
      const gap = options.gap || 7;
      pdf.setFont("helvetica", options.bold ? "bold" : "normal");
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, pageWidth - margin * 2);
      pdf.text(lines, margin, cursorY);
      cursorY += lines.length * gap;
    };

    pdf.setDrawColor(15, 23, 42);
    pdf.setLineWidth(0.6);
    pdf.line(margin, 30, pageWidth - margin, 30);

    addLine("Contrat de Location de Voiture", { bold: true, fontSize: 18, gap: 9 });
    addLine(`Agence: CarRent Pro`, { fontSize: 11 });
    addLine(`Lieu: Casablanca, Maroc`, { fontSize: 11 });
    addLine(`Contrat N: ${contractNumber}`, { fontSize: 11 });
    addLine(`Date: ${generatedAt}`, { fontSize: 11, gap: 9 });

    addLine("Informations du Client", { bold: true, fontSize: 14, gap: 8 });
    addLine(`Nom complet: ${client.fullName}`);
    addLine(`Telephone: ${client.phoneNumber}`);
    addLine(`Permis de conduire: ${client.drivingLicenseNumber}`);
    addLine(`CIN: ${client.nationalId}`);
    addLine(`Adresse: ${client.address}`, { gap: 8 });

    addLine("Informations de Location", { bold: true, fontSize: 14, gap: 8 });
    addLine(`Vehicule: ${rental.carLabel}`);
    addLine(`Date de debut: ${rental.startDate}`);
    addLine(`Date de fin: ${rental.endDate}`);
    addLine(`Prix convenu: ${rental.price} MAD`);
    addLine(`Kilometrage au depart: ${rental.mileage} km`);
    addLine(`Statut: ${rental.status}`, { gap: 8 });

    addLine("Clauses Principales", { bold: true, fontSize: 14, gap: 8 });
    addLine("Le client reconnait avoir recu le vehicule en bon etat apparent et s'engage a le restituer a la date prevue, avec ses documents et accessoires.");
    addLine("Le client reste responsable des contraventions, dommages ou frais d'utilisation constates pendant la periode de location selon les conditions appliquees par l'agence.");
    addLine("Le present document constitue une simulation de contrat de location au format marocain simplifie, genere depuis l'interface de gestion.", { gap: 10 });

    cursorY += 12;
    pdf.line(margin, cursorY, margin + 65, cursorY);
    pdf.line(pageWidth - margin - 65, cursorY, pageWidth - margin, cursorY);
    cursorY += 6;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Signature du client", margin, cursorY);
    pdf.text("Signature de l'agence", pageWidth - margin - 45, cursorY);

    pdf.save(`contrat-location-${client.fullName.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  return (
    <DashboardLayout>
      <section className="add-client-page">
        {/* Alerts */}
        {error && (
          <div className="alert alert-error" style={{background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px'}}>
            {error}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" style={{background: '#dcfce7', color: '#16a34a', padding: '12px', borderRadius: '8px', marginBottom: '16px'}}>
            {successMessage}
          </div>
        )}

        <div className="add-client-header">
          <h1>Clients Management</h1>
          <p>Create client records and manage rentals from one page.</p>
        </div>

        {/* Add Client Form */}
        <div className="client-panel">
          <form className="client-form" onSubmit={handleAddClient}>
            <div className="client-form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={clientForm.fullName}
                  onChange={handleClientChange}
                  placeholder="John Doe"
                />
                {formErrors.fullName && <small className="error-text">{formErrors.fullName}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={clientForm.phoneNumber}
                  onChange={handleClientChange}
                  placeholder="+212 600 000 000"
                />
                {formErrors.phoneNumber && <small className="error-text">{formErrors.phoneNumber}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="drivingLicenseNumber">Driving License Number</label>
                <input
                  id="drivingLicenseNumber"
                  name="drivingLicenseNumber"
                  type="text"
                  value={clientForm.drivingLicenseNumber}
                  onChange={handleClientChange}
                  placeholder="DL-123456"
                />
                {formErrors.drivingLicenseNumber && <small className="error-text">{formErrors.drivingLicenseNumber}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="nationalId">National ID / CIN</label>
                <input
                  id="nationalId"
                  name="nationalId"
                  type="text"
                  value={clientForm.nationalId}
                  onChange={handleClientChange}
                  placeholder="AB123456"
                />
                {formErrors.nationalId && <small className="error-text">{formErrors.nationalId}</small>}
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={clientForm.address}
                  onChange={handleClientChange}
                  placeholder="Client address"
                  rows="3"
                />
                {formErrors.address && <small className="error-text">{formErrors.address}</small>}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Client'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setClientForm(initialClientForm)}>
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Clients List */}
        <div className="client-panel">
          <div className="client-table-header">
            <h2>Client List</h2>
            <span>{clients?.length || 0} client(s)</span>
          </div>

          <div className="client-table-wrapper">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>License Number</th>
                  <th>CIN</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{textAlign: 'center'}}>Loading...</td></tr>
                ) : clients?.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign: 'center'}}>No clients found</td></tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client._id}>
                      <td>{client.fullName}</td>
                      <td>{client.phoneNumber}</td>
                      <td>{client.drivingLicenseNumber}</td>
                      <td>{client.nationalId}</td>
                      <td>{client.address}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="table-btn update-btn"
                            onClick={() => openEditModal(client)}
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            className="table-btn rent-btn"
                            onClick={() => openRentModal(client)}
                            disabled={Boolean(client.activeRental)}
                          >
                            Rent Car
                          </button>
                          <button
                            type="button"
                            className="table-btn contract-btn"
                            onClick={() => handleDownloadContract(client)}
                            disabled={!client.activeRental}
                          >
                            Contract
                          </button>
                          <button
                            type="button"
                            className="table-btn delete-btn"
                            onClick={() => handleDeleteClient(client._id)}
                            style={{background: '#dc2626', color: 'white'}}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {editingClientId && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-card client-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Update Client</h3>
            <form className="modal-form" onSubmit={handleUpdateClient}>
              <div className="modal-grid">
                <div className="modal-field">
                  <label>Full Name</label>
                  <input
                    name="fullName"
                    type="text"
                    value={editClientForm.fullName}
                    onChange={handleEditClientChange}
                  />
                  {editErrors.fullName && <small className="error-text">{editErrors.fullName}</small>}
                </div>

                <div className="modal-field">
                  <label>Phone Number</label>
                  <input
                    name="phoneNumber"
                    type="text"
                    value={editClientForm.phoneNumber}
                    onChange={handleEditClientChange}
                  />
                  {editErrors.phoneNumber && <small className="error-text">{editErrors.phoneNumber}</small>}
                </div>

                <div className="modal-field">
                  <label>License Number</label>
                  <input
                    name="drivingLicenseNumber"
                    type="text"
                    value={editClientForm.drivingLicenseNumber}
                    onChange={handleEditClientChange}
                  />
                  {editErrors.drivingLicenseNumber && <small className="error-text">{editErrors.drivingLicenseNumber}</small>}
                </div>

                <div className="modal-field">
                  <label>National ID / CIN</label>
                  <input
                    name="nationalId"
                    type="text"
                    value={editClientForm.nationalId}
                    onChange={handleEditClientChange}
                  />
                  {editErrors.nationalId && <small className="error-text">{editErrors.nationalId}</small>}
                </div>

                <div className="modal-field modal-field-full">
                  <label>Address</label>
                  <textarea
                    name="address"
                    rows="4"
                    value={editClientForm.address}
                    onChange={handleEditClientChange}
                  />
                  {editErrors.address && <small className="error-text">{editErrors.address}</small>}
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn-secondary" onClick={closeEditModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rent Modal */}
      {rentingClientId && (
        <div className="modal-overlay" onClick={closeRentModal}>
          <div className="modal-card client-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Rent Car - {rentingClient?.fullName}</h3>
            <form className="modal-form" onSubmit={handleConfirmRental}>
              <div className="modal-grid">
                <div className="modal-field">
                  <label>Select Car</label>
                  <select
                    name="carId"
                    value={rentalForm.carId}
                    onChange={handleRentalChange}
                  >
                    <option value="">Choose a car</option>
                    {availableCars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.brand} {car.model} - {car.pricePerDay} MAD/day
                      </option>
                    ))}
                  </select>
                  {rentErrors.carId && <small className="error-text">{rentErrors.carId}</small>}
                </div>

                <div className="modal-field">
                  <label>Price (MAD)</label>
                  <input
                    name="price"
                    type="number"
                    value={rentalForm.price}
                    onChange={handleRentalChange}
                    placeholder="500"
                  />
                  {rentErrors.price && <small className="error-text">{rentErrors.price}</small>}
                </div>

                <div className="modal-field">
                  <label>Mileage (km)</label>
                  <input
                    name="mileage"
                    type="number"
                    value={rentalForm.mileage}
                    onChange={handleRentalChange}
                    placeholder="12000"
                  />
                  {rentErrors.mileage && <small className="error-text">{rentErrors.mileage}</small>}
                </div>

                <div className="modal-field">
                  <label>Start Date</label>
                  <input
                    name="startDate"
                    type="date"
                    value={rentalForm.startDate}
                    onChange={handleRentalChange}
                  />
                  {rentErrors.startDate && <small className="error-text">{rentErrors.startDate}</small>}
                </div>

                <div className="modal-field">
                  <label>End Date</label>
                  <input
                    name="endDate"
                    type="date"
                    value={rentalForm.endDate}
                    onChange={handleRentalChange}
                  />
                  {rentErrors.endDate && <small className="error-text">{rentErrors.endDate}</small>}
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">Confirm Rental</button>
                <button type="button" className="btn-secondary" onClick={closeRentModal}>
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

export default Clients;