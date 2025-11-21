const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const PORT = 3000;
const app = express();
const SECRET_KEY = 'yourSecretKey'; // change to something secure

// ---------------------------------------------
// Middleware
// ---------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS + preflight for Authorization header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200"); // Angular dev server
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialError: err,
      err: "you are not logged in",
    });
  }
});
// Serve static files if needed
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
// MongoDB Connection
// ---------------------------------------------
mongoose.connect('mongodb://127.0.0.1:27017/T30_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ---------------------------------------------
// Schemas & Models
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
  label: String,
  value: Number,
});
const Report = mongoose.model('reports', reportSchema);

// ---------------------------------------------
// Routes
// ---------------------------------------------

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, token: null, err: 'Invalid username or password' });
    }

    const token = generateToken(user);
    res.json({ success: true, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, err: 'Server error during login' });
  }
});

// Summary
app.get('/api/summary', verifyToken, async (req, res) => {
  try {
    const data = await Summary.find();
    res.json(data.map(d => ({ label: d.label, value: d.value })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Report
app.get('/api/report', verifyToken, async (req, res) => {
  try {
    const data = await Summary.find();
    res.json(data.map(d => ({ label: d.label, value: d.value })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------------------------------
// Start Server
// ---------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
