// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', express.static('public'));

// ---------------------------------------------
// 1. Connect to MongoDB
// ---------------------------------------------
mongoose.connect('mongodb://127.0.0.1:27017/T30_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ---------------------------------------------
// 2. Schemas and Models
// ---------------------------------------------
const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
const Users = mongoose.model('users', usersSchema);

const summarySchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: Number, required: true }
}, { collection: 'summary' });
const Summary = mongoose.model('summary', summarySchema);

const reportSchema = new mongoose.Schema({
  lable: String,
  value: Number,
});
const Report = mongoose.model('reports', reportSchema);

// ---------------------------------------------
// 3. Routes
// ---------------------------------------------

// Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await Users.find();
    res.json(allUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Summary data for chart
app.get('/api/summary', async (req, res) => {
  try {
    const data = await Summary.find();
    // send as array of objects
    res.json(data.map(d => ({ label: d.label, value: d.value })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// Report data for chart
app.get('/api/report', async (req, res) => {
  try {
    const data = await Report.find();
    const labels = data.map(item => item.platform);
    const values = data.map(item => item.adoptionRate);
    res.json({ labels, values });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// ---------------------------------------------
// 5. Start Server
// ---------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
