import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBriefcase, FiClock, FiDollarSign, FiCalendar } from 'react-icons/fi';
import doctorService from '../../services/doctorService';
import authService from '../../services/authService';

const AddDoctor = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'doctor123',
    phone: '',
    specialization: '',
    experience: '',
    qualification: '',
    consultationFee: '',
    availableDays: [],
    availableTimeStart: '09:00',
    availableTimeEnd: '17:00',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { name, email, password, phone, ...doctorData } = formData;

      const userData = await authService.register({
        name,
        email,
        password,
        phone,
        role: 'doctor',
      });

      await doctorService.create({
        userId: userData._id,
        specialization: doctorData.specialization,
        experience: parseInt(doctorData.experience),
        qualification: doctorData.qualification,
        consultationFee: parseFloat(doctorData.consultationFee),
        availableDays: doctorData.availableDays,
        availableTime: {
          start: doctorData.availableTimeStart,
          end: doctorData.availableTimeEnd,
        },
      });

      alert('Doctor added successfully');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" placeholder="Dr. Name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="email" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="Phone" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required className="input-field" placeholder="Cardiology" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
            <input type="number" name="experience" value={formData.experience} onChange={handleChange} required className="input-field" placeholder="5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
            <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required className="input-field" placeholder="MBBS, MD" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fee ($)</label>
            <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} required className="input-field" placeholder="100" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button key={day} type="button" onClick={() => handleDayToggle(day)} className={`px-3 py-1 rounded-full text-sm ${formData.availableDays.includes(day) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input type="time" name="availableTimeStart" value={formData.availableTimeStart} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input type="time" name="availableTimeEnd" value={formData.availableTimeEnd} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Adding...' : 'Add Doctor'}
        </button>
      </form>
    </div>
  );
};

export default AddDoctor;
