const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "DevOrbit API is running" });
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

module.exports = app;