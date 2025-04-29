// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import mongoose from "mongoose"; // Import mongoose for event listeners

// // Import the new DB connection function
// import connectDB from "./config/db.js"; // Correct path to config

// // Import routes
// import guestRoutes from "./routes/guestRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";

// // --- Environment Setup ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load .env from the root directory (relative to src/server.js)
// // dotenv is likely already loaded by db.js, but loading again is safe
// dotenv.config({ path: path.resolve(__dirname, "../.env") });

// // --- Connect to Database ---
// // Call the function exported from db.js to establish MongoDB connection
// connectDB();

// // --- Express App Setup ---
// const app = express();
// const PORT = process.env.PORT || 5001; // Default to 5001 if PORT not in .env

// // --- Middleware ---
// // CORS configuration
// app.use(
//   cors({
//     // Best practice: Use an environment variable for the origin
//     origin: process.env.CORS_ORIGIN || "http://localhost:3000",
//     credentials: true, // Allow cookies/authorization headers
//   })
// );

// // Body Parsing Middleware (built into Express)
// app.use(express.json()); // Parses incoming requests with JSON payloads
// app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads

// // --- API Routes ---
// app.use("/api/auth", authRoutes);
// app.use("/api/guests", guestRoutes);
// app.use("/api/payments", paymentRoutes);

// // --- Root Route ---
// app.get("/", (req, res) => {
//   res.send("Welcome to the Guest Book API (MongoDB Version)!");
// });

// // --- Error Handling Middleware (Optional but Recommended) ---
// // Place after all routes
// app.use((err, req, res, next) => {
//   console.error("Unhandled Error:", err.stack);
//   res.status(err.status || 500).json({
//     message: err.message || "An unexpected server error occurred.",
//     // Optionally include stack trace in development
//     // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   });
// });

// // --- Start Server ---
// // Mongoose handles connection buffering, so usually okay to start immediately.
// // The connectDB function handles critical connection errors on startup.
// const server = app.listen(PORT, () => {
//   console.log(`Backend server running on http://localhost:${PORT}`);
// });

// // --- Handle Mongoose Connection Events After Initial Connection ---
// mongoose.connection.on("error", (err) => {
//   console.error("Mongoose runtime connection error:", err);
//   // Consider more robust error handling depending on the error type
// });

// mongoose.connection.on("disconnected", () => {
//   console.warn("Mongoose disconnected.");
//   // You might want to implement reconnection logic here if needed
// });

// // --- Graceful Shutdown ---
// process.on("SIGINT", async () => {
//   console.log("SIGINT received. Closing HTTP server and MongoDB connection...");
//   server.close(async () => {
//     // Close HTTP server first
//     console.log("HTTP server closed.");
//     await mongoose.connection.close(false); // Close MongoDB connection
//     console.log("MongoDB connection closed.");
//     process.exit(0); // Exit gracefully
//   });
// });

// process.on("SIGTERM", async () => {
//   console.log("SIGTERM received. Closing HTTP server and MongoDB connection...");
//   server.close(async () => {
//     console.log("HTTP server closed.");
//     await mongoose.connection.close(false);
//     console.log("MongoDB connection closed.");
//     process.exit(0);
//   });
// });

// READY TO DEPLOY TO VERCEL

// server/src/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import guestRoutes from "./routes/guestRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// --- Environment Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") }); // Load .env from root

// --- Connect to Database ---
connectDB(); // Establish MongoDB connection on startup

// --- Express App Setup ---
const app = express();

// --- Middleware ---
app.use(
  cors({
    // IMPORTANT FOR DEPLOYMENT: Use environment variable for production origin
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
// Ensure ALL your routes are defined here
app.use("/api/auth", authRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/payments", paymentRoutes);

// --- Optional Root API Route (Good for health checks) ---
app.get("/api", (req, res) => {
  res.send("Welcome to the Guest Book API (Running on Vercel)!");
});

// --- IMPORTANT: Export the app for Vercel ---
// --- REMOVE or COMMENT OUT app.listen() ---
/*
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
// ... (remove server setup and graceful shutdown related to app.listen)
*/

export default app; // Export the configured Express app
