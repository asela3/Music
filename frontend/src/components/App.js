import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import NavBar from "./NavBar";

import { AuthProvider } from "../context/auth";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import ActivationPage from "./ActivationPage";
import axios from "axios";

const App = () => {
axios.defaults.baseURL = "https://music-backend-m1c2.onrender.com";
axios.defaults.headers.post["Content_Type"]  = "application/json";

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activation/:token" element={<ActivationPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
