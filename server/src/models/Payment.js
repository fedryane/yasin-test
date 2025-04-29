import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    nama_lengkap: {
      type: String,
      required: [true, "Nama Lengkap is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    nomor_telepon: {
      type: String,
      required: [true, "Nomor Telepon is required"],
      trim: true,
    },
    jumlah_pembayaran: {
      type: Number,
      required: [true, "Jumlah Pembayaran is required"],
      min: [10000, "Minimum payment amount is Rp 10.000"], // Use Mongoose validation
    },
    metode_pembayaran: {
      type: String,
      required: [true, "Metode Pembayaran is required"],
      trim: true,
    },
    // Consider adding status, transaction ID, etc.
    // status: {
    //     type: String,
    //     enum: ['pending', 'success', 'failed'],
    //     default: 'pending'
    // },
    // transactionId: { type: String }
  },
  {
    timestamps: { createdAt: "timestamp" }, // Use createdAt as 'timestamp'
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
