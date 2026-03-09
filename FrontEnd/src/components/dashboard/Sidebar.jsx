import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Cars", to: "/cars/add" },
    { label: "Users", to: "#" },
    { label: "Rentals", to: "#" },
    { label: "Logout", to: "/logout" },
  ];

  return (
    <aside className="dashboard-sidebar">
      <h2>CarRent Pro</h2>
      <nav>
        {links.map((link) =>
          link.to === "#" ? (
            <a key={link.label} href="#" onClick={(e) => e.preventDefault()}>
              {link.label}
            </a>
          ) : (
            <NavLink key={link.label} to={link.to} className={({ isActive }) => (isActive ? "active" : "")}>
              {link.label}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
