const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const postRoutes = require("./routes/postRoutes");
const bodyParser = require("body-parser");

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json()); // To parse incoming JSON requests

app.get("/", (req, res) => {
    res.json({
        message: "is this working",
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
