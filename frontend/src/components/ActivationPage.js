import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ActivationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post("/register", { token });
          console.log(res);
          toast.success("User successfully added");
          navigate("/login");
        } catch (err) {
          if (err) {
            toast.error("Token expired");
            navigate("/register");
          }
        }
      };
      activationEmail();
    }
  }, [token]);

  return (
    <>
      <Toaster />
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></div>
    </>
  );
};

export default ActivationPage;
