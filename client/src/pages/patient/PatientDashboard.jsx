import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiGrid, FiUser, FiSettings, FiBriefcase } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import appointmentService from '../../services/appointmentService';

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    upcoming: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentStats, appointmentsData] = await Promise.all([
          appointmentService.getStats().catch(() => ({ upcoming: 0, pending: 0, completed: 0, cancelled: 0 })),
          appointmentService.getAll().catch(() => []),
        ]);
        setStats(appointmentStats);
        setAppointments(appointmentsData.filter(a => a.status !== 'completed' && a.status !== 'cancelled').slice(0, 4));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: FiCalendar, label: 'Upcoming Appointments', value: stats.upcoming, color: 'bg-blue-500' },
    { icon: FiClock, label: 'Pending', value: stats.pending, color: 'bg-orange-500' },
    { icon: FiCheckCircle, label: 'Completed', value: stats.completed, color: 'bg-green-500' },
    { icon: FiXCircle, label: 'Cancelled', value: stats.cancelled, color: 'bg-red-500' },
  ];

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card>
              <div className="flex items-center space-x-4">
                <div className={`${stat.color} p-4 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
          <Link to="/patient/profile" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
            <FiUser /> <span>Profile</span>
          </Link>
        </div>
        <div className="space-y-4">
          {appointments.length > 0 ? appointments.map((apt, i) => (
            <motion.div
              key={apt._id || i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{apt.doctor?.name || 'Doctor'}</p>
                  <p className="text-primary-600">{apt.doctor?.specialization || 'General'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {apt.status === 'pending' ? 'Active' : apt.status}
                </span>
              </div>
              <div className="mt-3 flex items-center space-x-6 text-sm text-gray-600">
                <span>{new Date(apt.date).toLocaleDateString()}</span>
                <span>{apt.time || 'Time TBD'}</span>
              </div>
            </motion.div>
          )) : (
            <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <FiGrid className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold">Quick Access</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { icon: FiCalendar, label: 'My Appointments', path: '/patient/appointments', color: 'bg-purple-500' },
            { icon: FiBriefcase, label: 'Book Appointment', path: '/patient/book', color: 'bg-green-500' },
            { icon: FiUser, label: 'Profile', path: '/patient/profile', color: 'bg-blue-500' },
            { icon: FiSettings, label: 'Settings', path: '/patient/settings', color: 'bg-gray-600' },
          ].map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.div whileHover={{ scale: 1.03 }} className={`${item.color} p-4 rounded-xl text-white flex items-center space-x-3 hover:opacity-90 transition-opacity`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PatientDashboard;
