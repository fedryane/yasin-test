// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// import { initializeDatabase } from "./models/db.js";
// import guestRoutes from "./routes/guestRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.resolve(__dirname, "../.env") });

// const app = express();
// const PORT = process.env.PORT || 5001;

// initializeDatabase()
//   .then(() => {
//     app.use(
//       cors({
//         origin: "http://localhost:3000",
//         credentials: true,
//       })
//     );

//     app.use(express.json());
//     app.use(express.urlencoded({ extended: true }));

//     // API Routes
//     app.use("/api/guests", guestRoutes);
//     app.use("/api/auth", authRoutes);
//     app.use("/api/payments", paymentRoutes);

//     app.get("/", (req, res) => {
//       res.send("Welcome to the Guest Book API!");
//     });

//     app.listen(PORT, () => {
//       console.log(`Backend server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to initialize database:", err);
//     process.exit(1);
//   });

import express from "express";
import cors from "cors";
// import dotenv from "dotenv"; // Remove or conditionalize dotenv for production
import path from "path";
import { fileURLToPath } from "url";

import { initializeDatabase } from "./models/db.js";
import guestRoutes from "./routes/guestRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// const __filename = fileURLToPath(import.meta.url); // Not strictly needed if not using __dirname
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.resolve(__dirname, "../.env") }); // Remove or conditionalize this line

const app = express();
// Vercel sets the PORT environment variable automatically, you don't need to read it here for app.listen
// const PORT = process.env.PORT || 5001; // We won't use app.listen

// --- Database Initialization ---
// We initialize the database, but we don't necessarily need to wait
// for it before exporting the app. Route handlers or middleware that
// depend on the DB should ensure the connection is ready (often handled
// by the DB client/ORM's connection pooling).
initializeDatabase()
  .then(() => {
    console.log("Database initialized successfully.");
    // You could potentially set up DB-dependent routes *here* if needed,
    // but the simpler approach below is often sufficient if your DB client handles pooling.
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    // Consider how to handle requests if the DB fails to initialize.
    // Maybe a health check endpoint could reflect this status.
    // process.exit(1); // Don't exit in serverless environment
  });

// --- Middleware ---
app.use(
  cors({
    // Use environment variable for production origin, fallback for local
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
// These routes should ideally work even if the initial DB connection
// promise hasn't resolved yet, assuming your DB client handles queuing
// or pooling connections gracefully.
app.use("/api/guests", guestRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// --- Basic Route ---
app.get("/", (req, res) => {
  res.send("Welcome to the Guest Book API!");
});

// --- Vercel Export ---
// REMOVE the app.listen block:
/*
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
*/

// EXPORT the Express app instance for Vercel
export default app;
