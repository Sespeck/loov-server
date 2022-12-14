const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5001;
const db = process.env.DB;

// import router files
const router = require('./routes/router');
// middleware
app.use(express.json({ limit: '50mb' }));
app.use(router);

// Database
mongoose
  .connect(db)
  .then(() => {
    console.log('connection successful');
  })
  .catch((e) => console.log(e));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Connected to port ${PORT}`);
});
