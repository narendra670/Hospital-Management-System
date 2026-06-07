import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import Layout from '../components/layout/Layout.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Home from '../pages/Home.jsx';
import About from '../pages/About.jsx';
import Services from '../pages/Services.jsx';
import Contact from '../pages/Contact.jsx';
import Login from '../pages/auth/Login.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminDoctors from '../pages/admin/Doctors.jsx';
import AdminPatients from '../pages/admin/Patients.jsx';
import AdminAppointments from '../pages/admin/Appointments.jsx';
import AdminSettings from '../pages/admin/Settings.jsx';
import AdminInventory from '../pages/admin/Inventory.jsx';
import AdminEmployees from '../pages/admin/Employees.jsx';
import AdminShifts from '../pages/admin/Shifts.jsx';
import AdminLeaves from '../pages/admin/Leaves.jsx';
import PharmacyBilling from '../pages/admin/PharmacyBilling.jsx';
import DoctorDashboard from '../pages/doctor/DoctorDashboard.jsx';
import DoctorProfile from '../pages/doctor/DoctorProfile.jsx';
import DoctorAppointments from '../pages/doctor/Appointments.jsx';
import DoctorPatients from '../pages/doctor/Patients.jsx';
import DoctorSettings from '../pages/doctor/Settings.jsx';
import PatientDashboard from '../pages/patient/PatientDashboard.jsx';
import PatientProfile from '../pages/patient/PatientProfile.jsx';
import PatientAppointments from '../pages/patient/Appointments.jsx';
import PatientBookAppointment from '../pages/patient/BookAppointment.jsx';
import PatientSettings from '../pages/patient/Settings.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPlaceholder />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/patients" element={<AdminPatients />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
            <Route path="/admin/employees" element={<AdminEmployees />} />
            <Route path="/admin/shifts" element={<AdminShifts />} />
            <Route path="/admin/leaves" element={<AdminLeaves />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/pharmacy" element={<PharmacyBilling />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/settings" element={<DoctorSettings />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route path="/patient/appointments" element={<PatientAppointments />} />
            <Route path="/patient/book" element={<PatientBookAppointment />} />
            <Route path="/patient/settings" element={<PatientSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

const DashboardPlaceholder = () => (
  <div className="text-center py-20">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
    <p className="text-gray-600">Please navigate to your role-specific dashboard.</p>
  </div>
);

export default AppRoutes;
