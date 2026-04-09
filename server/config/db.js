const mongoose = require("mongoose");
const seedDB = require("./seed");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not set. Configure the server to use the shared Atlas database.");
    }

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected");
    await seedDB();
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;