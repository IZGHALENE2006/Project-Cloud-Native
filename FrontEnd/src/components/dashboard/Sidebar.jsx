import { NavLink } from "react-router-dom";

const links = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Cars", to: "/cars/add" },
  { label: "Clients", to: "/clients/add" },
];

function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <h2>CarRent Pro</h2>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <NavLink to="/logout" className="sidebar-logout">
        Logout
      </NavLink>
    </aside>
  );
}

export default Sidebar;
