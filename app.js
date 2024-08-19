const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// เชื่อมต่อกับ MongoDB
mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// สร้าง Schema และ Model สำหรับการเก็บข้อมูล
const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const User = mongoose.model('User', userSchema);

// เส้นทางสำหรับแสดงฟอร์ม HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// เส้นทางสำหรับการบันทึกข้อมูล
app.post('/submit', (req, res) => {
    const newUser = new User({
        name: req.body.name,
        age: req.body.age
    });

    newUser.save()
        .then(() => {
            res.send('User data has been saved to MongoDB!');
        })
        .catch((err) => {
            res.status(500).send('Failed to save data');
            console.error(err);
        });
});

// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
