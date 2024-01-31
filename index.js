const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://mathewsgeorge202:ansu@cluster0.ylyaonw.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

// Rest of your code goes here...

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const Attendance = require('./models/attendance');

app.post('/api/check', async (req, res) => {
    const { serialNumber, logData, time, status } = req.body;

    try {
        const newRecord = new Attendance({
            serialNumber,
            logData,
            time,
            status,
        });

        await newRecord.save();
        res.status(201).json({ message: 'Record added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});



const $status = document.getElementById("status");
const $log = document.getElementById("log");

const currentTime = () => {
    return new Date().toString().slice(0, -31);
};

let currentStatus = "?";
let checkedTags = new Set();

const handleNewRecord = (serialNumber, logData, time) => {
    const key = `${serialNumber}-${logData}`;
    if (checkedTags.has(key)) {
        alert("Duplicate! You are already checked in or checked out with this NFC tag.");
        return;
    }

    checkedTags.add(key);

    const $record = document.createElement("div");
    $record.innerHTML = `\n${serialNumber} - <b>${logData}</b> - ${time}`;
    $log.appendChild($record);
};

if (!window.NDEFReader) {
    $status.innerHTML = "<h4>NFC Unsupported!</h4>";
}

const activateNFC = () => {
    const ndef = new NDEFReader();

    ndef.scan()
        .then(() => {
            $status.innerHTML = "<h4>Bring an NFC tag towards the back of your phone...</h4>";
        })
        .catch((err) => {
            console.log("Scan Error:", err);
            alert(err);
        });

    ndef.onreadingerror = (e) => {
        $status.innerHTML = "<h4>Read Error</h4>" + currentTime();
        console.log(e);
    };

    ndef.onreading = (e) => {
        let time = currentTime();
        let { serialNumber } = e;
        $status.innerHTML = `<h4>Last Read</h4>${serialNumber}<br>${currentTime()}`;
        handleNewRecord(serialNumber, currentStatus, time);
        console.log(e);
    };
};

document.getElementById("check-in").onchange = (e) => {
    e.target.checked && (currentStatus = "in");
};
document.getElementById("check-out").onchange = (e) => {
    e.target.checked && (currentStatus = "out");
};
document.getElementById("start-btn").onclick = (e) => {
    activateNFC();
};


const handleCheck = async (serialNumber, logData, time, status) => {
    try {
        const response = await fetch('http://localhost:3000/api/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serialNumber, logData, time, status }),
        });

        if (!response.ok) {
            throw new Error('Failed to add record.');
        }

        // Handle success if needed
        console.log('Record added successfully!');
    } catch (error) {
        console.error(error);
        alert('Failed to add record. Please try again.');
    }
};

document.getElementById('check-in').onchange = (e) => {
    if (e.target.checked) {
        currentStatus = 'in';
        handleCheck(serialNumber, currentStatus, time);
    }
};

document.getElementById('check-out').onchange = (e) => {
    if (e.target.checked) {
        currentStatus = 'out';
        handleCheck(serialNumber, currentStatus, time);
    }
};

document.getElementById('start-btn').onclick = (e) => {
    activateNFC();
};
