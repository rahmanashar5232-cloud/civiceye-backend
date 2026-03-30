const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 MongoDB Connection (use MongoDB Atlas)
mongoose.connect('YOUR_MONGODB_URI', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 📦 Schema
const ReportSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  landmark: String,
  status: { type: String, default: "Pending" },
  date: String,
});

const Report = mongoose.model('Report', ReportSchema);

// ➤ CREATE REPORT
app.post('/reports', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ GET ALL REPORTS
app.get('/reports', async (req, res) => {
  const reports = await Report.find().sort({ _id: -1 });
  res.json(reports);
});

// ➤ UPDATE STATUS
app.put('/reports/:id', async (req, res) => {
  const updated = await Report.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
});

// 🚀 Server
app.listen(5000, () => console.log('Server running on port 5000'));
