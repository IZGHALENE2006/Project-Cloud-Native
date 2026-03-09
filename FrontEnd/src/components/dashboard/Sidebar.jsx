import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <h2>CarRent Pro</h2>

      <nav>
        <Link to="/" className="active">
          Dashboard
        </Link>

        <Link to="/cars">
          Cars
        </Link>

        <Link to="/users">
          Users
        </Link>

        <Link to="/rentals">
          Rentals
        </Link>

        <Link to="/logout">
          Logout
        </Link>
      </nav>

    </aside>
  );
}

export default Sidebar;