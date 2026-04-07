// src/components/Home.jsx

import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Function to handle navigation with authentication check
  const handleNavigation = (path) => {
    if (token) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {/* All styles are included here for a self-contained component */}
      <style>{`
        /* --- Home Page Styles --- */
        :root {
          --primary-color: #4361ee;
          --secondary-color: #3f37c9;
          --accent-color: #f72585;
          --light-bg: #f8f9fa;
          --dark-text: #2b2d42;
          --light-text: #6c757d;
          --white: #ffffff;
          --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.07);
          --shadow-md: 0 10px 15px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Navigation Bar Styles */
        .navbar {
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-sm);
          padding: 1rem 0;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
          transition: var(--transition);
        }
        
        .navbar-brand {
          font-weight: 700;
          font-size: 1.5rem;
          color: #4361ee !important; /* Explicitly set color with !important to ensure visibility */
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        
        .navbar-brand:hover {
          color: #3f37c9 !important; /* Explicitly set hover color */
        }
        
        .nav-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .nav-btn {
          border-radius: 50px;
          padding: 8px 20px;
          font-weight: 600;
          transition: var(--transition);
        }
        
        .nav-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .hero-section {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: var(--white);
          padding: 100px 0;
          position: relative;
          overflow: hidden;
          margin-top: 70px; /* Added to account for fixed navbar */
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('https://source.unsplash.com/random/1600x900/?career,job') center/cover;
          opacity: 0.1;
          z-index: 0;
        }

        .hero-section > .container {
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          animation: fadeInDown 1s ease-out;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 300;
          margin-bottom: 2rem;
          animation: fadeInUp 1s ease-out 0.2s;
          animation-fill-mode: both;
        }

        .search-bar {
          max-width: 700px;
          margin: 0 auto;
          animation: fadeInUp 1s ease-out 0.4s;
          animation-fill-mode: both;
        }

        .search-bar .form-control {
          border: none;
          border-radius: 50px;
          padding: 15px 25px;
          font-size: 1rem;
        }

        .search-bar .btn {
          border-radius: 50px;
          padding: 15px 30px;
          font-weight: 600;
          transition: var(--transition);
        }

        .search-bar .btn:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
        }

        .feature-card {
          border: none;
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          transition: var(--transition);
          height: 100%;
          background: var(--white);
          box-shadow: var(--shadow-sm);
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-lg);
        }

        .feature-icon {
          font-size: 3rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .company-card {
          border: none;
          border-radius: 10px;
          overflow: hidden;
          transition: var(--transition);
          cursor: pointer;
          background: var(--white);
          box-shadow: var(--shadow-sm);
        }

        .company-card:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-md);
        }

        .company-card .card-body {
          padding: 1.5rem;
          font-weight: 600;
          color: var(--dark-text);
        }

        .stats-section h2 {
          font-size: 3rem;
          font-weight: 700;
        }

        .stats-section p {
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cta-section {
          background: linear-gradient(135deg, var(--accent-color) 0%, #b5179e 100%);
          padding: 80px 0;
        }

        .cta-section h2 {
          font-size: 2.5rem;
          font-weight: 700;
        }

        .cta-section .btn {
          border-radius: 50px;
          padding: 15px 40px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: var(--transition);
        }

        .cta-section .btn:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
          color: var(--accent-color);
        }

        /* Promotional Section Styles */
        .promo-section {
          padding: 80px 0;
          background: linear-gradient(to right, #f8f9fa, #e9ecef);
        }

        .promo-card {
          border: none;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: var(--transition);
          height: 100%;
        }

        .promo-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-lg);
        }

        .promo-img {
          height: 200px;
          object-fit: cover;
        }

        .promo-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: var(--accent-color);
          color: white;
          padding: 5px 15px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.8rem;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .hero-subtitle { font-size: 1.2rem; }
          .stats-section h2 { font-size: 2rem; }
          .cta-section h2 { font-size: 1.8rem; }
          .nav-buttons { gap: 0.5rem; }
          .nav-btn { padding: 6px 15px; font-size: 0.9rem; }
        }
      `}</style>

      <div>
        {/* NAVIGATION BAR WITH ONLY LOGIN AND REGISTER BUTTONS */}
        <nav className="navbar">
          <div className="container d-flex justify-content-between align-items-center">
            <a href="#" className="navbar-brand" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
              JobFinder 🚀
            </a>
            <div className="nav-buttons">
              <button className="btn btn-outline-primary nav-btn" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="btn btn-primary nav-btn" onClick={() => navigate("/register")}>
                Register
              </button>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <header className="hero-section">
          <div className="container text-center">
            <h1 className="hero-title">Find Your Dream Job 🚀</h1>
            <p className="hero-subtitle">Explore thousands of opportunities and connect with top companies</p>

            {/* SEARCH BAR */}
            <div className="search-bar input-group">
              <input className="form-control" placeholder="🔎 Skills or Job Title" />
              <input className="form-control" placeholder="📍 Location" />
              <button className="btn btn-warning" onClick={() => navigate("/login")}>
                Search Jobs
              </button>
            </div>

            {/* CONDITIONAL BUTTONS */}
            {!token && (
              <div className="mt-4">
                <button className="btn btn-light btn-lg me-2" onClick={() => navigate("/register")}>
                  Get Started
                </button>
                <button className="btn btn-outline-light btn-lg" onClick={() => navigate("/login")}>
                  Login
                </button>
              </div>
            )}
          </div>
        </header>

        <main>
          {/* PROMOTIONAL SECTION FOR TOP COMPANIES */}
          <section className="promo-section">
            <div className="container">
              <h2 className="text-center fw-bold mb-5">Featured Opportunities at Top Companies</h2>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="promo-card card" onClick={() => navigate("/login")}>
                    <div className="position-relative">
                      <img src="https://source.unsplash.com/random/400x200/?google,office" className="card-img-top promo-img" alt="Google" />
                      <span className="promo-badge">HOT</span>
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">Google</h4>
                      <p className="card-text">500+ Open Positions</p>
                      <p className="text-muted">Software Engineering, Product Management, UX Design & More</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-primary">$120k - $300k</span>
                        <small className="text-muted">Mountain View, CA</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="promo-card card" onClick={() => navigate("/login")}>
                    <div className="position-relative">
                      <img src="https://source.unsplash.com/random/400x200/?microsoft,office" className="card-img-top promo-img" alt="Microsoft" />
                      <span className="promo-badge">NEW</span>
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">Microsoft</h4>
                      <p className="card-text">750+ Open Positions</p>
                      <p className="text-muted">Cloud Engineering, AI Research, Data Science & More</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-primary">$110k - $280k</span>
                        <small className="text-muted">Redmond, WA</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="promo-card card" onClick={() => navigate("/login")}>
                    <div className="position-relative">
                      <img src="https://source.unsplash.com/random/400x200/?amazon,office" className="card-img-top promo-img" alt="Amazon" />
                      <span className="promo-badge">URGENT</span>
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">Amazon</h4>
                      <p className="card-text">1000+ Open Positions</p>
                      <p className="text-muted">AWS, DevOps, Logistics, Business Analysis & More</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-primary">$100k - $250k</span>
                        <small className="text-muted">Seattle, WA</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-5">
                <button className="btn btn-primary btn-lg" onClick={() => navigate("/login")}>
                  View All Opportunities
                </button>
              </div>
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section className="container py-5">
            <h2 className="text-center fw-bold mb-5">Why Choose Us?</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="feature-card card h-100">
                  <div className="feature-icon">🚀</div>
                  <h5>Fast Hiring</h5>
                  <p className="text-muted">Our streamlined process helps you apply and get hired faster than ever.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-card card h-100">
                  <div className="feature-icon">🔒</div>
                  <h5>Secure Platform</h5>
                  <p className="text-muted">Your data and resume are protected with enterprise-grade security.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-card card h-100">
                  <div className="feature-icon">🌍</div>
                  <h5>Top Companies</h5>
                  <p className="text-muted">Connect with industry-leading companies from around the world.</p>
                </div>
              </div>
            </div>
          </section>

          {/* TOP COMPANIES SECTION */}
          <section className="bg-light py-5">
            <div className="container text-center">
              <h3 className="fw-bold mb-4">Top Companies Hiring Now</h3>
              <div className="row g-3">
                {["Google", "Amazon", "Microsoft", "Netflix", "Apple", "Meta"].map((company, i) => (
                  <div className="col-md-2 col-4" key={i}>
                    <div className="company-card card" onClick={() => navigate("/login")}>
                      <div className="card-body">{company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* STATS SECTION */}
          <section className="container py-5 text-center stats-section">
            <h3 className="fw-bold mb-4">Our Impact So Far</h3>
            <div className="row">
              <div className="col-md-4 mb-3">
                <h2 className="text-primary">50,000+</h2>
                <p className="text-muted">Active Jobs</p>
              </div>
              <div className="col-md-4 mb-3">
                <h2 className="text-success">10,000+</h2>
                <p className="text-muted">Partner Companies</p>
              </div>
              <div className="col-md-4 mb-3">
                <h2 className="text-warning">1M+</h2>
                <p className="text-muted">Successful Hires</p>
              </div>
            </div>
          </section>
        </main>

        {/* FINAL CALL TO ACTION */}
        <footer className="cta-section text-white text-center">
          <div className="container">
            <h2 className="fw-bold">Ready to Start Your Journey?</h2>
            <p className="mb-4 fs-5">Join thousands who found their dream job with us.</p>
            {!token && (
              <button className="btn btn-light btn-lg" onClick={() => navigate("/register")}>
                Get Started For Free
              </button>
            )}
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;