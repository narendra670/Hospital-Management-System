import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiUsers, FiClock, FiCheckCircle, FiGrid, FiUser, FiSettings } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import appointmentService from '../../services/appointmentService';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pending: 0,
    completed: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentStats, appointmentsData] = await Promise.all([
          appointmentService.getStats().catch(() => ({ today: 0, total: 0, pending: 0, completed: 0 })),
          appointmentService.getAll().catch(() => []),
        ]);
        setStats({
          todayAppointments: appointmentStats.today || 0,
          totalPatients: appointmentStats.totalPatients || 0,
          pending: appointmentStats.pending || 0,
          completed: appointmentStats.completed || 0,
        });
        setAppointments(appointmentsData.slice(0, 4));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: FiCalendar, label: "Today's Appointments", value: stats.todayAppointments, color: 'bg-blue-500' },
    { icon: FiUsers, label: 'Total Patients', value: stats.totalPatients, color: 'bg-green-500' },
    { icon: FiClock, label: 'Pending', value: stats.pending, color: 'bg-orange-500' },
    { icon: FiCheckCircle, label: 'Completed', value: stats.completed, color: 'bg-purple-500' },
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
          <h3 className="text-xl font-semibold">Recent Appointments</h3>
          <Link to="/doctor/profile" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
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
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 px-3 py-2 rounded-lg">
                  <span className="text-primary-700 font-semibold text-sm">
                    {new Date(apt.date || apt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{apt.patient?.name || 'Patient'}</p>
                  <p className="text-sm text-gray-500">{apt.type || apt.status || 'Consultation'}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {apt.status || 'Pending'}
              </span>
            </motion.div>
          )) : (
            <p className="text-gray-500 text-center py-4">No appointments found</p>
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
            { icon: FiCalendar, label: 'Appointments', path: '/doctor/appointments', color: 'bg-purple-500' },
            { icon: FiUsers, label: 'Patients', path: '/doctor/patients', color: 'bg-green-500' },
            { icon: FiUser, label: 'Profile', path: '/doctor/profile', color: 'bg-blue-500' },
            { icon: FiSettings, label: 'Settings', path: '/doctor/settings', color: 'bg-gray-600' },
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

export default DoctorDashboard;
