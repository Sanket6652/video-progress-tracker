const express = require("express");
const router = express.Router();
const {
  updateProgress,
  getProgress,
} = require("../controllers/progressController");

router.post("/update", updateProgress);
router.get("/:userId/:videoId", getProgress);
module.exports = router;
