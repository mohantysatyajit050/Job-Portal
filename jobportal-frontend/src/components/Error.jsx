import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="container text-center mt-5">

      <h1 className="display-3 fw-bold text-danger">404</h1>

      <h3 className="mb-3">Page Not Found</h3>

      <p className="text-muted">
        The page you are looking for does not exist.
      </p>

      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>

    </div>
  );
}

export default ErrorPage;