import Guest from "../models/Guest.js"; // Import Mongoose Guest model

// --- Create Guest Handler ---
export const createGuest = async (req, res) => {
  const { nama, pesan } = req.body;

  // Basic input validation
  if (!nama || !pesan) {
    return res.status(400).json({ message: "Nama and Pesan fields are required" });
  }

  try {
    // Create a new guest document using the Mongoose model
    const newGuest = new Guest({
      nama,
      pesan,
    });

    // Save the document to the database
    const savedGuest = await newGuest.save();

    // Respond with success and the created guest data
    res.status(201).json({ message: "Guest added successfully", guest: savedGuest });
  } catch (error) {
    console.error("Error adding guest:", error);
    // Handle Mongoose validation errors specifically
    if (error.name === "ValidationError") {
      // Extract meaningful messages from validation errors
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    // Generic server error for other issues
    res.status(500).json({ message: "Failed to add guest due to server error" });
  }
};

// --- Get All Guests Handler ---
export const getGuests = async (req, res) => {
  try {
    // Fetch all guests using Mongoose, sort by timestamp descending
    // The 'timestamp' field comes from the { timestamps: { createdAt: 'timestamp' } } option in the model
    const guests = await Guest.find().sort({ timestamp: -1 }); // -1 for descending order

    // Respond with the list of guests
    res.status(200).json(guests);
  } catch (error) {
    console.error("Error fetching guests:", error);
    res.status(500).json({ message: "Failed to fetch guests due to server error" });
  }
};
