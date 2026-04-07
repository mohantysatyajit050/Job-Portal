import { useState, useEffect } from "react";
import DashboardHome from "./DashboardHome";
import PostJob from "./PostJob";
import Applicants from "./Applicants";
import Profile from "./Profile"; // Import Profile component
import api from "../api/api";

function EmployerDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: "",
    email: "",
    role: "",
    isLoading: true,
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/profile/");
        setUserProfile({
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserProfile((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Close sidebar when clicking outside on mobile or desktop
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("employerSidebar");
      const menuButton = document.getElementById("hamburgerMenuButton"); // Give button an ID
      if (
        sidebar &&
        !sidebar.contains(event.target) &&
        !menuButton.contains(event.target) && // Don't close if clicking the button itself
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const handleTabChange = (tabName) => {
    setTab(tabName);
    // Optional: you can decide if you want the sidebar to close when navigating
    // setSidebarOpen(false); 
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout/");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return (
          <DashboardHome
            setSelectedJobId={setSelectedJobId}
            setTab={setTab}
          />
        );

      case "post":
        return <PostJob />;

      case "applicants":
        return <Applicants jobId={selectedJobId} />;

      case "profile":
        return <Profile />; // Add Profile case

      default:
        return null;
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "🏢",
      color: "#4361ee",
    },
    {
      id: "post",
      label: "Post Job",
      icon: "➕",
      color: "#3a0ca3",
    },
    {
      id: "applicants",
      label: "Applicants",
      icon: "👀",
      color: "#7209b7",
    },
    {
      id: "profile",
      label: "Profile",
      icon: "👤",
      color: "#560bad",
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* HAMBURGER MENU BUTTON - VISIBLE ON ALL SCREENS */}
      <button
        id="hamburgerMenuButton" // Added ID for click-outside logic
        className="btn btn-primary"
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 1001,
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span style={{ fontSize: "20px" }}>☰</span>
      </button>

      {/* SIDEBAR - COLLAPSIBLE ON ALL SCREENS */}
      <div
        id="employerSidebar"
        style={{
          width: "280px",
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "30px 20px",
          position: "fixed",
          height: "100vh",
          overflowY: "auto",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1000,
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* USER PROFILE */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
            paddingBottom: "20px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#3498db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 15px",
              fontSize: "32px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            👤
          </div>
          <h5 style={{ margin: "0", fontWeight: "600" }}>
            {userProfile.username || "User"}
          </h5>
          <p
            style={{
              margin: "5px 0 0",
              fontSize: "14px",
              color: "#bdc3c7",
            }}
          >
            {userProfile.role || "Role"}
          </p>
        </div>

        {/* MENU ITEMS */}
        <div>
          <h6
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              color: "#95a5a6",
              marginBottom: "15px",
              letterSpacing: "1px",
            }}
          >
            Main Menu
          </h6>

          {menuItems.map((item) => (
            <button
              key={item.id}
              style={{
                width: "100%",
                padding: "12px 15px",
                marginBottom: "8px",
                backgroundColor: tab === item.id ? item.color : "transparent",
                color: "white",
                border: "none",
                borderRadius: "8px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "16px",
              }}
              onClick={() => {
                handleTabChange(item.id);
                setSidebarOpen(false); // Close sidebar after navigation
              }}
              onMouseOver={(e) => {
                if (tab !== item.id) {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                }
              }}
              onMouseOut={(e) => {
                if (tab !== item.id) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span>{item.label}</span>
              {tab === item.id && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "12px",
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ADDITIONAL MENU SECTION */}
        <div style={{ marginTop: "40px" }}>
          <h6
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              color: "#95a5a6",
              marginBottom: "15px",
              letterSpacing: "1px",
            }}
          >
            Account
          </h6>

          <button
            style={{
              width: "100%",
              padding: "12px 15px",
              marginBottom: "8px",
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              borderRadius: "8px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "16px",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <span style={{ fontSize: "18px" }}>⚙️</span>
            <span>Settings</span>
          </button>

          <button
            style={{
              width: "100%",
              padding: "12px 15px",
              backgroundColor: "transparent",
              color: "#e74c3c",
              border: "1px solid #e74c3c",
              borderRadius: "8px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "16px",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#e74c3c";
              e.target.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#e74c3c";
            }}
            onClick={handleLogout}
          >
            <span style={{ fontSize: "18px" }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* OVERLAY FOR MOBILE & DESKTOP WHEN SIDEBAR IS OPEN */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* UNIFIED CONTENT AREA */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? "280px" : "0", // Push content when sidebar is open
          padding: "20px",
          transition: "margin-left 0.3s ease-in-out",
          overflowX: "hidden",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px 30px",
            borderRadius: "10px",
            marginBottom: "30px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0",
                fontSize: "clamp(20px, 4vw, 24px)", // Responsive font size
                color: "#2c3e50",
                fontWeight: "600",
              }}
            >
              {menuItems.find((item) => item.id === tab)?.label || "Dashboard"}
            </h1>
            <p
              style={{
                margin: "5px 0 0",
                color: "#7f8c8d",
                fontSize: "clamp(12px, 2vw, 14px)", // Responsive font size
              }}
            >
              Welcome back, {userProfile.username || "User"}!
            </p>
          </div>

          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <button
              className="d-none d-lg-block" // Hide Notifications on small screens
              style={{
                backgroundColor: "transparent",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "8px 15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#f8f9fa";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <span>🔔</span>
              <span>Notifications</span>
            </button>

            {/* CLICKABLE PROFILE LOGO */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#3498db",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.3s",
              }}
              onClick={() => handleTabChange("profile")} // <-- CLICK HANDLER ADDED
              title="Go to Profile" // Tooltip for better UX
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              <span style={{ fontSize: "18px" }}>👤</span>
            </div>
          </div>
        </div>

        {/* DYNAMIC CONTENT */}
        <div>{renderContent()}</div>
      </div>
    </div>
  );
}

export default EmployerDashboard;