import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { DATABASE } from "./config.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";

const app = express();

// db
mongoose.set("strictQuery", false);
mongoose
  .connect(DATABASE)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("Error", err));

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: ".env",
  });
}

// routes middleware
app.use("/api", authRoutes);

app.listen(8000, () => console.log("server running at 8000 port"));
