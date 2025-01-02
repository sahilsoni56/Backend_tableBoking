import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
});

const Booking = mongoose.model("Booking", bookingSchema);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/table_booking");
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
connectDB();



app.post("/booking", async (req, res) => {
  const { name, contact, date, time, guests } = req.body;
  try {
    const existingBooking = await Booking.find({ date, time, name, contact });

    if (existingBooking.length > 0) {
      return res.status(400).json({ message: "Time slot already booked!" });
    }

    const newBooking = new Booking({ name, contact, date, time, guests });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/bookings/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
