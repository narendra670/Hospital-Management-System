import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiActivity, FiClock, FiEdit2, FiTrash2, FiPlus, FiPackage, FiClipboard, FiFileText, FiSettings, FiGrid } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Modal from '../../components/common/Modal';
import AddDoctor from '../../components/admin/AddDoctor';
import doctorService from '../../services/doctorService';
import patientService from '../../services/patientService';
import appointmentService from '../../services/appointmentService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    availableDoctors: 0,
    totalPatients: 0,
    appointments: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
  });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDoctor, setShowAddDoctor] = useState(false);

  const fetchData = async () => {
    try {
      const [doctorStats, appointmentStats, doctorsData, patientsData] = await Promise.all([
        doctorService.getStats().catch(() => ({ totalDoctors: 0, availableDoctors: 0 })),
        appointmentService.getStats().catch(() => ({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 })),
        doctorService.getAll().catch(() => []),
        patientService.getAll().catch(() => []),
      ]);
      setStats({
        totalDoctors: doctorStats.totalDoctors,
        availableDoctors: doctorStats.availableDoctors,
        totalPatients: patientsData.length,
        appointments: appointmentStats,
      });
      setDoctors(doctorsData.slice(0, 5));
      setPatients(patientsData.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorService.delete(id);
        setDoctors(doctors.filter(d => d._id !== id));
        alert('Doctor deleted successfully');
      } catch (err) {
        alert('Error deleting doctor');
      }
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.update(id, { status: 'inactive' });
        setPatients(patients.filter(p => p._id !== id));
        alert('Patient deactivated successfully');
      } catch (err) {
        alert('Error updating patient');
      }
    }
  };

  const statCards = [
    { icon: FiUsers, label: 'Total Doctors', value: stats.totalDoctors, color: 'bg-blue-500' },
    { icon: FiUsers, label: 'Total Patients', value: stats.totalPatients, color: 'bg-green-500' },
    { icon: FiCalendar, label: 'Total Appointments', value: stats.appointments.total, color: 'bg-purple-500' },
    { icon: FiActivity, label: 'Pending', value: stats.appointments.pending, color: 'bg-orange-500' },
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

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Doctors</h3>
            <button onClick={() => setShowAddDoctor(true)} className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
              <FiPlus /> <span>Add Doctor</span>
            </button>
          </div>
          <div className="space-y-3">
            {doctors.length > 0 ? doctors.map((doctor) => (
              <div key={doctor._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{doctor.user?.name || 'Doctor'}</p>
                  <p className="text-sm text-gray-500">{doctor.specialization || 'General'}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDeleteDoctor(doctor._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No doctors found</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Patients</h3>
            <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
              <FiPlus /> <span>Add Patient</span>
            </button>
          </div>
          <div className="space-y-3">
            {patients.length > 0 ? patients.map((patient) => (
              <div key={patient._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{patient.user?.name || 'Patient'}</p>
                  <p className="text-sm text-gray-500">{patient.gender || 'N/A'}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDeletePatient(patient._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No patients found</p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Appointment Overview</h3>
        <div className="space-y-4">
          {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FiClock className="text-gray-500" />
                <span className="capitalize">{status}</span>
              </div>
              <span className="font-semibold">{stats.appointments[status]}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Link to="/admin/inventory">
          <Card>
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-500 p-4 rounded-xl">
                <FiPackage className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-semibold">Inventory Management</p>
                <p className="text-gray-600">Manage stock, low stock alerts</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/admin/employees">
          <Card>
            <div className="flex items-center space-x-4">
              <div className="bg-teal-500 p-4 rounded-xl">
                <FiClipboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-semibold">Staff & HR</p>
                <p className="text-gray-600">Employees, shifts, leave tracking</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <FiGrid className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold">Quick Access</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { icon: FiUsers, label: 'Doctors', path: '/admin/doctors', color: 'bg-blue-500' },
            { icon: FiUsers, label: 'Patients', path: '/admin/patients', color: 'bg-green-500' },
            { icon: FiCalendar, label: 'Appointments', path: '/admin/appointments', color: 'bg-purple-500' },
            { icon: FiPackage, label: 'Inventory', path: '/admin/inventory', color: 'bg-indigo-500' },
            { icon: FiClipboard, label: 'Employees', path: '/admin/employees', color: 'bg-teal-500' },
            { icon: FiClock, label: 'Shifts', path: '/admin/shifts', color: 'bg-pink-500' },
            { icon: FiFileText, label: 'Leaves', path: '/admin/leaves', color: 'bg-orange-500' },
            { icon: FiSettings, label: 'Settings', path: '/admin/settings', color: 'bg-gray-600' },
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

      <Modal isOpen={showAddDoctor} onClose={() => setShowAddDoctor(false)} title="Add New Doctor">
        <AddDoctor onClose={() => setShowAddDoctor(false)} onSuccess={fetchData} />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
