function CarCard({ car, onUpdate, onDelete }) {
  const statusClass = car.status.toLowerCase().replace(" ", "-");

  return (
    <article className="car-card">
      <img src={`http://localhost:1000/uploads/${car.image}`} alt={car.model} />
      <div className="car-card-body">
        <h4>{car.model}</h4>
        <p>Brand: {car.brand}</p>
        <p>Car Number: {car.carNumber}</p>
        <p>Price/Day: {car.pricePerDay} MAD</p>
        <span className={`status-badge ${statusClass}`}>{car.status}</span>
        <div className="car-card-actions">
          <button type="button" className="car-btn update" onClick={onUpdate}>
            Update
          </button>
          <button type="button" className="car-btn delete" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default CarCard;
