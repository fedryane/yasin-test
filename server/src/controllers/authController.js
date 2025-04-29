import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Import Mongoose User model
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// --- Environment Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load .env from root (relative to src/controllers)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const JWT_SECRET = process.env.JWT_SECRET;

// --- JWT Secret Check ---
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1);
}

// --- Login Handler ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Basic Input Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user by email using Mongoose
    const user = await User.findOne({ email: email.toLowerCase() }); // Search using lowercase email

    // Check if user exists
    if (!user) {
      console.log(`Login attempt failed: User not found - ${email}`);
      // Generic message for security
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    // Check if passwords match
    if (!isMatch) {
      console.log(`Login attempt failed: Invalid password - ${email}`);
      // Generic message for security
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // User authenticated, create JWT payload
    const payload = {
      userId: user._id, // Use MongoDB's _id
      email: user.email,
      // Add other relevant non-sensitive info if needed (e.g., role)
    };

    // Sign the JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // Or use a longer duration like '1d'

    console.log(`Login successful: ${email}`);
    // Send token back to the client
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        // Optionally send back some user info (excluding password)
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login process" });
  }
};
