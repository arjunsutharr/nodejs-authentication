import mongoose from "mongoose";
import { ErrorHandler } from "../utils/errorHandler.js";

const forgotPasswordTokenSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  token: {
    type: String,
  },
  expTime: Date,
});

// creating index for expTime
forgotPasswordTokenSchema.index({ expTime: 1 }, { expireAfterSeconds: 0 });

const forgotPasswordTokenModel = mongoose.model(
  "passwordResetToken",
  forgotPasswordTokenSchema
);

// This function removes expired tokens from database
async function removeExpiredTokens() {
  try {
    const now = new Date();
    await forgotPasswordTokenModel.deleteMany({ expTime: { $lt: now } });
  } catch (error) {
    throw new ErrorHandler("error while removing exp token");
  }
}

setInterval(removeExpiredTokens, 1000 * 60 * 1);

export default forgotPasswordTokenModel;
