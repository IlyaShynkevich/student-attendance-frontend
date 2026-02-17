const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Path to your JSON file
const jsonFilePath = './attendance.json';

// Endpoint to handle POST requests for updating the JSON file
app.post('/update', (req, res) => {
    const { className, student, attendance } = req.body;
    console.log("Data Received:", className, student, attendance);

    // Read the existing JSON file
    fs.readFile(jsonFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading file' });
        }

        let jsonData = JSON.parse(data);

        // Find the class
        const course = jsonData.find(c => c.className === className);
        if (!course) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Find the student
        const studentData = course.students.find(s => s.name === student);
        if (!studentData) {
            return res.status(404).json({ error: 'Student not found' });
        }
        delete studentData.attendance;
        // Add the attendance record
        if (!Array.isArray(studentData.attendance)) {
            studentData.attendance = [];
        }
        studentData.attendance.push(attendance);

        // Write the updated data back to the JSON file
        fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error writing file' });
            }

            res.status(200).json({ message: 'Attendance updated successfully', data: jsonData });
        });
    });
});



// Start the server
app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});
