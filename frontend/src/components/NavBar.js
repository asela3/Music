import React, { useEffect } from "react";
import "./css/NavBar.css";
import axios from "axios";
import { useAuth } from "../context/auth";

const NavBar = () => {
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth({ token: null, user: null });
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="app-header">Music</div>
      <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Logout
          </button>
    </div>
  );
};

export default NavBar;
