import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [scrollY, setScrollY] = useState(0);
  const [countersVisible, setCountersVisible] = useState(false);
  const statsRef = useRef(null);

  // 🔥 Scroll + Counter logic (kept from your code)
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        const isVisible =
          rect.top < window.innerHeight && rect.bottom >= 0;

        if (isVisible && !countersVisible) {
          setCountersVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [countersVisible]);

  // 🔥 Redirect to login
  const goToLogin = () => {
    navigate("/login");
  };
  const goToRegister = () => {
  navigate("/register");
};

  // 🔥 Smooth scroll (optional)
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home">

      {/* 🔥 SIMPLE HEADER (NO NAV MENU) */}
      <div className="topbar">
        <h2 className="logo">JobPortal</h2>

        <div className="auth-buttons">
          <button className="login-btn" onClick={goToLogin}>
            Login
          </button>
          <button className="register-btn" onClick={goToRegister}>
            Register
          </button>
        </div>
      </div>

      {/* 🔥 HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Find your dream job <span className="highlight">🚀</span>
          </h1>
          <p>
            Explore thousands of jobs and connect with top companies.
          </p>

          {/* 🔥 SEARCH BAR */}
          <div className="search-bar">
            <input placeholder="Enter skills / designation" />
            <input placeholder="Location" />
            <button onClick={goToLogin}>Search</button>
          </div>

          {/* 🔥 CATEGORY BUTTONS */}
          <div className="categories">
            <button onClick={goToLogin}>Remote</button>
            <button onClick={goToLogin}>MNC</button>
            <button onClick={goToLogin}>Engineering</button>
            <button onClick={goToLogin}>Startup</button>
            <button onClick={goToLogin}>Fresher</button>
          </div>

          {/* 🔥 HERO BUTTONS */}
          <div className="hero-buttons">
            <button onClick={goToLogin} className="primary-btn">
              Get Started
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="secondary-btn"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* 🔥 ABOUT SECTION */}
      <section id="about" className="about">
        <div className="section-header">
          <h2>Why Choose Our Job Portal?</h2>
          <div className="divider"></div>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p>
              We connect job seekers with companies efficiently. Build your
              career and hire the best talent easily.
            </p>
            <button onClick={goToLogin} className="primary-btn">
              Explore Opportunities
            </button>
          </div>
        </div>
      </section>

      {/* 🔥 COMPANY SECTION */}
      <section className="companies">
        <h2>Top companies hiring now</h2>

        <div className="company-grid">
          <div className="company-card" onClick={goToLogin}>
            Google
          </div>
          <div className="company-card" onClick={goToLogin}>
            Amazon
          </div>
          <div className="company-card" onClick={goToLogin}>
            Infosys
          </div>
          <div className="company-card" onClick={goToLogin}>
            TCS
          </div>
        </div>
      </section>

      {/* 🔥 CTA SECTION */}
      <section className="cta">
        <div className="cta-content">
          <h2>Start Your Journey Today</h2>
          <p>Login to explore jobs</p>

          <button onClick={goToLogin} className="primary-btn">
            Login to Continue
          </button>
        </div>
      </section>

      {/* 🔥 STATS SECTION */}
      <section id="stats" ref={statsRef} className="stats">
        <div className="stat-card">
          <div className="stat-number">
            {countersVisible ? "50000+" : "0"}
          </div>
          <div className="stat-label">Job Listings</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">
            {countersVisible ? "10000+" : "0"}
          </div>
          <div className="stat-label">Companies</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">
            {countersVisible ? "1000000+" : "0"}
          </div>
          <div className="stat-label">Users</div>
        </div>
      </section>

    </div>
  );
}

export default Home;