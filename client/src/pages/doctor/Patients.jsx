import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';
import patientService from '../../services/patientService';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientService.getAll();
        setPatients(data);
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Patients</h2>

      <div className="bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Gender</th>
              <th className="text-left p-4">Blood Group</th>
              <th className="text-left p-4">Contact</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
            ) : patients.length > 0 ? patients.map((patient) => (
              <tr key={patient._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{patient.user?.name || 'N/A'}</td>
                <td className="p-4 capitalize">{patient.gender || 'N/A'}</td>
                <td className="p-4">{patient.bloodGroup || 'N/A'}</td>
                <td className="p-4">{patient.user?.phone || 'N/A'}</td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="text-center p-4">No patients found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DoctorPatients;