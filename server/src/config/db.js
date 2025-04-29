import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js"; // Import User model

// --- Environment Setup ---
// Calculate __dirname relative to the current module file
const __filename = fileURLToPath(import.meta.url); // Gets the full path to this file (db.js)
const __dirname = path.dirname(__filename); // Gets the directory name (src/config)

// Load .env from the project root (two levels up from src/config)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// --- Configuration Variables ---
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// --- Essential Variable Checks ---
if (!MONGODB_URI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in .env file.");
  process.exit(1); // Exit if DB connection string is missing
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.warn("Warning: ADMIN_EMAIL or ADMIN_PASSWORD not defined in .env. Default admin creation skipped.");
}

// --- Database Connection Function ---
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected Successfully.");

    // Attempt to create admin user after connection (only if configured)
    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      await createAdminUser();
    }
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    // Exit process with failure if initial connection fails
    process.exit(1);
  }
};

// --- Admin User Creation ---
const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: ADMIN_EMAIL });

    if (!adminExists) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

      const admin = new User({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        // Add other fields if your User model has them (e.g., role: 'admin')
      });

      await admin.save();
      console.log(`Admin user created: ${ADMIN_EMAIL}`);
    } else {
      console.log(`Admin user ${ADMIN_EMAIL} already exists.`);
    }
  } catch (error) {
    // Log error but don't crash the server, maybe the connection is temporary
    console.error("Error during admin user creation/check:", error.message);
  }
};

// --- Export Connection Function ---
export default connectDB;
