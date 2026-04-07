// src/components/Footer.jsx

import { useState } from "react";

function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with email: ${email}`);
      setEmail(""); // Clear the input field after submission
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <>
      {/* Custom Styles for the Footer */}
      <style>{`
        .custom-footer {
          background-color: #0d1117; /* A darker, richer black */
          color: #c9d1d9;
          padding-top: 3rem;
          padding-bottom: 1.5rem;
          border-top: 1px solid #30363d;
        }
        .custom-footer h5 {
          color: #f0f6fc;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .custom-footer .footer-link {
          color: #8b949e;
          text-decoration: none;
          display: block;
          padding: 0.25rem 0;
          transition: color 0.2s ease;
        }
        .custom-footer .footer-link:hover {
          color: #58a6ff;
        }
        .custom-footer .social-icon {
          font-size: 1.5rem;
          color: #8b949e;
          margin-right: 1rem;
          transition: color 0.2s ease;
        }
        .custom-footer .social-icon:hover {
          color: #ffffff;
        }
        .custom-footer .newsletter-form .form-control {
          background-color: #21262d;
          border: 1px solid #30363d;
          color: #c9d1d9;
        }
        .custom-footer .newsletter-form .form-control:focus {
          background-color: #21262d;
          border-color: #58a6ff;
          box-shadow: 0 0 0 0.2rem rgba(88, 166, 255, 0.25);
          color: #c9d1d9;
        }
        .custom-footer .newsletter-form .btn {
          background-color: #238636;
          border-color: #238636;
          font-weight: 600;
        }
        .custom-footer .newsletter-form .btn:hover {
          background-color: #2ea043;
          border-color: #2ea043;
        }
        .custom-footer .footer-bottom {
          border-top: 1px solid #30363d;
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          text-align: center;
          color: #8b949e;
        }
      `}</style>

      <footer className="custom-footer">
        <div className="container">
          <div className="row">
            {/* Column 1: About & Social */}
            <div className="col-lg-4 col-md-6 mb-4">
              <h5>JobPortal</h5>
              <p>
                Your premier destination for finding the perfect job or the ideal candidate. We connect talent with opportunity.
              </p>
              <div className="mt-3">
                {/* You can replace these with actual icons from react-icons */}
                <a href="#" className="social-icon">📘</a>
                <a href="#" className="social-icon">🐦</a>
                <a href="#" className="social-icon">💼</a>
                <a href="#" className="social-icon">📷</a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-lg-4 col-md-6 mb-4">
              <h5>Quick Links</h5>
              <a href="/jobs" className="footer-link">Browse Jobs</a>
              <a href="/about" className="footer-link">About Us</a>
              <a href="/contact" className="footer-link">Contact Us</a>
              <a href="/privacy" className="footer-link">Privacy Policy</a>
              <a href="/terms" className="footer-link">Terms of Service</a>
            </div>

            {/* Column 3: Newsletter */}
            <div className="col-lg-4 col-md-12 mb-4">
              <h5>Stay Updated</h5>
              <p>Subscribe to our newsletter to get the latest job listings and news.</p>
              <form className="newsletter-form mt-3" onSubmit={handleNewsletterSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button className="btn btn-success" type="submit">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="footer-bottom">
            <small>&copy; {new Date().getFullYear()} JobPortal. All Rights Reserved.</small>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;