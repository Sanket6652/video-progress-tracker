const express = require("express");
const cors = require("cors");
const app = express();
const videoRoutes = require("./routes/videoRoutes");
const userRoutes = require("./routes/userRoutes");
const progressRouter = require("./routes/progressRouter");
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/api", videoRoutes);
app.use("/auth", userRoutes);

app.use("/progress", progressRouter);
module.exports = app;
