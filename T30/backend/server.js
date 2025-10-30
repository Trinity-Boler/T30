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

//  Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/T30_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));


const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
const users = mongoose.model('users', usersSchema);

// Routes
app.get('/api/userbase', async (req, res) => {
  try {
    const allUsers = await users.find(); // fetch all users from the 'users' collection
    res.json(allUsers);                 // send them back as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
