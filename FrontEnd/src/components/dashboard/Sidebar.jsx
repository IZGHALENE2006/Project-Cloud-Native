import { Link } from "react-router-dom";

function Sidebar() {
  const links = ["Dashboard", "Cars", "Users", "Rentals", "Logout"];

  return (
    <aside className="dashboard-sidebar">
      <h2>CarRent Pro</h2>
      <nav>
        {links.map((link) =>
          link === "Dashboard" ? (
            <a key={link} href="#" className="active" onClick={(e) => e.preventDefault()}>
              {link}
            </a>
          ) : link === "Logout" ? (
            <Link key={link} to="/logout">
              {link}
            </Link>
          ) : (
            <a key={link} href="#" onClick={(e) => e.preventDefault()}>
              {link}
            </a>
          )
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
