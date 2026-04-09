const mongoose = require("mongoose");
const seedDB = require("./seed");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wahap";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected (Atlas)");
    await seedDB();
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;