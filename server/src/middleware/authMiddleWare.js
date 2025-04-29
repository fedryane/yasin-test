import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// Optional: Import User model if you need to fetch fresh user data here
// import User from '../models/User.js';

// --- Environment Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load .env from root (relative to src/middleware)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const JWT_SECRET = process.env.JWT_SECRET;

// --- JWT Secret Check ---
// Redundant if already checked elsewhere, but safe to keep
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file (middleware check)");
  // Avoid exiting here maybe, let controller handle failure? Or exit is safer.
  process.exit(1);
}

// --- Protect Middleware ---
export const protect = async (req, res, next) => {
  // Make async if fetching user data
  let token;
  const authHeader = req.headers.authorization;

  // Check for Bearer token in Authorization header
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      // Extract token
      token = authHeader.split(" ")[1];

      // Verify token using the secret
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach decoded payload (which includes userId) to the request object
      // Note: decoded.userId should now be the MongoDB _id string
      req.user = decoded;

      // Optional: Fetch full user object from DB if needed downstream
      // Uncomment if you need more than just the ID/email from the token
      // const user = await User.findById(decoded.userId).select('-password'); // Exclude password
      // if (!user) {
      //     return res.status(401).json({ message: "Not authorized, user not found" });
      // }
      // req.user = user; // Replace payload with full user object

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Token verification failed:", error.message);
      // Handle specific JWT errors if needed (e.g., TokenExpiredError)
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Not authorized, token expired" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Not authorized, invalid token" });
      }
      // Generic failure
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token was found in the header
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};
