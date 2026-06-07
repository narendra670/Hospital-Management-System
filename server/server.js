const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Doctor = require('./models/Doctor');
const User = require('./models/User');

dotenv.config();

const seedDoctorsIfEmpty = async () => {
  try {
    const count = await Doctor.countDocuments();
    if (count === 0) {
      console.log('No doctors found, seeding default doctors...');
      const users = await Promise.all([
        User.create({ name: 'SK Gupta', email: 'sk.gupta@hospital.com', password: 'password123', role: 'doctor' }),
        User.create({ name: 'Json Kumar', email: 'json.kumar@hospital.com', password: 'password123', role: 'doctor' }),
        User.create({ name: 'CP Agrawal', email: 'cp.agrawal@hospital.com', password: 'password123', role: 'doctor' }),
      ]);
      await Doctor.insertMany([
        { user: users[0]._id, specialization: 'Cardiologist', experience: 15, qualification: 'MD, DM', availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], availableTime: { start: '09:00', end: '17:00' }, consultationFee: 500, isAvailable: true },
        { user: users[1]._id, specialization: 'Dermatologist', experience: 10, qualification: 'MD', availableDays: ['Monday', 'Wednesday', 'Friday'], availableTime: { start: '10:00', end: '16:00' }, consultationFee: 400, isAvailable: true },
        { user: users[2]._id, specialization: 'Neurologist', experience: 20, qualification: 'MD, PhD', availableDays: ['Tuesday', 'Thursday', 'Saturday'], availableTime: { start: '08:00', end: '14:00' }, consultationFee: 600, isAvailable: true },
      ]);
      console.log('Default doctors seeded successfully');
    }
  } catch (err) {
    console.error('Error seeding doctors:', err.message);
  }
};

connectDB().then(seedDoctorsIfEmpty);

const app = express();

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ message: 'Hospital Management System API is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/shifts', require('./routes/shiftRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/pharmacy', require('./routes/pharmacyRoutes'));

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});
const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
