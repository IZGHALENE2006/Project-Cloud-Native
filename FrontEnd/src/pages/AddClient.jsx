import { useState } from "react";
import { jsPDF } from "jspdf";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getCars, saveCars } from "../data/carsStorage";
import { getClients, saveClients } from "../data/clientsStorage";
import "../styles/dashboard.css";
import "../styles/addClient.css";

const initialClientForm = {
  fullName: "",
  phoneNumber: "",
  licenseNumber: "",
  cin: "",
  address: "",
};

const initialRentalForm = {
  carId: "",
  startDate: "",
  endDate: "",
  price: "",
  mileage: "",
};

const initialReturnForm = {
  returnMileage: "",
  carCondition: "",
};

const initialEditClientForm = {
  fullName: "",
  phoneNumber: "",
  licenseNumber: "",
  cin: "",
  address: "",
};

function AddClient() {
  const [clientForm, setClientForm] = useState(initialClientForm);
  const [clients, setClients] = useState(getClients);
  const [cars, setCars] = useState(getCars);
  const [formErrors, setFormErrors] = useState({});
  const [rentErrors, setRentErrors] = useState({});
  const [rentingClientId, setRentingClientId] = useState(null);
  const [returningClientId, setReturningClientId] = useState(null);
  const [rentalForm, setRentalForm] = useState(initialRentalForm);
  const [returnForm, setReturnForm] = useState(initialReturnForm);
  const [returnErrors, setReturnErrors] = useState({});
  const [editingClientId, setEditingClientId] = useState(null);
  const [editClientForm, setEditClientForm] = useState(initialEditClientForm);
  const [editErrors, setEditErrors] = useState({});

  const availableCars = cars.filter((car) => car.status === "Available");
  const rentingClient = clients.find((client) => client.id === rentingClientId);
  const returningClient = clients.find((client) => client.id === returningClientId);
  const editingClient = clients.find((client) => client.id === editingClientId);

  const updateClients = (updater) => {
    setClients((prev) => {
      const nextClients = typeof updater === "function" ? updater(prev) : updater;
      saveClients(nextClients);
      return nextClients;
    });
  };

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

  const validateClientForm = () => {
    const nextErrors = {};

    if (!clientForm.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!clientForm.phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required.";
    if (!clientForm.licenseNumber.trim()) {
      nextErrors.licenseNumber = "Driving license number is required.";
    }
    if (!clientForm.cin.trim()) nextErrors.cin = "National ID / CIN is required.";
    if (!clientForm.address.trim()) nextErrors.address = "Address is required.";

    return nextErrors;
  };

  const validateEditClientForm = () => {
    const nextErrors = {};

    if (!editClientForm.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!editClientForm.phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required.";
    if (!editClientForm.licenseNumber.trim()) {
      nextErrors.licenseNumber = "Driving license number is required.";
    }
    if (!editClientForm.cin.trim()) nextErrors.cin = "National ID / CIN is required.";
    if (!editClientForm.address.trim()) nextErrors.address = "Address is required.";

    return nextErrors;
  };

  const validateRentalForm = () => {
    const nextErrors = {};

    if (!rentalForm.carId) nextErrors.carId = "Please select a car.";
    if (!rentalForm.startDate) nextErrors.startDate = "Start date is required.";
    if (!rentalForm.endDate) nextErrors.endDate = "End date is required.";
    if (!rentalForm.price) nextErrors.price = "Price is required.";
    if (!rentalForm.mileage) nextErrors.mileage = "Mileage is required.";

    if (
      rentalForm.startDate &&
      rentalForm.endDate &&
      new Date(rentalForm.endDate) < new Date(rentalForm.startDate)
    ) {
      nextErrors.endDate = "End date must be after start date.";
    }

    return nextErrors;
  };

  const resetClientForm = () => {
    setClientForm(initialClientForm);
    setFormErrors({});
  };

  const handleAddClient = (event) => {
    event.preventDefault();

    const nextErrors = validateClientForm();
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    const newClient = {
      id: Date.now(),
      fullName: clientForm.fullName.trim(),
      phoneNumber: clientForm.phoneNumber.trim(),
      licenseNumber: clientForm.licenseNumber.trim(),
      cin: clientForm.cin.trim(),
      address: clientForm.address.trim(),
      activeRental: null,
      canDownloadContract: false,
      lastReturn: null,
    };

    updateClients((prev) => [newClient, ...prev]);
    resetClientForm();
  };

  const openRentModal = (client) => {
    setRentingClientId(client.id);
    setRentalForm(initialRentalForm);
    setRentErrors({});
  };

  const openEditModal = (client) => {
    setEditingClientId(client.id);
    setEditClientForm({
      fullName: client.fullName || "",
      phoneNumber: client.phoneNumber || "",
      licenseNumber: client.licenseNumber || "",
      cin: client.cin || "",
      address: client.address || "",
    });
    setEditErrors({});
  };

  const closeEditModal = () => {
    setEditingClientId(null);
    setEditClientForm(initialEditClientForm);
    setEditErrors({});
  };

  const closeRentModal = () => {
    setRentingClientId(null);
    setRentalForm(initialRentalForm);
    setRentErrors({});
  };

  const openReturnModal = (client) => {
    setReturningClientId(client.id);
  };

  const closeReturnModal = () => {
    setReturningClientId(null);
    setReturnForm(initialReturnForm);
    setReturnErrors({});
  };

  const handleReturnChange = (event) => {
    const { name, value } = event.target;
    setReturnForm((prev) => ({ ...prev, [name]: value }));
    setReturnErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateReturnForm = () => {
    const nextErrors = {};

    if (!returnForm.returnMileage) {
      nextErrors.returnMileage = "Return mileage is required.";
    }

    if (!returnForm.carCondition.trim()) {
      nextErrors.carCondition = "Car condition is required.";
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

    const selectedCar = cars.find((car) => String(car.id) === rentalForm.carId);
    if (!selectedCar) {
      setRentErrors({ carId: "Selected car is not available anymore." });
      return;
    }

    const rentalDetails = {
      carId: selectedCar.id,
      carLabel: `${selectedCar.brand} ${selectedCar.model}`,
      startDate: rentalForm.startDate,
      endDate: rentalForm.endDate,
      price: rentalForm.price,
      mileage: rentalForm.mileage,
      status: "Active",
    };

    const nextCars = cars.map((car) =>
      car.id === selectedCar.id ? { ...car, status: "Rented" } : car
    );

    setCars(nextCars);
    saveCars(nextCars);
    updateClients((prev) =>
      prev.map((client) =>
        client.id === rentingClientId
          ? {
              ...client,
              activeRental: rentalDetails,
              canDownloadContract: true,
            }
          : client
      )
    );
    closeRentModal();
  };

  const handleUpdateClient = (event) => {
    event.preventDefault();

    const nextErrors = validateEditClientForm();
    if (Object.keys(nextErrors).length > 0) {
      setEditErrors(nextErrors);
      return;
    }

    updateClients((prev) =>
      prev.map((client) =>
        client.id === editingClientId
          ? {
              ...client,
              fullName: editClientForm.fullName.trim(),
              phoneNumber: editClientForm.phoneNumber.trim(),
              licenseNumber: editClientForm.licenseNumber.trim(),
              cin: editClientForm.cin.trim(),
              address: editClientForm.address.trim(),
            }
          : client
      )
    );

    closeEditModal();
  };

  const handleConfirmReturn = () => {
    if (!returningClient?.activeRental) {
      closeReturnModal();
      return;
    }

    const nextErrors = validateReturnForm();
    if (Object.keys(nextErrors).length > 0) {
      setReturnErrors(nextErrors);
      return;
    }

    const nextCars = cars.map((car) =>
      car.id === returningClient.activeRental.carId ? { ...car, status: "Available" } : car
    );

    setCars(nextCars);
    saveCars(nextCars);
    updateClients((prev) =>
      prev.map((client) =>
        client.id === returningClientId
          ? {
              ...client,
              lastReturn: {
                returnMileage: returnForm.returnMileage,
                carCondition: returnForm.carCondition.trim(),
                returnedAt: new Date().toLocaleDateString("fr-MA"),
              },
              activeRental: null,
            }
          : client
      )
    );
    closeReturnModal();
  };

  const handleDownloadContract = (client) => {
    if (!client.canDownloadContract || !client.activeRental) return;

    const contractNumber = `CTR-${client.id}-${client.activeRental.carId}`;
    const generatedAt = new Date().toLocaleDateString("fr-MA");
    const rental = client.activeRental;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 18;
    let cursorY = 20;

    const addLine = (text, options = {}) => {
      const fontSize = options.fontSize || 11;
      const gap = options.gap || 7;
      pdf.setFont("helvetica", options.bold ? "bold" : "normal");
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, pageWidth - margin * 2);

      if (cursorY + lines.length * gap > pageHeight - 20) {
        pdf.addPage();
        cursorY = 20;
      }

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
    addLine(`Permis de conduire: ${client.licenseNumber}`);
    addLine(`CIN: ${client.cin}`);
    addLine(`Adresse: ${client.address}`, { gap: 8 });

    addLine("Informations de Location", { bold: true, fontSize: 14, gap: 8 });
    addLine(`Vehicule: ${rental.carLabel}`);
    addLine(`Date de debut: ${rental.startDate}`);
    addLine(`Date de fin: ${rental.endDate}`);
    addLine(`Prix convenu: ${rental.price} MAD`);
    addLine(`Kilometrage au depart: ${rental.mileage} km`);
    addLine(`Statut: ${rental.status}`, { gap: 8 });

    addLine("Clauses Principales", { bold: true, fontSize: 14, gap: 8 });
    addLine(
      "Le client reconnait avoir recu le vehicule en bon etat apparent et s'engage a le restituer a la date prevue, avec ses documents et accessoires."
    );
    addLine(
      "Le client reste responsable des contraventions, dommages ou frais d'utilisation constates pendant la periode de location selon les conditions appliquees par l'agence."
    );
    addLine(
      "Le present document constitue une simulation de contrat de location au format marocain simplifie, genere depuis l'interface de gestion.",
      { gap: 10 }
    );

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
        <div className="add-client-header">
          <h1>Add Client</h1>
          <p>Create client records and manage simple rental actions from one page.</p>
        </div>

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
                {formErrors.phoneNumber && (
                  <small className="error-text">{formErrors.phoneNumber}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="licenseNumber">Driving License Number</label>
                <input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  value={clientForm.licenseNumber}
                  onChange={handleClientChange}
                  placeholder="DL-123456"
                />
                {formErrors.licenseNumber && (
                  <small className="error-text">{formErrors.licenseNumber}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cin">National ID / CIN</label>
                <input
                  id="cin"
                  name="cin"
                  type="text"
                  value={clientForm.cin}
                  onChange={handleClientChange}
                  placeholder="AB123456"
                />
                {formErrors.cin && <small className="error-text">{formErrors.cin}</small>}
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
              <button type="submit" className="btn-primary">
                Add Client
              </button>
              <button type="button" className="btn-secondary" onClick={resetClientForm}>
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="client-panel">
          <div className="client-table-header">
            <h2>Client List</h2>
            <span>{clients.length} client(s)</span>
          </div>

          <div className="client-table-wrapper">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Driving License Number</th>
                  <th>CIN</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.fullName}</td>
                    <td>{client.phoneNumber}</td>
                    <td>{client.licenseNumber}</td>
                    <td>{client.cin}</td>
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
                          className="table-btn return-btn"
                          onClick={() => openReturnModal(client)}
                          disabled={!client.activeRental}
                        >
                          Return Car
                        </button>
                        <button
                          type="button"
                          className="table-btn contract-btn"
                          onClick={() => handleDownloadContract(client)}
                          disabled={!client.canDownloadContract || !client.activeRental}
                        >
                          Download Contract
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {rentingClient && (
        <div className="modal-overlay" onClick={closeRentModal}>
          <div className="modal-card client-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Rent Car</h3>
            <form className="modal-form" onSubmit={handleConfirmRental}>
              <div className="modal-grid">
                <div className="modal-field">
                  <label htmlFor="carId">Select Car</label>
                  <select
                    id="carId"
                    name="carId"
                    value={rentalForm.carId}
                    onChange={handleRentalChange}
                    disabled={availableCars.length === 0}
                  >
                    <option value="">
                      {availableCars.length === 0 ? "No available cars" : "Choose a car"}
                    </option>
                    {availableCars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.brand} {car.model} - {car.carNumber} - {car.pricePerDay} MAD/day
                      </option>
                    ))}
                  </select>
                  {rentErrors.carId && <small className="error-text">{rentErrors.carId}</small>}
                </div>

                <div className="modal-field">
                  <label htmlFor="price">Price</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={rentalForm.price}
                    onChange={handleRentalChange}
                    placeholder="500"
                  />
                  {rentErrors.price && <small className="error-text">{rentErrors.price}</small>}
                </div>

                <div className="modal-field">
                  <label htmlFor="mileage">Mileage</label>
                  <input
                    id="mileage"
                    name="mileage"
                    type="number"
                    min="0"
                    value={rentalForm.mileage}
                    onChange={handleRentalChange}
                    placeholder="12000"
                  />
                  {rentErrors.mileage && (
                    <small className="error-text">{rentErrors.mileage}</small>
                  )}
                </div>

                <div className="modal-field">
                  <label htmlFor="startDate">Rental Start Date</label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={rentalForm.startDate}
                    onChange={handleRentalChange}
                  />
                  {rentErrors.startDate && (
                    <small className="error-text">{rentErrors.startDate}</small>
                  )}
                </div>

                <div className="modal-field">
                  <label htmlFor="endDate">Rental End Date</label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={rentalForm.endDate}
                    onChange={handleRentalChange}
                  />
                  {rentErrors.endDate && <small className="error-text">{rentErrors.endDate}</small>}
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Confirm Rental
                </button>
                <button type="button" className="btn-secondary" onClick={closeRentModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingClient && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-card client-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Update Client</h3>
            <form className="modal-form" onSubmit={handleUpdateClient}>
              <div className="modal-grid">
                <div className="modal-field">
                  <label htmlFor="editFullName">Full Name</label>
                  <input
                    id="editFullName"
                    name="fullName"
                    type="text"
                    value={editClientForm.fullName}
                    onChange={handleEditClientChange}
                  />
                  {editErrors.fullName && <small className="error-text">{editErrors.fullName}</small>}
                </div>

                <div className="modal-field">
                  <label htmlFor="editPhoneNumber">Phone Number</label>
                  <input
                    id="editPhoneNumber"
                    name="phoneNumber"
                    type="text"
                    value={editClientForm.phoneNumber}
                    onChange={handleEditClientChange}
                  />
                  {editErrors.phoneNumber && (
                    <small className="error-text">{editErrors.phoneNumber}</small>
                  )}
                </div>

                <div className="modal-field">
                  <label htmlFor="editLicenseNumber">Driving License Number</label>
                  <input
                    id="editLicenseNumber"
                    name="licenseNumber"
                    type="text"
                    value={editClientForm.licenseNumber}
                    onChange={handleEditClientChange}
                  />
                  {editErrors.licenseNumber && (
                    <small className="error-text">{editErrors.licenseNumber}</small>
                  )}
                </div>

                <div className="modal-field">
                  <label htmlFor="editCin">National ID / CIN</label>
                  <input
                    id="editCin"
                    name="cin"
                    type="text"
                    value={editClientForm.cin}
                    onChange={handleEditClientChange}
                  />
                  {editErrors.cin && <small className="error-text">{editErrors.cin}</small>}
                </div>

                <div className="modal-field modal-field-full">
                  <label htmlFor="editAddress">Address</label>
                  <textarea
                    id="editAddress"
                    name="address"
                    rows="4"
                    value={editClientForm.address}
                    onChange={handleEditClientChange}
                  />
                  {editErrors.address && <small className="error-text">{editErrors.address}</small>}
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button type="button" className="btn-secondary" onClick={closeEditModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {returningClient && (
        <div className="modal-overlay" onClick={closeReturnModal}>
          <div
            className="modal-card client-modal client-confirmation"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>Return Car</h3>
            <p>
              Confirm the return for <strong>{returningClient.fullName}</strong>
              {returningClient.activeRental ? ` and mark ${returningClient.activeRental.carLabel} as available.` : "."}
            </p>
            <div className="modal-form">
              <div className="modal-grid">
                <div className="modal-field">
                  <label htmlFor="returnMileage">Return Mileage</label>
                  <input
                    id="returnMileage"
                    name="returnMileage"
                    type="number"
                    min="0"
                    value={returnForm.returnMileage}
                    onChange={handleReturnChange}
                    placeholder="12540"
                  />
                  {returnErrors.returnMileage && (
                    <small className="error-text">{returnErrors.returnMileage}</small>
                  )}
                </div>

                <div className="modal-field modal-field-full">
                  <label htmlFor="carCondition">Car Condition</label>
                  <textarea
                    id="carCondition"
                    name="carCondition"
                    rows="4"
                    value={returnForm.carCondition}
                    onChange={handleReturnChange}
                    placeholder="Write any issue, damage, or note about the returned car"
                  />
                  {returnErrors.carCondition && (
                    <small className="error-text">{returnErrors.carCondition}</small>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-primary" onClick={handleConfirmReturn}>
                Confirm Return
              </button>
              <button type="button" className="btn-secondary" onClick={closeReturnModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AddClient;
