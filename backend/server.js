const express = require("express");
const cors = require("cors");
const reservationRoutes = require("./routes/reservationRoutes");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reservations", reservationRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.get("/health", (req, res) => {
    res.json({ ok: true });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
