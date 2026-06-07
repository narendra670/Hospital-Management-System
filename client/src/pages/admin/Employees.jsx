import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUserCheck, FiUserX, FiBriefcase, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import employeeService from '../../services/employeeService';

const DEPARTMENTS = ['cardiology', 'neurology', 'orthopedics', 'pediatrics', 'general', 'pharmacy', 'administration', 'nursing', 'laboratory', 'radiology', 'emergency', 'hr', 'other'];

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, deptCount: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ user: '', employeeId: '', department: 'general', position: '', salary: 0, hireDate: '', phone: '', address: '', status: 'active', qualifications: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empData, statsData] = await Promise.all([
        employeeService.getAll(),
        employeeService.getStats(),
      ]);
      setEmployees(empData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        qualifications: form.qualifications ? form.qualifications.split(',').map((q) => q.trim()) : [],
      };
      if (editing) {
        await employeeService.update(editing._id, payload);
      } else {
        await employeeService.create(payload);
      }
      setShowModal(false);
      setEditing(null);
      setForm({ user: '', employeeId: '', department: 'general', position: '', salary: 0, hireDate: '', phone: '', address: '', status: 'active', qualifications: '' });
      fetchData();
    } catch (err) {
      alert('Error saving employee');
    }
  };

  const handleEdit = (emp) => {
    setEditing(emp);
    setForm({
      user: emp.user?._id || '',
      employeeId: emp.employeeId || '',
      department: emp.department,
      position: emp.position,
      salary: emp.salary,
      hireDate: emp.hireDate ? emp.hireDate.slice(0, 10) : '',
      phone: emp.phone || '',
      address: emp.address || '',
      status: emp.status,
      qualifications: emp.qualifications ? emp.qualifications.join(', ') : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee record?')) {
      try {
        await employeeService.delete(id);
        fetchData();
      } catch (err) {
        alert('Error deleting employee');
      }
    }
  };

  const statCards = [
    { icon: FiUsers, label: 'Total Staff', value: stats.total, color: 'bg-blue-500' },
    { icon: FiUserCheck, label: 'Active', value: stats.active, color: 'bg-green-500' },
    { icon: FiUserX, label: 'Inactive', value: stats.inactive, color: 'bg-orange-500' },
    { icon: FiBriefcase, label: 'Departments', value: stats.deptCount, color: 'bg-purple-500' },
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
          <h3 className="text-xl font-semibold">Employee Records</h3>
          <button onClick={() => { setEditing(null); setForm({ user: '', employeeId: '', department: 'general', position: '', salary: 0, hireDate: '', phone: '', address: '', status: 'active', qualifications: '' }); setShowModal(true); }} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <FiPlus /> <span>Add Employee</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 font-semibold">Employee</th>
                <th className="p-3 font-semibold">Department</th>
                <th className="p-3 font-semibold">Position</th>
                <th className="p-3 font-semibold">Salary</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <p className="font-medium">{emp.user?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{emp.employeeId || ''}</p>
                  </td>
                  <td className="p-3 capitalize">{emp.department}</td>
                  <td className="p-3">{emp.position}</td>
                  <td className="p-3">${emp.salary?.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'active' ? 'bg-green-100 text-green-700' : emp.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(emp)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(emp._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan="6" className="p-3 text-center text-gray-500">No employees found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditing(null); }} title={editing ? 'Edit Employee' : 'Add Employee'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="User ID" value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} placeholder="MongoDB User ID" />
            <Input label="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input-field">
                {DEPARTMENTS.map((d) => <option key={d} value={d} className="capitalize">{d}</option>)}
              </select>
            </div>
            <Input label="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required />
            <Input label="Salary" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })} />
            <Input label="Hire Date" type="date" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
            <div className="col-span-2">
              <Input label="Qualifications (comma-separated)" value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field h-20" />
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add'} Employee</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
