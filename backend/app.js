const express = require('express');
const app = express();
const videoRoutes = require('./routes/videoRoutes');
const userRoutes = require('./routes/userRoutes');
const progressRouter = require('./routes/progressRouter');
app.use(express.json());

app.use('/api', videoRoutes);
app.use('/auth',userRoutes)
app.use('/progress',progressRouter)
module.exports = app;
