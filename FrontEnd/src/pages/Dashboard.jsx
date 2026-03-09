import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import CarCard from "../components/dashboard/CarCard";
import { Link } from "react-router-dom";
import { statsData, carsData } from "../data/dashboardData";
import "../styles/dashboard.css";

function Dashboard() {
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
          {carsData.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;
