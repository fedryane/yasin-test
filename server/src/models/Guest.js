import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama is required"],
      trim: true,
    },
    pesan: {
      type: String,
      required: [true, "Pesan is required"],
      trim: true,
    },
    // Timestamps option below is preferred over manual timestamp field
    // timestamp: {
    //     type: Date,
    //     default: Date.now
    // }
  },
  {
    timestamps: { createdAt: "timestamp" }, // Use createdAt as 'timestamp', updatedAt will also be added
  }
);

const Guest = mongoose.model("Guest", guestSchema);

export default Guest;
