const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");
const stallRoutes = require("./routes/stallRoutes");
const visitRoutes = require("./routes/visitRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/stalls", stallRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/banners", bannerRoutes);

app.get("/", (req, res) => {
  res.send("✅ WAHAP API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));