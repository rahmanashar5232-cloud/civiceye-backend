require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ ROOT ROUTE (IMPORTANT TEST)
app.get('/', (req, res) => {
  res.send('CivicEye Backend Running ✅');
});

// ✅ MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error ❌", err));

// ✅ Simple Report Schema
const Report = mongoose.model("Report", {
  title: String,
  description: String,
  image: String,
  location: Object,
  landmark: String,
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now }
});

// ✅ Create Report API
app.post('/api/reports', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Reports API
app.get('/api/reports', async (req, res) => {
  const reports = await Report.find().sort({ date: -1 });
  res.json(reports);
});

// ✅ IMPORTANT: PORT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
