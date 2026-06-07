import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import leaveService from '../../services/leaveService';
import employeeService from '../../services/employeeService';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, totalDaysApproved: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ employeeId: '', leaveType: 'sick', startDate: '', endDate: '', reason: '', status: 'pending', notes: '' });


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leavesData, statsData, empData] = await Promise.all([
        leaveService.getAll(),
        leaveService.getStats(),
        employeeService.getAll(),
      ]);
      setLeaves(leavesData);
      setStats(statsData);
      setEmployees(empData);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await leaveService.update(editing._id, form);
      } else {
        await leaveService.create(form);
      }
      setShowModal(false);
      setEditing(null);
      setForm({ employeeId: '', leaveType: 'sick', startDate: '', endDate: '', reason: '', status: 'pending', notes: '' });
      fetchData();
    } catch (err) {
      alert('Error saving leave record');
    }
  };

  const handleEdit = (leave) => {
    setEditing(leave);
    setForm({
      employeeId: leave.employee?._id || '',
      leaveType: leave.leaveType,
      startDate: leave.startDate ? leave.startDate.slice(0, 10) : '',
      endDate: leave.endDate ? leave.endDate.slice(0, 10) : '',
      reason: leave.reason || '',
      status: leave.status,
      notes: leave.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave record?')) {
      try {
        await leaveService.delete(id);
        fetchData();
      } catch (err) {
        alert('Error deleting leave record');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await leaveService.update(id, { status: 'approved' });
      fetchData();
    } catch (err) {
      alert('Error approving leave');
    }
  };

  const handleReject = async (id) => {
    try {
      await leaveService.update(id, { status: 'rejected' });
      fetchData();
    } catch (err) {
      alert('Error rejecting leave');
    }
  };

  const statCards = [
    { icon: FiCalendar, label: 'Total Requests', value: stats.total, color: 'bg-blue-500' },
    { icon: FiClock, label: 'Pending', value: stats.pending, color: 'bg-orange-500' },
    { icon: FiCheckCircle, label: 'Approved', value: stats.approved, color: 'bg-green-500' },
    { icon: FiXCircle, label: 'Rejected', value: stats.rejected, color: 'bg-red-500' },
  ];

  const filteredLeaves = selectedEmployeeId
    ? leaves.filter((l) => l.employee?._id === selectedEmployeeId)
    : leaves;

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
          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-semibold">Leave Requests</h3>
            <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="input-field py-1.5 text-sm">
              <option value="">All Employees</option>
              <option value="01">Abhishek</option>
              <option value="02">Priya</option>
              <option value="03">Amit</option>
              <option value="04">Sneha</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.user?.name || emp.employeeId}</option>


              ))}
            </select>
          </div>
          <button onClick={() => { setEditing(null); setForm({ employeeId: selectedEmployeeId || '', leaveType: 'sick', startDate: '', endDate: '', reason: '', status: 'pending', notes: '' }); setShowModal(true); }} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <FiPlus /> <span>New Leave</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 font-semibold">Employee</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Start</th>
                <th className="p-3 font-semibold">End</th>
                <th className="p-3 font-semibold">Days</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => {
                const start = new Date(leave.startDate);
                const end = new Date(leave.endDate);
                const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                return (
                  <tr key={leave._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{leave.employee?.user?.name || 'N/A'}</td>
                    <td className="p-3 capitalize">{leave.leaveType}</td>
                    <td className="p-3">{start.toLocaleDateString()}</td>
                    <td className="p-3">{end.toLocaleDateString()}</td>
                    <td className="p-3">{days > 0 ? days : 1}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${leave.status === 'approved' ? 'bg-green-100 text-green-700' : leave.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-1">
                        {leave.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(leave._id)} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Approve"><FiCheck /></button>
                            <button onClick={() => handleReject(leave._id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Reject"><FiX /></button>
                          </>
                        )}
                        <button onClick={() => handleEdit(leave)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FiEdit2 /></button>
                        <button onClick={() => handleDelete(leave._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLeaves.length === 0 && (
                <tr><td colSpan="7" className="p-3 text-center text-gray-500">No leave records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditing(null); }} title={editing ? `Edit Leave - ${employees.find(e => e._id === form.employeeId)?.user?.name || ''}` : 'New Leave Request'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            {editing ? (
              <div className="input-field bg-gray-50 text-gray-700 font-medium py-2 px-3 rounded-md">
                {employees.find(e => e._id === form.employeeId)?.user?.name || 'N/A'}
              </div>
            ) : (
              <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="input-field" required>
                <option value="">Select employee</option>
                <option value="01">Raghav</option>
                <option value="02">Priya</option>
                <option value="03">Amit</option>
                <option value="04">Sneha</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.user?.name || emp.employeeId}</option>
                ))}
              </select>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })} className="input-field">
                <option value="sick">Sick Leave</option>
                <option value="vacation">Vacation</option>
                <option value="personal">Personal</option>
                <option value="maternity">Maternity</option>
                <option value="paternity">Paternity</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="input-field h-20" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field h-20" />
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Submit'} Leave</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Leaves;
