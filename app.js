const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const delivery = require('./routes/delivery');
const bot = require('./routes/bot');

// create de server
const app = express();

// enable cors
app.use(cors());

// connect to database
if (process.env.NODE_ENV !== "test") {
    connectDB();
}

// enable express.json
app.use(express.json({ extended: true }));

// import routes
app.use('/deliveries', delivery);
app.use('/bots', bot);

module.exports = app;