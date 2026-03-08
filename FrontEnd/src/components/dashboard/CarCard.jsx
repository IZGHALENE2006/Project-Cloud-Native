function CarCard({ car }) {
  const statusClass = car.status.toLowerCase().replace(" ", "-");

  return (
    <article className="car-card">
      <img src={car.image} alt={car.model} />
      <div className="car-card-body">
        <h4>{car.model}</h4>
        <p>Brand: {car.brand}</p>
        <p>Car Number: {car.carNumber}</p>
        <p>Price/Day: {car.pricePerDay} MAD</p>
        <span className={`status-badge ${statusClass}`}>{car.status}</span>
      </div>
    </article>
  );
}

export default CarCard;
