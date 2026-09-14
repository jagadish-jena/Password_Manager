import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import {
  clerkMiddleware,
  getAuth,
} from "@clerk/express";

import Password from "./models/Password.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;



// Middleware

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(clerkMiddleware());



// connect Mongodb

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });



// get passwords

app.get("/api/passwords", async (req, res) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in",
      });
    }

    const passwords = await Password.find({
      userId: userId,
    });

    return res.json(passwords);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch passwords",
    });
  }
});



// Save passwords

app.post("/api/passwords", async (req, res) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in",
      });
    }

    const {
      id,
      site,
      username,
      password,
    } = req.body;

    if (!id || !site || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newPassword = await Password.create({
      id,
      userId,
      site,
      username,
      password,
    });

    return res.status(201).json(newPassword);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save password",
    });
  }
});



// Delete passwords

app.delete("/api/passwords/:id", async (req, res) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in",
      });
    }

    const deletedPassword =
      await Password.findOneAndDelete({
        id: req.params.id,
        userId: userId,
      });

    if (!deletedPassword) {
      return res.status(404).json({
        success: false,
        message: "Password not found",
      });
    }

    return res.json({
      success: true,
      message: "Password deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete password",
    });
  }
});



// Start server

app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});