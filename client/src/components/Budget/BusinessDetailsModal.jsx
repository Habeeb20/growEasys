




/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';
import Loading from '../../utils/Loading';
const BusinessDetailsModal = ({ isOpen = false, onClose = () => {}, onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    state: '',
    lga: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessName || !formData.address || !formData.state || !formData.lga) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.put(`${BASE_URL}/budget/business-details`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess(); // This will refetch user
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // ... (rest of your modal JSX, unchanged)
  return (
    // Your existing modal JSX here
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-light-deep-green">Complete Your Business Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition transform hover:scale-110">
            <FiX size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">This is a one-time setup. Tell us about your business to get started!</p>
        
        {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            required
          />
          <input
            type="text"
            name="lga"
            placeholder="LGA (Local Government Area)"
            value={formData.lga}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-light-deep-green text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? <Loading />: 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessDetailsModal;