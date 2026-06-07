import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCalendar, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import shiftService from '../../services/shiftService';
import employeeService from '../../services/employeeService';
import authService from '../../services/authService';

const Shifts = () => {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ totalToday: 0, totalWeekly: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ employee: '', date: '', startTime: '', endTime: '', department: '', notes: '' });
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [empForm, setEmpForm] = useState({ name: '', email: '', password: '', department: '', position: '' });
  const [addingEmp, setAddingEmp] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [shiftsData, statsData, empData] = await Promise.all([
        shiftService.getAll().catch((err) => { console.error('Shifts fetch failed:', err); return []; }),
        shiftService.getStats().catch((err) => { console.error('Stats fetch failed:', err); return { totalToday: 0, totalWeekly: 0 }; }),
        employeeService.getAll().catch((err) => { console.error('Employees fetch failed:', err); return []; }),
      ]);
      setShifts(shiftsData);
      setStats(statsData);
      setEmployees(empData);
    } catch (err) {
      console.error('Error fetching shifts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await shiftService.update(editing._id, form);
      } else {
        await shiftService.create(form);
      }
      setShowModal(false);
      setEditing(null);
      setForm({ employee: '', date: '', startTime: '', endTime: '', department: '', notes: '' });
      fetchData();
    } catch (err) {
      alert('Error saving shift');
    }
  };

  const handleEdit = (shift) => {
    setEditing(shift);
    setForm({
      employee: shift.employee?._id || '',
      date: shift.date ? shift.date.slice(0, 10) : '',
      startTime: shift.startTime,
      endTime: shift.endTime,
      department: shift.department || '',
      notes: shift.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      try {
        await shiftService.delete(id);
        fetchData();
      } catch (err) {
        alert('Error deleting shift');
      }
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setAddingEmp(true);
    try {
      const user = await authService.register({ name: empForm.name, email: empForm.email, password: empForm.password, role: 'employee' });
      await employeeService.create({ user: user._id, department: empForm.department, position: empForm.position });
      setShowAddEmp(false);
      setEmpForm({ name: '', email: '', password: '', department: '', position: '' });
      const empData = await employeeService.getAll();
      setEmployees(empData);
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding employee');
    } finally {
      setAddingEmp(false);
    }
  };

  const statCards = [
    { icon: FiClock, label: "Today's Shifts", value: stats.totalToday, color: 'bg-blue-500' },
    { icon: FiCalendar, label: 'This Week', value: stats.totalWeekly, color: 'bg-green-500' },
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
          <h3 className="text-xl font-semibold">Shift Schedule</h3>
          <button onClick={() => { setEditing(null); setForm({ employee: '', date: '', startTime: '', endTime: '', department: '', notes: '' }); setShowModal(true); }} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <FiPlus /> <span>Add Shift</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 font-semibold">Employee</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Start</th>
                <th className="p-3 font-semibold">End</th>
                <th className="p-3 font-semibold">Department</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{shift.employee?.user?.name || 'N/A'}</td>
                  <td className="p-3">{shift.date ? new Date(shift.date).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-3">{shift.startTime}</td>
                  <td className="p-3">{shift.endTime}</td>
                  <td className="p-3 capitalize">{shift.department || 'N/A'}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(shift)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(shift._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {shifts.length === 0 && (
                <tr><td colSpan="6" className="p-3 text-center text-gray-500">No shifts scheduled</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditing(null); }} title={editing ? 'Edit Shift' : 'Add Shift'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} className="input-field" required>
              <option value="">Select employee</option>
              {employees.length === 0 && <option disabled>No employees — add one below</option>}
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.user?.name || emp.employeeId}</option>
              ))}
            </select>
            <button type="button" onClick={() => setShowAddEmp(!showAddEmp)} className="text-sm text-primary-600 hover:underline mt-1">
              {showAddEmp ? '- Cancel' : '+ Add New Employee'}
            </button>
            {showAddEmp && (
              <div className="mt-2 p-3 border rounded-lg bg-gray-50">
                <p className="text-sm font-medium mb-2">New Employee</p>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Name" value={empForm.name} onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })} className="input-field text-sm" required />
                  <input placeholder="Email" type="email" value={empForm.email} onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })} className="input-field text-sm" required />
                  <input placeholder="Password" type="password" value={empForm.password} onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })} className="input-field text-sm" required />
                  <select value={empForm.department} onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })} className="input-field text-sm" required>
                    <option value="">Department</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="neurology">Neurology</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="general">General</option>
                    <option value="nursing">Nursing</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="laboratory">Laboratory</option>
                    <option value="radiology">Radiology</option>
                    <option value="emergency">Emergency</option>
                    <option value="administration">Administration</option>
                    <option value="hr">HR</option>
                    <option value="other">Other</option>
                  </select>
                  <input placeholder="Position e.g. Nurse" value={empForm.position} onChange={(e) => setEmpForm({ ...empForm, position: e.target.value })} className="input-field text-sm" required />
                </div>
                <button type="button" onClick={handleAddEmployee} disabled={addingEmp} className="mt-2 text-xs bg-primary-600 text-white px-3 py-1.5 rounded hover:bg-primary-700 disabled:opacity-50">
                  {addingEmp ? 'Adding...' : 'Save Employee'}
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            <Input label="Start Time" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
            <Input label="End Time" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field h-20" />
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add'} Shift</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Shifts;
