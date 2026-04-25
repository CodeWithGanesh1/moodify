const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

// ISKO UPDATE KAREIN
app.use(cors({
    origin: [
        "https://moodify-se2x.vercel.app", 
        "https://moodify-seven-zeta.vercel.app",
        "http://localhost:5173" // Local testing ke liye bhi rakhein
    ],
    credentials: true
}));

/**
 * Routes
 */
const authRoutes = require("./routes/auth.routes")
const songRoute = require("./routes/song.routes")

app.use("/api/auth", authRoutes)
app.use("/api/songs", songRoute)

module.exports = app;