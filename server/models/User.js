const mongoose = require('mongoose');

const puzzleHistorySchema = new mongoose.Schema({
    image: String,
    difficulty: String,
    completedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    puzzlesSolved: { type: Number, default: 0 },
    history: [puzzleHistorySchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
