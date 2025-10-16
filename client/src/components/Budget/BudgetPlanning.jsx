// import React, { useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// const BudgetPlanning = () => {
//   const [budgetForm, setBudgetForm] = useState({ department: '', amount: '', description: '' });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle budget creation logic
//     console.log('New budget:', budgetForm);
//   };

//   const data = [
//     { quarter: 'Q1', planned: 250000, actual: 240000 },
//     { quarter: 'Q2', planned: 300000, actual: 320000 },
//     { quarter: 'Q3', planned: 280000, actual: 270000 },
//     { quarter: 'Q4', planned: 350000, actual: 340000 },
//   ];

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Budget Planning</h2>
      
//       {/* Budget Creation Form */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Create New Budget</h3>
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <input
//             type="text"
//             placeholder="Department"
//             value={budgetForm.department}
//             onChange={(e) => setBudgetForm({ ...budgetForm, department: e.target.value })}
//             className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
//           />
//           <input
//             type="number"
//             placeholder="Amount ($)"
//             value={budgetForm.amount}
//             onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
//             className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
//           />
//           <input
//             type="text"
//             placeholder="Description"
//             value={budgetForm.description}
//             onChange={(e) => setBudgetForm({ ...budgetForm, description: e.target.value })}
//             className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700 md:col-span-3"
//           />
//           <button
//             type="submit"
//             className="md:col-span-3 bg-primary-600 text-white p-3 rounded-lg font-bold hover:bg-primary-700"
//           >
//             Add Budget
//           </button>
//         </form>
//       </div>

//       {/* Forecast Line Chart */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Budget Forecast</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="quarter" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="planned" stroke="#2563EB" strokeWidth={3} name="Planned" />
//             <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} name="Actual" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default BudgetPlanning;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Loading from '../../utils/Loading';

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
        setBudgets(res.data);
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
    </div>
  );
};

export default BudgetPlanning;