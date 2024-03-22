import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ErrorHandler } from "../utils/errorHandler.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
});

// hash user password before saving using bcrypt
userSchema.pre("save", async function (next) {
  try {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  } catch (error) {
    return next(new ErrorHandler(500, "Error while hashing the password"));
  }
});

// user password compare
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
