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
  source: String,
  percentage: Number,
});
const Summary = mongoose.model('summary', summarySchema);

const reportSchema = new mongoose.Schema({
  platform: String,
  adoptionRate: Number,
});
const Report = mongoose.model('report', reportSchema);

// ---------------------------------------------
// 3. Routes
// ---------------------------------------------

// Fetch all users
app.get('/api/userbase', async (req, res) => {
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
    const labels = data.map(item => item.source);
    const values = data.map(item => item.percentage);
    res.json({ labels, values });
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
// 4. One-time seed function for demo data
// ---------------------------------------------
async function seedData() {
  const summaryData = [
    { source: 'Wind', percentage: 40 },
    { source: 'Solar', percentage: 35 },
    { source: 'Hydro', percentage: 15 },
    { source: 'Geothermal', percentage: 10 },
  ];

  const reportData = [
    { platform: 'PlayStation', adoptionRate: 50 },
    { platform: 'Xbox', adoptionRate: 20 },
    { platform: 'PC', adoptionRate: 25 },
    { platform: 'Switch', adoptionRate: 5 },
  ];

  try {
    await Summary.deleteMany({});
    await Report.deleteMany({});
    await Summary.insertMany(summaryData);
    await Report.insertMany(reportData);
    console.log('✅ Sample summary and report data inserted');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  }
}

// Uncomment this line ONLY the first time you run the app
// seedData();

// ---------------------------------------------
// 5. Start Server
// ---------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
