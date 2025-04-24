const express = require('express');
const router = express.Router();
const { getAllVideos,saveVideo } = require('../controllers/videoController');

router.get('/videos', getAllVideos);
router.post('/videos', saveVideo);
module.exports = router;
