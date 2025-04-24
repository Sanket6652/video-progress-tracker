const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    videoDuration: { type: Number, required: true },
    intervals: [{ 
        start: { type: Number, required: true }, 
        end: { type: Number, required: true } 
    }],
    lastWatchedTime: { type: Number, default: 0 }
});

const Progress = mongoose.model('Progress', ProgressSchema);
module.exports = Progress;