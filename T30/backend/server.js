// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const PORT = 3000;
const app = express();
const SECRET_KEY = 'yourSecretKey'; // change to something secure

app.use(cors());
app.use(express.json());
app.use('/', express.static('public'));


// ---------------------------------------------
// JWT
// ---------------------------------------------
function generateToken(user) {
  const payload = { username: user.username };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token required' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}


// ---------------------------------------------
// Connect to MongoDB
// ---------------------------------------------
mongoose.connect('mongodb://127.0.0.1:27017/T30_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ---------------------------------------------
// Schemas and Models
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
// Routes
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
app.get('/api/summary', verifyToken, async (req, res) => {
  try {
    const data = await Summary.find();
    res.json(data.map(d => ({ label: d.label, value: d.value })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
})


// Report data for chart
app.get('/api/report', async (req, res) => {
  try {
    const data = await Summary.find();
    // send as array of objects
    res.json(data.map(d => ({ label: d.label, value: d.value })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// ---------------------------------------------
// Login route
// ---------------------------------------------
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in the database
    const user = await Users.findOne({ username });

    // If user not found or password doesn’t match
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create a JWT token
    const token = generateToken(user);

    // Send token to frontend
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});



// ---------------------------------------------
// Start Server
// ---------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
