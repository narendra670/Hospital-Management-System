import { useState } from 'react';
import { Outlet, Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiActivity,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiSettings,
  FiBriefcase,
  FiPackage,
  FiClock,
  FiClipboard,
  FiFileText,
  FiDollarSign,
} from 'react-icons/fi';
import doctor1 from '../../assets/doctor1.jpg';
import doct2 from '../../assets/doct2.jpg';
import doct3 from '../../assets/doct3.jpg';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;

  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin': return '/admin/dashboard';
      case 'doctor': return '/doctor/dashboard';
      case 'patient': return '/patient/dashboard';
      default: return '/dashboard';
    }
  };

  const getSidebarLinks = () => {
    const base = [{ icon: FiHome, name: 'Dashboard', path: getDashboardLink() }];

    switch (user?.role) {
      case 'admin':
        return [
          ...base,
          { icon: FiUsers, name: 'Doctors', path: '/admin/doctors' },
          { icon: FiUser, name: 'Patients', path: '/admin/patients' },
          { icon: FiCalendar, name: 'Appointments', path: '/admin/appointments' },
          { icon: FiDollarSign, name: 'Pharmacy', path: '/admin/pharmacy' },
          { icon: FiPackage, name: 'Inventory', path: '/admin/inventory' },
          { icon: FiClipboard, name: 'Employees', path: '/admin/employees' },
          { icon: FiClock, name: 'Shifts', path: '/admin/shifts' },
          { icon: FiFileText, name: 'Leaves', path: '/admin/leaves' },
          { icon: FiSettings, name: 'Settings', path: '/admin/settings' },
        ];
      case 'doctor':
        return [
          ...base,
          { icon: FiCalendar, name: 'Appointments', path: '/doctor/appointments' },
          { icon: FiUsers, name: 'Patients', path: '/doctor/patients' },
          { icon: FiUser, name: 'Profile', path: '/doctor/profile' },
          { icon: FiSettings, name: 'Settings', path: '/doctor/settings' },
        ];
      case 'patient':
        return [
          ...base,
          { icon: FiCalendar, name: 'My Appointments', path: '/patient/appointments' },
          { icon: FiBriefcase, name: 'Book Appointment', path: '/patient/book' },
          { icon: FiUser, name: 'Profile', path: '/patient/profile' },
          { icon: FiSettings, name: 'Settings', path: '/patient/settings' },
        ];
      default:
        return base;
    }
  };

  const sidebarLinks = getSidebarLinks();

  const getAvatarImage = () => {
    if (!user) return doctor1;
    switch (user.role) {
      case 'admin':
        return doct3;
      case 'doctor':
        return doct2;
      case 'patient':
        return doctor1;
      default:
        return doctor1;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-primary-600 p-2 rounded-lg">
                  <FiActivity className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MediCare</span>
              </Link>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <link.icon className="w-5 h-5" />
              {sidebarOpen && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white shadow-sm p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user?.name}
            </h1>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                </div>
                <img src={getAvatarImage()} alt={user?.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary-200" />
              </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
