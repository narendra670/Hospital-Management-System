import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiDownload, FiSearch, FiDollarSign } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/common/Button';
import pharmacyService from '../../services/pharmacyService';
import inventoryService from '../../services/inventoryService';

const PharmacyBilling = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [hospital, setHospital] = useState({
    name: 'MediCare Hospital',
    address: '123 Health Street, Medical City',
    phone: '123-456-7890',
    gstNo: 'GSTIN1234567890',
    accountNo: 'SBIN000123456789',
  });
  const [patient, setPatient] = useState({ name: '', address: '', phone: '' });
  const [items, setItems] = useState([
    { medicineName: '', batch: '', expiryDate: '', quantity: 1, rate: 0, gst: 12, inventoryItemId: '' },
  ]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchInventory();
    fetchBills();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await inventoryService.getAll();
      setInventory(data.filter(i => i.category === 'medicine'));
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  const fetchBills = async () => {
    try {
      const { data } = await pharmacyService.getBills();
      setBills(data);
    } catch (err) {
      console.error('Error fetching bills:', err);
    }
  };

  const filteredInventory = inventory.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = () => {
    setItems([...items, { medicineName: '', batch: '', expiryDate: '', quantity: 1, rate: 0, gst: 12, inventoryItemId: '' }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const selectMedicine = (index, med) => {
    const updated = [...items];
    updated[index] = {
      medicineName: med.name,
      batch: med.batch || '',
      expiryDate: med.expiryDate ? med.expiryDate.slice(0, 10) : '',
      quantity: 1,
      rate: med.unitPrice || 0,
      gst: med.gst || 12,
      inventoryItemId: med._id,
    };
    setItems(updated);
    setShowSearch(false);
    setSearchTerm('');
  };

  const calculateItemTotal = (item) => {
    const amount = item.quantity * item.rate;
    const gstAmount = (amount * item.gst) / 100;
    return { amount, gstAmount, total: amount + gstAmount };
  };

  const calculateBill = () => {
    let subtotal = 0, totalGst = 0;
    items.forEach(item => {
      const { amount, gstAmount } = calculateItemTotal(item);
      subtotal += amount;
      totalGst += gstAmount;
    });
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      totalGst: Math.round(totalGst * 100) / 100,
      grandTotal: Math.round((subtotal + totalGst) * 100) / 100,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient.name.trim()) {
      alert('Please enter patient name');
      return;
    }
    const invalidItem = items.find(i => !i.medicineName.trim());
    if (invalidItem) {
      alert('Please fill in all medicine names');
      return;
    }
    setLoading(true);
    setSuccess('');
    try {
      const payload = { patient, hospital, items };
      await pharmacyService.createBill(payload);
      setSuccess(`Bill created successfully!`);
      setPatient({ name: '', address: '', phone: '' });
      setItems([{ medicineName: '', batch: '', expiryDate: '', quantity: 1, rate: 0, gst: 12, inventoryItemId: '' }]);
      fetchBills();
      fetchInventory();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating bill');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (billId) => {
    try {
      const response = await pharmacyService.getPDF(billId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${billId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error downloading PDF');
    }
  };

  const totals = calculateBill();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">New Pharmacy Bill</h3>
            <div className="flex items-center space-x-2">
              <FiDollarSign className="text-primary-600 w-5 h-5" />
              <span className="text-sm text-gray-500">Create Invoice</span>
            </div>
          </div>

          {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hospital Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Hospital Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <input type="text" placeholder="Hospital Name" value={hospital.name} onChange={(e) => setHospital({ ...hospital, name: e.target.value })} className="input-field text-sm" />
                <input type="text" placeholder="Address" value={hospital.address} onChange={(e) => setHospital({ ...hospital, address: e.target.value })} className="input-field text-sm" />
                <input type="text" placeholder="Phone" value={hospital.phone} onChange={(e) => setHospital({ ...hospital, phone: e.target.value })} className="input-field text-sm" />
                <input type="text" placeholder="GST No" value={hospital.gstNo} onChange={(e) => setHospital({ ...hospital, gstNo: e.target.value })} className="input-field text-sm" />
                <input type="text" placeholder="Account No" value={hospital.accountNo} onChange={(e) => setHospital({ ...hospital, accountNo: e.target.value })} className="input-field text-sm" />
              </div>
            </div>

            {/* Patient Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Patient Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="text" placeholder="Patient Name *" value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} className="input-field" required />
                <input type="text" placeholder="Address" value={patient.address} onChange={(e) => setPatient({ ...patient, address: e.target.value })} className="input-field" />
                <input type="text" placeholder="Phone" value={patient.phone} onChange={(e) => setPatient({ ...patient, phone: e.target.value })} className="input-field" />
              </div>
            </div>

            {/* Items Table */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-700">Medicines</h4>
                <div className="flex space-x-2">
                  <button type="button" onClick={() => setShowSearch(!showSearch)} className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700">
                    <FiSearch /> <span>Search Medicine</span>
                  </button>
                  <button type="button" onClick={addItem} className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700">
                    <FiPlus /> <span>Add Row</span>
                  </button>
                </div>
              </div>

              {showSearch && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <input type="text" placeholder="Search medicines..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field mb-2" autoFocus />
                  <div className="max-h-40 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-2">
                    {filteredInventory.map(med => (
                      <button type="button" key={med._id} onClick={() => {
                        const idx = items.findIndex(i => !i.medicineName);
                        selectMedicine(idx >= 0 ? idx : items.length - 1, med);
                      }} className="text-left p-2 bg-white rounded hover:bg-primary-50 text-sm border">
                        <span className="font-medium">{med.name}</span>
                        <span className="text-gray-500 ml-2">Rs.{med.unitPrice} | Stock: {med.quantity}</span>
                        {med.batch && <span className="text-gray-400 ml-1">({med.batch})</span>}
                      </button>
                    ))}
                    {filteredInventory.length === 0 && <p className="text-gray-400 text-sm col-span-3">No medicines found</p>}
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-2 font-semibold">#</th>
                      <th className="p-2 font-semibold">Medicine Name</th>
                      <th className="p-2 font-semibold">Batch</th>
                      <th className="p-2 font-semibold">Expiry</th>
                      <th className="p-2 font-semibold">Qty</th>
                      <th className="p-2 font-semibold">Rate</th>
                      <th className="p-2 font-semibold">GST%</th>
                      <th className="p-2 font-semibold">Amount</th>
                      <th className="p-2 font-semibold">GST Amt</th>
                      <th className="p-2 font-semibold">Total</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => {
                      const { amount, gstAmount, total } = calculateItemTotal(item);
                      return (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-2 text-center">{idx + 1}</td>
                          <td className="p-2">
                            <input type="text" value={item.medicineName} onChange={(e) => updateItem(idx, 'medicineName', e.target.value)} className="input-field text-sm w-40" placeholder="Medicine name" />
                          </td>
                          <td className="p-2">
                            <input type="text" value={item.batch} onChange={(e) => updateItem(idx, 'batch', e.target.value)} className="input-field text-sm w-24" placeholder="Batch" />
                          </td>
                          <td className="p-2">
                            <input type="date" value={item.expiryDate} onChange={(e) => updateItem(idx, 'expiryDate', e.target.value)} className="input-field text-sm w-28" />
                          </td>
                          <td className="p-2">
                            <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))} className="input-field text-sm w-16" />
                          </td>
                          <td className="p-2">
                            <input type="number" min="0" step="0.01" value={item.rate} onChange={(e) => updateItem(idx, 'rate', Number(e.target.value))} className="input-field text-sm w-20" />
                          </td>
                          <td className="p-2">
                            <select value={item.gst} onChange={(e) => updateItem(idx, 'gst', Number(e.target.value))} className="input-field text-sm w-16">
                              <option value={0}>0%</option>
                              <option value={5}>5%</option>
                              <option value={12}>12%</option>
                              <option value={18}>18%</option>
                              <option value={28}>28%</option>
                            </select>
                          </td>
                          <td className="p-2 text-right">Rs.{amount.toFixed(2)}</td>
                          <td className="p-2 text-right">Rs.{gstAmount.toFixed(2)}</td>
                          <td className="p-2 text-right font-medium">Rs.{total.toFixed(2)}</td>
                          <td className="p-2">
                            <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>Rs.{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total GST:</span>
                  <span>Rs.{totals.totalGst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Grand Total:</span>
                  <span>Rs.{totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Generate Bill'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Recent Bills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <h3 className="text-xl font-semibold mb-4">Recent Bills</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 font-semibold">Bill No</th>
                  <th className="p-3 font-semibold">Patient</th>
                  <th className="p-3 font-semibold">Items</th>
                  <th className="p-3 font-semibold">Total</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.slice(0, 10).map((bill) => (
                  <tr key={bill._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{bill.billNumber}</td>
                    <td className="p-3">{bill.patient.name}</td>
                    <td className="p-3">{bill.items.length}</td>
                    <td className="p-3">Rs.{bill.grandTotal.toFixed(2)}</td>
                    <td className="p-3">{new Date(bill.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <button onClick={() => handleDownloadPDF(bill._id)} className="flex items-center space-x-1 text-primary-600 hover:text-primary-700">
                        <FiDownload /> <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {bills.length === 0 && (
                  <tr><td colSpan="6" className="p-3 text-center text-gray-500">No bills yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PharmacyBilling;
