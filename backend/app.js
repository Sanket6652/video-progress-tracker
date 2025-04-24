const express = require('express');
const app = express();
const videoRoutes = require('./routes/videoRoutes');
const userRoutes = require('./routes/userRoutes');
app.use(express.json());

app.use('/api', videoRoutes);
app.use('/auth',userRoutes)
module.exports = app;
