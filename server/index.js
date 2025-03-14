const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json()); // To parse incoming JSON requests

app.get("/", (req, res) => {
    res.json({ message: "hi this is working" });
});

app.get('/profile', authMiddleware, (req, res) => {
    res.json({
        "success": "You are seeing this profile",
        "user": req.user,
    })
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
