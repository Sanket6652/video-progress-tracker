const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videourl: { type: String, required: true },
  description: { type: String ,required: false},
  duration: { type: Number,required: false },
});

const Video = mongoose.model('Video', VideoSchema);
module.exports = Video;