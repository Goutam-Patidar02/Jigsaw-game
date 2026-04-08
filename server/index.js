const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jigsaw_db';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Auth Route: Login using Name and Phone Number (no password as requested)
app.post('/api/login', async (req, res) => {
    try {
        const { name, phoneNumber } = req.body;

        if (!name || !phoneNumber) {
            return res.status(400).json({ error: 'Name and Phone Number are required.' });
        }

        // Find existing user or create new one
        let user = await User.findOne({ phoneNumber });

        if (!user) {
            user = await User.create({ name, phoneNumber });
        } else {
            // Update name if different
            if (user.name !== name) {
                user.name = name;
                await user.save();
            }
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update History upon Puzzle Solved
app.post('/api/puzzles/solve', async (req, res) => {
    try {
        const { phoneNumber, image, difficulty } = req.body;

        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.puzzlesSolved += 1;
        user.history.push({ image, difficulty });
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch User Data for Dashboard
app.get('/api/users/:phoneNumber', async (req, res) => {
    try {
        const user = await User.findOne({ phoneNumber: req.params.phoneNumber });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
