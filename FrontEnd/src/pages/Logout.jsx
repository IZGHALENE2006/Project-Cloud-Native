import { Link } from "react-router-dom";

function Logout() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Logout Page</h2>
        <p style={{ color: "#64748b" }}>
          Logout logic is not connected yet. It will be added later with backend.
        </p>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
}

export default Logout;
