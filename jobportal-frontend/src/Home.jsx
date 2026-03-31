import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // ✅ check login

  return (
    <div>

      {/* 🔥 HERO SECTION */}
      <div className="bg-light py-5">
        <div className="container text-center">

          <h1 className="fw-bold display-5">
            Find Your Dream Job 🚀
          </h1>

          <p className="text-muted fs-5">
            Explore thousands of jobs and connect with top companies
          </p>

          {/* 🔍 SEARCH BAR */}
          <div className="row justify-content-center mt-4 g-2">

            <div className="col-md-4">
              <input
                className="form-control form-control-lg"
                placeholder="🔎 Skills (e.g. React, Python)"
              />
            </div>

            <div className="col-md-3">
              <input
                className="form-control form-control-lg"
                placeholder="📍 Location"
              />
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={() => navigate("/login")}
              >
                Search
              </button>
            </div>

          </div>

          {/* ✅ CONDITIONAL BUTTONS */}
          {!token && (
            <div className="mt-4">
              <button
                className="btn btn-success btn-lg me-2"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>

              <button
                className="btn btn-outline-primary btn-lg"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 🔥 FEATURES */}
      <div className="container py-5">

        <h2 className="text-center fw-bold mb-4">
          Why Choose Us?
        </h2>

        <div className="row text-center g-4">

          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded bg-white h-100">
              <h5>🚀 Fast Hiring</h5>
              <p className="text-muted">
                Apply and get hired faster with top companies.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded bg-white h-100">
              <h5>🔒 Secure Platform</h5>
              <p className="text-muted">
                Your data and resume are safe with us.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded bg-white h-100">
              <h5>🌍 Top Companies</h5>
              <p className="text-muted">
                Connect with leading companies worldwide.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 🔥 TOP COMPANIES */}
      <div className="bg-light py-5">
        <div className="container text-center">

          <h3 className="fw-bold mb-4">
            Top Companies Hiring
          </h3>

          <div className="row g-3">

            {["Google", "Amazon", "Infosys", "TCS"].map((c, i) => (
              <div className="col-md-3" key={i}>
                <div
                  className="card shadow-sm border-0 h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  <div className="card-body d-flex align-items-center justify-content-center fw-bold">
                    {c}
                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>

      {/* 🔥 STATS */}
      <div className="container py-5 text-center">

        <h3 className="fw-bold mb-4">
          Our Impact
        </h3>

        <div className="row">

          <div className="col-md-4 mb-3">
            <h2 className="fw-bold text-primary">50,000+</h2>
            <p className="text-muted">Jobs</p>
          </div>

          <div className="col-md-4 mb-3">
            <h2 className="fw-bold text-success">10,000+</h2>
            <p className="text-muted">Companies</p>
          </div>

          <div className="col-md-4 mb-3">
            <h2 className="fw-bold text-warning">1M+</h2>
            <p className="text-muted">Users</p>
          </div>

        </div>
      </div>

      {/* 🔥 FINAL CTA */}
      <div className="bg-primary text-white text-center py-5">

        <h2 className="fw-bold">Start Your Career Today</h2>

        <p className="mb-4">
          Join thousands of professionals finding jobs daily.
        </p>

        {/* ✅ HIDE BUTTON WHEN LOGGED IN */}
        {!token && (
          <button
            className="btn btn-light btn-lg"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        )}

      </div>

    </div>
  );
}

export default Home;