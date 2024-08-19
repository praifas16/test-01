const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const serverless = require('serverless-http');  // เพิ่มการรองรับ Serverless Functions

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// เชื่อมต่อกับ MongoDB (ใช้ environment variable สำหรับ MongoDB URL)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000  // เพิ่มค่า timeout เป็น 30 วินาที
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

// เส้นทางสำหรับแสดงฟอร์ม HTML และข้อมูลทั้งหมด
app.get('/', (req, res) => {
    User.find()
        .then(users => {
            let userList = users.map(user => `<li>${user.name} (Age: ${user.age})</li>`).join('');
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>User Information Form</title>
                </head>
                <body>
                    <h2>User Information Form</h2>
                    <form action="/submit" method="post">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" required><br><br>

                        <label for="age">Age:</label>
                        <input type="number" id="age" name="age" required><br><br>

                        <button type="submit">Submit</button>
                    </form>
                    <h2>Submitted Information</h2>
                    <ul>${userList}</ul>
                </body>
                </html>
            `);
        })
        .catch(err => {
            res.status(500).send('Failed to load data');
            console.error(err);
        });
});

// เส้นทางสำหรับการบันทึกข้อมูลและแสดงผล
app.post('/submit', (req, res) => {
    const newUser = new User({
        name: req.body.name,
        age: req.body.age
    });

    newUser.save()
        .then(() => {
            // หลังจากบันทึกข้อมูลให้ redirect กลับไปที่หน้าแรกเพื่อแสดงข้อมูลใหม่
            res.redirect('/');
        })
        .catch((err) => {
            res.status(500).send('Failed to save data');
            console.error(err);
        });
});

// เปลี่ยนจากการเริ่มเซิร์ฟเวอร์แบบ local มาเป็นการส่งออกเป็น Serverless Function สำหรับ Vercel
module.exports = app;
module.exports.handler = serverless(app);
