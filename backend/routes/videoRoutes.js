const express = require('express');
const router = express.Router();
const { getAllVideos,saveVideo,getvideo } = require('../controllers/videoController');

router.get('/videos', getAllVideos);
router.post('/videos', saveVideo);
router.get('/videos/:id', getvideo);
module.exports = router;
