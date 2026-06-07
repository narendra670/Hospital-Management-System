import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBriefcase, FiClock, FiAward, FiCheckCircle, FiUser, FiCalendar } from 'react-icons/fi';
import doctorService from '../../services/doctorService';
import appointmentService from '../../services/appointmentService';

const DAYS_SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };

const FALLBACK_DOCTORS = [
  { _id: 'fallback-1', user: { name: 'SK Gupta' }, specialization: 'Cardiologist', qualification: 'MD, DM', experience: 15, consultationFee: 500, availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], availableTime: { start: '09:00', end: '17:00' }, isAvailable: true },
  { _id: 'fallback-2', user: { name: 'Json Kumar' }, specialization: 'Dermatologist', qualification: 'MD', experience: 10, consultationFee: 400, availableDays: ['Monday', 'Wednesday', 'Friday'], availableTime: { start: '10:00', end: '16:00' }, isAvailable: true },
  { _id: 'fallback-3', user: { name: 'CP Agrawal' }, specialization: 'Neurologist', qualification: 'MD, PhD', experience: 20, consultationFee: 600, availableDays: ['Tuesday', 'Thursday', 'Saturday'], availableTime: { start: '08:00', end: '14:00' }, isAvailable: true },
];

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAll();
        setDoctors(data.length > 0 ? data : FALLBACK_DOCTORS);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setDoctors(FALLBACK_DOCTORS);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    if (selectedDoctor._id.startsWith('fallback-')) {
      alert('This doctor is not yet registered in the system. Please select a registered doctor.');
      return;
    }
    setSubmitting(true);
    try {
      await appointmentService.create({
        doctorId: selectedDoctor._id,
        date: formData.date,
        timeSlot: formData.time,
        reason: formData.reason,
      });
      alert('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (err) {
      alert(err.response?.data?.message || 'Error booking appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const cardListRef = useRef(null);
  const availableDoctors = doctors.filter((d) => d.isAvailable !== false);

  useEffect(() => {
    if (selectedDoctor && cardListRef.current) {
      const el = cardListRef.current.querySelector(`[data-doctor-id="${selectedDoctor._id}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedDoctor]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Appointment</h2>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <FiUser className="text-primary-600" />
              <span>Select Doctor</span>
            </h3>

            <div className="space-y-3 mb-4">
              <select
                value={selectedDoctor?._id || ''}
                onChange={(e) => {
                  const doc = doctors.find((d) => d._id === e.target.value);
                  if (doc) handleSelectDoctor(doc);
                }}
                className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">-- Choose a doctor --</option>
                {availableDoctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.user?.name || 'Doctor'} {doc.specialization ? `(${doc.specialization})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading doctors...</div>
            ) : availableDoctors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No doctors available</div>
            ) : (
              <div ref={cardListRef} className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {availableDoctors.map((doctor) => {
                  const isSelected = selectedDoctor?._id === doctor._id;
                  return (
                    <motion.div
                      key={doctor._id}
                      data-doctor-id={doctor._id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleSelectDoctor(doctor)}
                      className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-100 bg-gray-50 hover:border-primary-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${isSelected ? 'bg-primary-600' : 'bg-primary-400'}`}>
                            {(doctor.user?.name || 'D')[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Dr. {doctor.user?.name || 'Doctor'}</p>
                            <p className="text-sm text-primary-600">{doctor.specialization || 'General'}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                              <span className="flex items-center space-x-1"><FiAward className="w-3 h-3" /><span>{doctor.qualification || 'N/A'}</span></span>
                              <span className="flex items-center space-x-1"><FiClock className="w-3 h-3" /><span>{doctor.experience || 0} yrs exp</span></span>
                              <span className="flex items-center space-x-1"><span className="text-xs font-medium">₹</span><span>{doctor.consultationFee || 0}</span></span>
                            </div>
                          </div>
                        </div>
                        {isSelected && <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />}
                      </div>
                      {doctor.availableDays?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {Object.entries(DAYS_SHORT).map(([full, short]) => (
                            <span key={full} className={`px-2 py-0.5 rounded text-xs ${doctor.availableDays.includes(full) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                              {short}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedDoctor ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <FiCalendar className="text-primary-600" />
                <span>Book Slot</span>
              </h3>

              <div className="bg-primary-50 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                    {(selectedDoctor.user?.name || 'D')[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dr. {selectedDoctor.user?.name || 'Doctor'}</p>
                    <p className="text-sm text-primary-600">{selectedDoctor.specialization}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p className="flex items-center space-x-1"><span className="text-xs font-medium">₹</span><span>Fee: ₹{selectedDoctor.consultationFee}</span></p>
                  {selectedDoctor.availableTime?.start && (
                    <p className="flex items-center space-x-1"><FiClock className="w-3 h-3" /><span>Available: {selectedDoctor.availableTime.start} - {selectedDoctor.availableTime.end}</span></p>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Describe your symptoms or reason for visit" />
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium">
                  {submitting ? 'Booking...' : 'Book Appointment'}
                </button>
              </form>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400">
              <FiUser className="w-12 h-12 mb-3" />
              <p className="text-center">Select a doctor from the list to book an appointment</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookAppointment;