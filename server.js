require("dotenv").config();
const mongoose = require("mongoose");   
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((err) => {
    console.log("MongoDB Connection Failed");
    console.log(err);
});
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "public");

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

const Event = require("./models/Event");

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

app.post("/events", async (req, res) => {
    try {
        const { title, date } = req.body;

        if (!title || !date) {
            return res.status(400).json({
                message: "Event title and date are required"
            });
        }

        const event = await Event.create({
            title,
            date
        });

        res.status(201).json({
            message: "Event Added Successfully",
            data: event
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to add event",
            error: error.message
        });
    }
});

app.get("/events", async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });

        res.json(events);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message
        });
    }
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
