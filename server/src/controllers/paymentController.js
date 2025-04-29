import Payment from "../models/Payment.js"; // Import Mongoose Payment model

// --- Create Payment Handler ---
export const createPayment = async (req, res) => {
  const { nama_lengkap, email, nomor_telepon, jumlah_pembayaran, metode_pembayaran } = req.body;

  // Mongoose will handle most validation based on the schema (required, min, type)
  // You could add extra custom validation here if needed

  try {
    // Create a new payment document
    const newPayment = new Payment({
      nama_lengkap,
      email,
      nomor_telepon,
      jumlah_pembayaran, // Mongoose will attempt to cast to Number
      metode_pembayaran,
    });

    // Save the document
    const savedPayment = await newPayment.save();

    // Respond with success and the payment ID (or full object)
    res.status(201).json({ message: "Payment initiated successfully", payment: savedPayment });
  } catch (error) {
    console.error("Error creating payment:", error);
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      // Check specifically for the minimum amount error if needed
      if (error.errors["jumlah_pembayaran"]?.kind === "min") {
        return res.status(400).json({ message: "Invalid payment amount (minimum Rp 10.000)" });
      }
      return res.status(400).json({ message: `Validation Failed: ${messages.join(", ")}` });
    }
    // Handle potential cast errors (e.g., non-numeric amount)
    if (error.name === "CastError" && error.path === "jumlah_pembayaran") {
      return res.status(400).json({ message: "Invalid payment amount format, must be a number." });
    }
    // Generic server error
    res.status(500).json({ message: "Failed to initiate payment due to server error" });
  }
};

// --- Get Payment by ID Handler ---
export const getPayment = async (req, res) => {
  const { id } = req.params;

  // Validate if ID is a valid MongoDB ObjectId format (optional but good practice)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Payment ID format" });
  }

  try {
    // Find payment by ID using Mongoose
    const payment = await Payment.findById(id);

    // Check if payment was found
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Respond with the payment details
    res.status(200).json(payment);
  } catch (error) {
    console.error(`Error fetching payment with ID ${id}:`, error);
    res.status(500).json({ message: "Failed to fetch payment details due to server error" });
  }
};

// --- Get All Payments Handler ---
export const getPayments = async (req, res) => {
  try {
    // Fetch all payments, sort by timestamp descending
    const payments = await Payment.find().sort({ timestamp: -1 });

    // Respond with the list of payments
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({ message: "Failed to fetch payments list due to server error" });
  }
};

// Import mongoose at the top of the file where needed for ObjectId validation
import mongoose from "mongoose";
