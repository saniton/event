// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const requestIp = require('request-ip');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { decode } = require('punycode');
const { generateSecretKey } = require('./utils'); // Adjust the path accordingly

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userDataSchema = new mongoose.Schema({
  qrNumber: { type: Number, unique: true },
  name: String,
  phoneNumber: String,
  registrationTime: String,
  ipAddress: String,
  email: String,
});

userDataSchema.pre('save', function (next) {
  const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  this.registrationTime = currentDate;
  next();
});

const UserData = mongoose.model('eventmanager', userDataSchema);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestIp.mw({ attributeName: 'clientIp', headerName: 'X-Forwarded-For' }));

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

app.post('/saveData', async (req, res) => {
  console.log('Request Headers:', req.headers);

  try {
    const ipAddress = req.clientIp;
    console.log('User IP Address:', ipAddress);

    const { name, phoneNumber, qrNumber, email } = req.body;

    if (qrNumber < 1) {
      return res.status(400).json({ error: 'Invalid qrNumber. It should be between 1 and 5.' });
    }

    const existingRegistration = await UserData.findOne({ qrNumber });

    if (existingRegistration) {
      return res.status(400).json({ error: 'QR Number is already registered.' });
    }

    const newRegistration = new UserData({
      qrNumber,
      name,
      phoneNumber,
      ipAddress,
      email,
    });

    await newRegistration.save();

    return res.status(200).json({ message: 'Registration successful.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { name, qrNumber } = req.body;

    const user = await UserData.findOne({ name, qrNumber });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ user }, JWT_SECRET_KEY);
    
    // Include the user's email in the response
    res.json({ success: true, token, user: { name: user.name, email: user.email, phoneNumber: user.phoneNumber } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


app.post('/api/tokenVerify', (req, res) => {
  const { presentToken } = req.body;


  try {
    const decode = jwt.verify(presentToken, JWT_SECRET_KEY);
    res.status(200).json({ success: true, date: decode });
  }
  catch (e) {
    console.log('------', e.message, '-------')
    res.status(401).json({ success: false, message: ('Error while decoding token, Error: '+ e.message) });
  }
});

app.get('/getUserData/:qrNumber', async (req, res) => {
  const { qrNumber } = req.params;

  try {
    const userData = await UserData.findOne({ qrNumber });
    if (!userData) {
      return res.status(404).json({ error: 'User data not found.' });
    }
    return res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/getData/:qrNumber', async (req, res) => {
  const { qrNumber } = req.params;

  try {
    const userData = await UserData.findOne({ qrNumber });
    if (!userData) {
      return res.status(404).json({ error: 'User data not found.' });
    }
    return res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});













const boothDataSchema = new mongoose.Schema({
  boothNumber: { type: Number, unique: true },
  boothName: String,
  phoneNumber: String,
  registrationTime: String,
  ipAddress: String,
  email: String,
});

boothDataSchema.pre('save', function (next) {
  const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  this.registrationTime = currentDate;
  next();
});

const BoothData = mongoose.model('boothmanager', boothDataSchema);

app.post('/saveBoothData', async (req, res) => {
  console.log('Request Headers:', req.headers);

  try {
    const ipAddress = req.clientIp;
    console.log('User IP Address:', ipAddress);

    const { boothName, boothNumber, phoneNumber, email } = req.body;

    if (boothNumber < 1) {
      return res.status(400).json({ error: 'Invalid boothNumber. It should be greater than 0.' });
    }

    const existingBoothRegistration = await BoothData.findOne({ boothNumber });

    if (existingBoothRegistration) {
      return res.status(400).json({ error: 'Booth Number is already registered.' });
    }

    const newBoothRegistration = new BoothData({
      boothNumber,
      boothName,
      phoneNumber,
      ipAddress,
      email,
    });

    await newBoothRegistration.save();

    return res.status(200).json({ message: 'Booth Registration successful.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/getBoothData/:boothNumber', async (req, res) => {
  const { boothNumber } = req.params;

  try {
    const boothData = await BoothData.findOne({ boothNumber });
    if (!boothData) {
      return res.status(404).json({ error: 'Booth data not found.' });
    }
    return res.status(200).json(boothData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
