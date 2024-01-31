const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    serialNumber: String,
    logData: String,
    time: String,
    status: String,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
