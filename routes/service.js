const express = require('express');
const router = express.Router();

// Simulate a service booking
let appointments = [];

router.post('/book', (req, res) => {
  const { service, date, payment } = req.body;
  const newAppointment = { service, date, payment };
  appointments.push(newAppointment);
  res.status(201).json({ message: 'Service booked successfully', appointment: newAppointment });
});

module.exports = router;
