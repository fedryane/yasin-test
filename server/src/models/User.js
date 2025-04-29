import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Ensures no duplicate emails
      lowercase: true, // Store emails in lowercase
      trim: true, // Remove leading/trailing whitespace
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"], // Example validation
    },
    // Add other fields as needed, e.g., name, role, etc.
    // role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Optional: Add methods to the schema (e.g., for password comparison)
// userSchema.methods.matchPassword = async function(enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// Optional: Middleware (e.g., to hash password before saving) - handled in controller/admin creation for now
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) {
//         next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model("User", userSchema);

export default User;
