import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiAlertTriangle, FiDollarSign, FiPlus, FiEdit2, FiTrash2, FiTrendingUp, FiArchive } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import inventoryService from '../../services/inventoryService';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ totalItems: 0, totalValue: 0, lowStockCount: 0, totalQuantity: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMovement, setShowMovement] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'other', quantity: 0, unit: 'pieces', unitPrice: 0, supplier: '', reorderLevel: 10, batch: '', gst: 0, expiryDate: '', description: '', location: '' });
  const [movementForm, setMovementForm] = useState({ itemId: '', type: 'in', quantity: 1, reference: '', notes: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsData, statsData] = await Promise.all([
        inventoryService.getAll(),
        inventoryService.getStats(),
      ]);
      setItems(itemsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await inventoryService.update(editing._id, form);
      } else {
        await inventoryService.create(form);
      }
      setShowModal(false);
      setEditing(null);
      setForm({ name: '', category: 'other', quantity: 0, unit: 'pieces', unitPrice: 0, supplier: '', reorderLevel: 10, batch: '', gst: 0, expiryDate: '', description: '', location: '' });
      fetchData();
    } catch (err) {
      alert('Error saving item');
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      supplier: item.supplier || '',
      reorderLevel: item.reorderLevel,
      batch: item.batch || '',
      gst: item.gst || 0,
      expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : '',
      description: item.description || '',
      location: item.location || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryService.delete(id);
        fetchData();
      } catch (err) {
        alert('Error deleting item');
      }
    }
  };

  const handleMovement = async (e) => {
    e.preventDefault();
    try {
      await inventoryService.createMovement(movementForm);
      setShowMovement(false);
      setMovementForm({ itemId: '', type: 'in', quantity: 1, reference: '', notes: '' });
      fetchData();
    } catch (err) {
      alert('Error recording movement');
    }
  };

  const statCards = [
    { icon: FiPackage, label: 'Total Items', value: stats.totalItems, color: 'bg-blue-500' },
    { icon: FiTrendingUp, label: 'Total Quantity', value: stats.totalQuantity, color: 'bg-green-500' },
    { icon: FiDollarSign, label: 'Total Value', value: `$${stats.totalValue.toLocaleString()}`, color: 'bg-purple-500' },
    { icon: FiAlertTriangle, label: 'Low Stock Alerts', value: stats.lowStockCount, color: 'bg-red-500' },
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
          <h3 className="text-xl font-semibold">Inventory Items</h3>
          <div className="flex space-x-2">
            <button onClick={() => { setEditing(null); setForm({ name: '', category: 'other', quantity: 0, unit: 'pieces', unitPrice: 0, supplier: '', reorderLevel: 10, batch: '', gst: 0, expiryDate: '', description: '', location: '' }); setShowModal(true); }} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              <FiPlus /> <span>Add Item</span>
            </button>
            <button onClick={() => setShowMovement(true)} className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              <FiArchive /> <span>Stock Movement</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Batch</th>
                <th className="p-3 font-semibold">GST</th>
                <th className="p-3 font-semibold">Quantity</th>
                <th className="p-3 font-semibold">Unit</th>
                <th className="p-3 font-semibold">Price</th>
                <th className="p-3 font-semibold">Expiry</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 capitalize">{item.category}</td>
                    <td className="p-3">{item.batch || '-'}</td>
                    <td className="p-3">{item.gst ? `${item.gst}%` : '-'}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{item.unit}</td>
                    <td className="p-3">${item.unitPrice}</td>
                    <td className="p-3">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {item.isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FiEdit2 /></button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="10" className="p-3 text-center text-gray-500">No inventory items found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditing(null); }} title={editing ? 'Edit Item' : 'Add New Item'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Item Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="medicine">Medicine</option>
                <option value="equipment">Equipment</option>
                <option value="supplies">Supplies</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required />
            <Input label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            <Input label="Unit Price" type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })} />
            <Input label="Reorder Level" type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })} />
            <Input label="Supplier" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
            <Input label="Batch No" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} />
            <Input label="GST (%)" type="number" value={form.gst} onChange={(e) => setForm({ ...form, gst: Number(e.target.value) })} />
            <Input label="Expiry Date" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field h-20" />
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add'} Item</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showMovement} onClose={() => setShowMovement(false)} title="Record Stock Movement">
        <form onSubmit={handleMovement} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
            <select value={movementForm.itemId} onChange={(e) => setMovementForm({ ...movementForm, itemId: e.target.value })} className="input-field" required>
              <option value="">Select item</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>{item.name} (in stock: {item.quantity})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={movementForm.type} onChange={(e) => setMovementForm({ ...movementForm, type: e.target.value })} className="input-field">
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
            </select>
          </div>
          <Input label="Quantity" type="number" min="1" value={movementForm.quantity} onChange={(e) => setMovementForm({ ...movementForm, quantity: Number(e.target.value) })} required />
          <Input label="Reference (invoice/order #)" value={movementForm.reference} onChange={(e) => setMovementForm({ ...movementForm, reference: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={movementForm.notes} onChange={(e) => setMovementForm({ ...movementForm, notes: e.target.value })} className="input-field h-20" />
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setShowMovement(false)}>Cancel</Button>
            <Button type="submit">Record Movement</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
