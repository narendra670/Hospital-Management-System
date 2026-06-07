const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const User = require('./models/User');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital');
    console.log('Connected to MongoDB');

    await Doctor.deleteMany({});
    await User.deleteMany({});

    const users = await Promise.all([
      User.create({ name: 'John Smith', email: 'dr.smith@hospital.com', password: 'password123', role: 'doctor' }),
      User.create({ name: 'Sarah Johnson', email: 'dr.johnson@hospital.com', password: 'password123', role: 'doctor' }),
      User.create({ name: 'Michael Brown', email: 'dr.brown@hospital.com', password: 'password123', role: 'doctor' })
    ]);

    await Doctor.insertMany([
      {
        user: users[0]._id,
        specialization: 'Cardiologist',
        experience: 12,
        qualification: 'MD, FACC',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
        availableTime: { start: '09:00', end: '17:00' },
        consultationFee: 150,
        rating: 4.8,
        totalReviews: 124
      },
      {
        user: users[1]._id,
        specialization: 'Dermatologist',
        experience: 8,
        qualification: 'MD, FAAD',
        availableDays: ['Monday', 'Thursday', 'Friday', 'Saturday'],
        availableTime: { start: '10:00', end: '18:00' },
        consultationFee: 120,
        rating: 4.5,
        totalReviews: 89
      },
      {
        user: users[2]._id,
        specialization: 'Neurologist',
        experience: 15,
        qualification: 'MD, PhD',
        availableDays: ['Tuesday', 'Wednesday', 'Thursday'],
        availableTime: { start: '08:00', end: '16:00' },
        consultationFee: 200,
        rating: 4.9,
        totalReviews: 200
      }
    ]);

    console.log('Sample doctors added successfully');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
