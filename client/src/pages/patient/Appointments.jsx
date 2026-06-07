import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';
import appointmentService from '../../services/appointmentService';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4">Doctor</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Time</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
            ) : appointments.length > 0 ? appointments.map((appointment) => (
              <tr key={appointment._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{appointment.doctor?.user?.name || appointment.doctor?.name || 'N/A'}</td>
                <td className="p-4">{appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}</td>
                <td className="p-4">{appointment.timeSlot || appointment.time || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status === 'pending' ? 'Active' : appointment.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="text-center p-4">No appointments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default PatientAppointments;
