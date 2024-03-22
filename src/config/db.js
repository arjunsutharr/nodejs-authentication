import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const baseUrl = process.env.DATABASE_URL;

// connecting to database
export const connectToDatabase = async () => {
  try {
    mongoose.connect(baseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database.");
  } catch (error) {
    console.log(error);
  }
};
