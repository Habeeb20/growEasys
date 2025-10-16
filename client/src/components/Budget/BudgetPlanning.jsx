/* eslint-disable no-unused-vars */



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// import Loading from '../../utils/Loading';

// const BudgetPlanning = () => {
//   const [budgetForm, setBudgetForm] = useState({
//     name: '',
//     type: 'departmental', // Default
//     amount: '',
//     description: '',
//     category: 'operations', // Default
//     fiscalYear: new Date().getFullYear().toString(),
//     tags: '', // Comma-separated string
//     alertThreshold: 80, // Default
//   });
//   const [budgets, setBudgets] = useState([]); // Fetched budgets
//   const [isLoading, setIsLoading] = useState(false); // For submit and fetch
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const token = localStorage.getItem('token');
//   const BASE_URL = import.meta.env.VITE_BACKEND_URL;

//   // Fetch budgets on mount
//   useEffect(() => {
//     const fetchBudgets = async () => {
//       setIsLoading(true);
//       try {
//         const res = await axios.get(`${BASE_URL}/budgets`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log(res.data, "feedbacks")
      
//        let dataArray = [];
//       if (Array.isArray(res.data)) {
//         dataArray = res.data;
//       } else if (res.data && Array.isArray(res.data.budgets)) {
//         dataArray = res.data.budgets;
//       } else {
//         console.warn('Unexpected data shape:', res.data);
//       }
//       setBudgets(dataArray);

//       } catch (err) {
//         setError('Failed to load budgets: ' + (err.response?.data?.error || err.message));
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchBudgets();
//   }, [token]);

//   const handleChange = (e) => {
//     setBudgetForm({ ...budgetForm, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');
//     setIsLoading(true);

//     // Client-side validation
//     if (!budgetForm.name || !budgetForm.amount || budgetForm.amount <= 0 || budgetForm.alertThreshold < 0 || budgetForm.alertThreshold > 100) {
//       setError('Please fill all required fields correctly (amount > 0, threshold 0-100)');
//       setIsLoading(false);
//       return;
//     }

//     const payload = {
//       ...budgetForm,
//       amount: Number(budgetForm.amount),
//       alertThreshold: Number(budgetForm.alertThreshold),
//       tags: budgetForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Array
//       // forecasts/scenarios omitted; add if needed
//     };

//     try {
//       const res = await axios.post(`${BASE_URL}/budgets`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBudgets([...budgets, res.data]); // Update local state
//       setSuccessMessage('Budget created successfully!');
//       setBudgetForm({ // Reset form
//         name: '',
//         type: 'departmental',
//         amount: '',
//         description: '',
//         category: 'operations',
//         fiscalYear: new Date().getFullYear().toString(),
//         tags: '',
//         alertThreshold: 80,
//       });
//       setTimeout(() => setSuccessMessage(''), 3000); // Fade success
//     } catch (err) {
//       setError('Failed to create budget: ' + (err.response?.data?.error || err.message));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Generate chart data from budgets (aggregate quarterly for demo; customize as needed)
//   const generateChartData = () => {
//     if (budgets.length === 0) return [];
//     // Mock quarterly aggregation (assume fiscalYear data; group by quarter logic here)
//     const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
//     return quarters.map((q, idx) => {
//       const quarterBudgets = budgets.filter(b => b.fiscalYear === budgetForm.fiscalYear); // Filter by year
//       const planned = quarterBudgets.reduce((sum, b) => sum + (b.amount / 4), 0); // Even split demo
//       const actual = quarterBudgets.reduce((sum, b) => sum + (b.spent / 4), 0);
//       const variance = planned - actual;
//       return { quarter: q, planned, actual, variance };
//     });
//   };

//   const chartData = generateChartData();

//   return (
//     <div className="space-y-6 relative">
//       {isLoading && <Loading />} {/* Full overlay */}

//       <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Budget Planning</h2>
      
//       {/* Success Message */}
//       {successMessage && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
//           {successMessage}
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {error}
//         </div>
//       )}

//       {/* Budget Creation Form */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Create New Budget</h3>
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Budget Name *"
//             value={budgetForm.name}
//             onChange={handleChange}
//             className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
//             required
//           />
//           <select
//             name="type"
//             value={budgetForm.type}
//             onChange={handleChange}
//             className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
//           >
//             <option value="departmental">Departmental</option>
//             <option value="project">Project</option>
//           </select>
//           <input
//             type="number"
//             name="amount"
//             placeholder="Amount ($) *"
//             value={budgetForm.amount}
//             onChange={handleChange}
//             className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
//             required
//           />
//           <select
//             name="category"
//             value={budgetForm.category}
//             onChange={handleChange}
//             className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
//           >
//             <option value="operations">Operations</option>
//             <option value="marketing">Marketing</option>
//             <option value="rd">R&D</option>
//             <option value="hr">HR</option>
//             <option value="other">Other</option>
//           </select>
//           <input
//             type="text"
//             name="fiscalYear"
//             placeholder="Fiscal Year (e.g., 2025)"
//             value={budgetForm.fiscalYear}
//             onChange={handleChange}
//             className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
//           />
//           <input
//             type="text"
//             name="tags"
//             placeholder="Tags (comma-separated, e.g., high-priority, Q4)"
//             value={budgetForm.tags}
//             onChange={handleChange}
//             className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
//           />
//           <input
//             type="text"
//             name="description"
//             placeholder="Description"
//             value={budgetForm.description}
//             onChange={handleChange}
//             className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700 lg:col-span-2"
//           />
//           <div className="flex items-center gap-2">
//             <label className="text-sm text-gray-700 dark:text-gray-300">Alert Threshold (%):</label>
//             <input
//               type="range"
//               name="alertThreshold"
//               min="0"
//               max="100"
//               value={budgetForm.alertThreshold}
//               onChange={handleChange}
//               className="flex-1"
//             />
//             <span className="text-sm font-medium">{budgetForm.alertThreshold}%</span>
//           </div>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="lg:col-span-3 bg-primary-600 text-white p-3 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50"
//           >
//             {isLoading ? 'Creating...' : 'Add Budget'}
//           </button>
//         </form>
//       </div>

//       {/* Forecast Line Chart */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Budget Forecast vs Actual (Quarterly)</h3>
//         {chartData.length > 0 ? (
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="quarter" />
//               <YAxis />
//               <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
//               <Legend />
//               <Line type="monotone" dataKey="planned" stroke="#2563EB" strokeWidth={3} name="Planned" />
//               <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} name="Actual Spent" />
//               <Line type="monotone" dataKey="variance" stroke="#EF4444" strokeWidth={2} name="Variance" dot={false} />
//             </LineChart>
//           </ResponsiveContainer>
//         ) : (
//           <p className="text-gray-500 text-center">No budget data available for chart. Create a budget to see forecasts.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BudgetPlanning;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Loading from '../../utils/Loading';
import { FiEye } from 'react-icons/fi'; // Added for view action
import { format, isValid } from 'date-fns'; // Added for date formatting

const BudgetPlanning = () => {
  const [budgetForm, setBudgetForm] = useState({
    name: '',
    type: 'departmental', // Default
    amount: '',
    description: '',
    category: 'operations', // Default
    fiscalYear: new Date().getFullYear().toString(),
    tags: '', // Comma-separated string
    alertThreshold: 80, // Default
  });
  const [budgets, setBudgets] = useState([]); // Fetched budgets
  const [isLoading, setIsLoading] = useState(false); // For submit and fetch
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedBudget, setSelectedBudget] = useState(null); // For details modal

  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch budgets on mount
  useEffect(() => {
    const fetchBudgets = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/budgets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data, "feedbacks")
      
       let dataArray = [];
      if (Array.isArray(res.data)) {
        dataArray = res.data;
      } else if (res.data && Array.isArray(res.data.budgets)) {
        dataArray = res.data.budgets;
      } else {
        console.warn('Unexpected data shape:', res.data);
      }
      setBudgets(dataArray);

      } catch (err) {
        setError('Failed to load budgets: ' + (err.response?.data?.error || err.message));
      } finally {
        setIsLoading(false);
      }
    };
    fetchBudgets();
  }, [token]);

  const handleChange = (e) => {
    setBudgetForm({ ...budgetForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Client-side validation
    if (!budgetForm.name || !budgetForm.amount || budgetForm.amount <= 0 || budgetForm.alertThreshold < 0 || budgetForm.alertThreshold > 100) {
      setError('Please fill all required fields correctly (amount > 0, threshold 0-100)');
      setIsLoading(false);
      return;
    }

    const payload = {
      ...budgetForm,
      amount: Number(budgetForm.amount),
      alertThreshold: Number(budgetForm.alertThreshold),
      tags: budgetForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Array
      // forecasts/scenarios omitted; add if needed
    };

    try {
      const res = await axios.post(`${BASE_URL}/budgets`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets([...budgets, res.data]); // Update local state
      setSuccessMessage('Budget created successfully!');
      setBudgetForm({ // Reset form
        name: '',
        type: 'departmental',
        amount: '',
        description: '',
        category: 'operations',
        fiscalYear: new Date().getFullYear().toString(),
        tags: '',
        alertThreshold: 80,
      });
      setTimeout(() => setSuccessMessage(''), 3000); // Fade success
    } catch (err) {
      setError('Failed to create budget: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Generate chart data from budgets (aggregate quarterly for demo; customize as needed)
  const generateChartData = () => {
    if (budgets.length === 0) return [];
    // Mock quarterly aggregation (assume fiscalYear data; group by quarter logic here)
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    return quarters.map((q, idx) => {
      const quarterBudgets = budgets.filter(b => b.fiscalYear === budgetForm.fiscalYear); // Filter by year
      const planned = quarterBudgets.reduce((sum, b) => sum + (b.amount / 4), 0); // Even split demo
      const actual = quarterBudgets.reduce((sum, b) => sum + (b.spent / 4), 0);
      const variance = planned - actual;
      return { quarter: q, planned, actual, variance };
    });
  };

  const chartData = generateChartData();

  // Safe date formatter
  const safeFormatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isValid(date) ? format(date, 'yyyy-MM-dd') : 'N/A';
  };

  // Safe tags display
  const safeTags = (tags) => Array.isArray(tags) ? tags.join(', ') : 'None';

  return (
    <div className="space-y-6 relative">
      {isLoading && <Loading />} {/* Full overlay */}

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Budget Planning</h2>
      
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Budget Creation Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Create New Budget</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Budget Name *"
            value={budgetForm.name}
            onChange={handleChange}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
            required
          />
          <select
            name="type"
            value={budgetForm.type}
            onChange={handleChange}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
          >
            <option value="departmental">Departmental</option>
            <option value="project">Project</option>
          </select>
          <input
            type="number"
            name="amount"
            placeholder="Amount ($) *"
            value={budgetForm.amount}
            onChange={handleChange}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
            required
          />
          <select
            name="category"
            value={budgetForm.category}
            onChange={handleChange}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
          >
            <option value="operations">Operations</option>
            <option value="marketing">Marketing</option>
            <option value="rd">R&D</option>
            <option value="hr">HR</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="fiscalYear"
            placeholder="Fiscal Year (e.g., 2025)"
            value={budgetForm.fiscalYear}
            onChange={handleChange}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated, e.g., high-priority, Q4)"
            value={budgetForm.tags}
            onChange={handleChange}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={budgetForm.description}
            onChange={handleChange}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700 lg:col-span-2"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Alert Threshold (%):</label>
            <input
              type="range"
              name="alertThreshold"
              min="0"
              max="100"
              value={budgetForm.alertThreshold}
              onChange={handleChange}
              className="flex-1"
            />
            <span className="text-sm font-medium">{budgetForm.alertThreshold}%</span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="lg:col-span-3 bg-primary-600 text-white p-3 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Add Budget'}
          </button>
        </form>
      </div>

      {/* Budgets List Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Existing Budgets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category / Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {budgets.length > 0 ? (
                budgets.map((budget) => (
                  <tr key={budget._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{budget.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {budget.category} {budget.type ? `/ ${budget.type.charAt(0).toUpperCase() + budget.type.slice(1)}` : ''}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">{budget.description || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right font-medium">${(budget.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        budget.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        budget.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {budget.status?.charAt(0).toUpperCase() + budget.status?.slice(1) || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => setSelectedBudget(budget)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 transition"
                        aria-label="View details"
                      >
                        <FiEye className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">No budgets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forecast Line Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Budget Forecast vs Actual (Quarterly)</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="planned" stroke="#2563EB" strokeWidth={3} name="Planned" />
              <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} name="Actual Spent" />
              <Line type="monotone" dataKey="variance" stroke="#EF4444" strokeWidth={2} name="Variance" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">No budget data available for chart. Create a budget to see forecasts.</p>
        )}
      </div>

      {/* View Details Modal */}
      {selectedBudget && <BudgetDetailsModal budget={selectedBudget} onClose={() => setSelectedBudget(null)} />}
    </div>
  );
};

// Budget Details Modal Component
const BudgetDetailsModal = ({ budget, onClose }) => {
  const safeFormatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isValid(date) ? format(date, 'yyyy-MM-dd') : 'Invalid Date';
  };

  const safeTags = (tags) => Array.isArray(tags) ? tags.join(', ') : 'None';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 max-h-screen overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Budget Details</h3>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <p><strong className="font-semibold">ID:</strong> {budget._id}</p>
          <p><strong className="font-semibold">Name:</strong> {budget.name || 'N/A'}</p>
          <p><strong className="font-semibold">Category:</strong> {budget.category || 'N/A'}</p>
          <p><strong className="font-semibold">Type:</strong> {budget.type?.charAt(0).toUpperCase() + budget.type?.slice(1) || 'N/A'}</p>
          <p><strong className="font-semibold">Amount:</strong> ${(budget.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p><strong className="font-semibold">Spent:</strong> ${(budget.spent || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p><strong className="font-semibold">Remaining:</strong> ${(budget.remaining || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p><strong className="font-semibold">Utilization %:</strong> {budget.utilizationPercentage || 0}%</p>
          <p><strong className="font-semibold">Alert Threshold:</strong> {budget.alertThreshold || 80}%</p>
          <p><strong className="font-semibold">Description:</strong> {budget.description || 'No description'}</p>
          <p><strong className="font-semibold">Status:</strong> <span className="capitalize">{budget.status || 'unknown'}</span></p>
          <p><strong className="font-semibold">Fiscal Year:</strong> {budget.fiscalYear || 'N/A'}</p>
          <p><strong className="font-semibold">Tags:</strong> {safeTags(budget.tags)}</p>
          <p><strong className="font-semibold">Created At:</strong> {safeFormatDate(budget.createdAt)}</p>
          <p><strong className="font-semibold">Updated At:</strong> {safeFormatDate(budget.updatedAt)}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full border border-gray-300 dark:border-gray-600 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BudgetPlanning;