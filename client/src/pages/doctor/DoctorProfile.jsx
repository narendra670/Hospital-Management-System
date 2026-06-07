import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import doctorService from '../../services/doctorService';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    specialization: '',
    experience: '',
    qualification: '',
    consultationFee: '',
    availableDays: [],
    availableTimeStart: '09:00',
    availableTimeEnd: '17:00',
    isAvailable: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const doctors = await doctorService.getAll();
        const myProfile = doctors.find((d) => d.user?._id === user._id);
        if (myProfile) {
          setProfile(myProfile);
          setFormData({
            specialization: myProfile.specialization || '',
            experience: myProfile.experience || '',
            qualification: myProfile.qualification || '',
            consultationFee: myProfile.consultationFee || '',
            availableDays: myProfile.availableDays || [],
            availableTimeStart: myProfile.availableTime?.start || '09:00',
            availableTimeEnd: myProfile.availableTime?.end || '17:00',
            isAvailable: myProfile.isAvailable !== undefined ? myProfile.isAvailable : true,
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await doctorService.update(profile._id, {
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        qualification: formData.qualification,
        consultationFee: parseFloat(formData.consultationFee),
        availableDays: formData.availableDays,
        availableTime: {
          start: formData.availableTimeStart,
          end: formData.availableTimeEnd,
        },
        isAvailable: formData.isAvailable,
      });
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>}

      {!profile && <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">No doctor profile found. Please contact admin.</div>}

      {profile && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} required className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee ($)</label>
              <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} required className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button key={day} type="button" onClick={() => handleDayToggle(day)} className={`px-3 py-1 rounded-full text-sm ${formData.availableDays.includes(day) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input type="time" name="availableTimeStart" value={formData.availableTimeStart} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input type="time" name="availableTimeEnd" value={formData.availableTimeEnd} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })} className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Available for appointments</span>
            </label>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      )}
    </div>
  );
};

export default DoctorProfile;
