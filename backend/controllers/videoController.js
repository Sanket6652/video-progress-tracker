const Video = require("../models/video");

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error });
  }
};

const saveVideo = async (req, res) => {
  try {
    const { title, videourl, description } = req.body;

    // Basic validation
    if (!title || !videourl) {
      return res
        .status(400)
        .json({ message: "Title and videourl are required" });
    }

    const newVideo = new Video({
      title,
      videourl,
      description,
    });

    const savedVideo = await newVideo.save();
    console.log("Video saved successfully:", savedVideo);
    res.status(201).json(savedVideo);
  } catch (error) {
    console.error("Error saving video:", error.message);
    res
      .status(500)
      .json({ message: "Error creating video", error: error.message });
  }
};

const getvideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Error fetching video", error });
  }
}
module.exports = { getAllVideos, saveVideo,getvideo };
