const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const serverless = require('serverless-http');  // เพิ่ม serverless-http

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// เชื่อมต่อกับ MongoDB
mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// เส้นทางพื้นฐาน
app.get('/', (req, res) => {
    res.send('Hello from Express on Vercel!');
});

module.exports = app;
module.exports.handler = serverless(app);  // Export Serverless Function
