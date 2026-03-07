import { Link } from "react-router-dom";

function AuthLayout({ title, subtitle, children, linkText, linkTo, linkLabel }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>

        {children}

        <p className="auth-link-text">
          {linkText} <Link to={linkTo}>{linkLabel}</Link>
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;
