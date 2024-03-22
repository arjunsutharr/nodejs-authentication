import forgotPasswordTokenModel from "../models/passwordForgotToken.schema.js";
import { generatePasswordResetToken } from "./emailSender.js";
import { sendPasswordResetEmailToQueue } from "./emailSender.js";

// When we recieve request for password forgot this function
async function sendPasswordResetEmail(userId, email, name) {
  try {
    const resetToken = await generatePasswordResetToken();

    await new forgotPasswordTokenModel({
      user: userId,
      ...resetToken,
    }).save();

    await sendPasswordResetEmailToQueue(name, email, resetToken.token);
  } catch (error) {
    throw new ErrorHandler(500, "Error while sending password forgort mail");
  }
}

export default sendPasswordResetEmail;
