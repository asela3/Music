import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CircularProgress } from '@mui/material';


import { useAuth } from "../context/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const location = useLocation();
  let fromLS = localStorage.getItem("auth");

  useEffect(() => {
    if (fromLS) {
      navigate("/");
    }
  }, [fromLS]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const { data } = await axios.post("/login", {
        email,
        password,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({ ...auth, token: data.token, user: data.user });
        toast.success("Login successful");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Try again");
    }
    finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <Toaster />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            width: "400px",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Login</h2>
          {loading && <Loader />}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="email" style={{ marginBottom: "5px" }}>
                Email address*
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                style={{
                  width: "90%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="password" style={{ marginBottom: "5px" }}>
                Password*
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                style={{
                  width: "90%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <p>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "#007bff" }}>
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
