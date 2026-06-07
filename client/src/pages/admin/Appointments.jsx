import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import appointmentService from '../../services/appointmentService';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ patient: '', doctor: '', date: '', time: '', status: 'pending' });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAll();
        setAppointments(data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleAdd = async () => {
    if (!formData.patient || !formData.doctor || !formData.date || !formData.time) return;
    try {
      const newAppointment = await appointmentService.create(formData);
      setAppointments([...appointments, newAppointment]);
      setFormData({ patient: '', doctor: '', date: '', time: '', status: 'pending' });
      setShowModal(false);
    } catch (err) {
      alert('Error adding appointment');
    }
  };

  const handleDelete = async (id) => {
    try {
      await appointmentService.cancel(id);
      setAppointments(appointments.filter(a => a._id !== id));
    } catch (err) {
      alert('Error cancelling appointment');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Appointments Management</h2>
        <button onClick={() => setShowModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700">
          <FiPlus />
          <span>Add Appointment</span>
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4">Patient</th>
              <th className="text-left p-4">Doctor</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Time</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
            ) : appointments.length > 0 ? appointments.map((appointment) => (
              <tr key={appointment._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{appointment.patient?.user?.name || appointment.patient?.name || 'N/A'}</td>
                <td className="p-4">{appointment.doctor?.user?.name || appointment.doctor?.name || 'N/A'}</td>
                <td className="p-4">{appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}</td>
                <td className="p-4">{appointment.timeSlot || appointment.time || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>{appointment.status}</span>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800"><FiEdit /></button>
                    <button onClick={() => handleDelete(appointment._id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="text-center p-4">No appointments found</td></tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add Appointment</h3>
            <input type="text" placeholder="Patient Name" value={formData.patient} onChange={(e) => setFormData({ ...formData, patient: e.target.value })} className="w-full p-2 border rounded mb-3" />
            <input type="text" placeholder="Doctor Name" value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })} className="w-full p-2 border rounded mb-3" />
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full p-2 border rounded mb-3" />
            <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full p-2 border rounded mb-3" />
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full p-2 border rounded mb-4">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex space-x-2">
              <button onClick={handleAdd} className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">Add</button>
              <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
