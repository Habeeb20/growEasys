import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const BudgetPlanning = () => {
  const [budgetForm, setBudgetForm] = useState({ department: '', amount: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle budget creation logic
    console.log('New budget:', budgetForm);
  };

  const data = [
    { quarter: 'Q1', planned: 250000, actual: 240000 },
    { quarter: 'Q2', planned: 300000, actual: 320000 },
    { quarter: 'Q3', planned: 280000, actual: 270000 },
    { quarter: 'Q4', planned: 350000, actual: 340000 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Budget Planning</h2>
      
      {/* Budget Creation Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Create New Budget</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Department"
            value={budgetForm.department}
            onChange={(e) => setBudgetForm({ ...budgetForm, department: e.target.value })}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
          />
          <input
            type="number"
            placeholder="Amount ($)"
            value={budgetForm.amount}
            onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700"
          />
          <input
            type="text"
            placeholder="Description"
            value={budgetForm.description}
            onChange={(e) => setBudgetForm({ ...budgetForm, description: e.target.value })}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 bg-white dark:bg-gray-700 md:col-span-3"
          />
          <button
            type="submit"
            className="md:col-span-3 bg-primary-600 text-white p-3 rounded-lg font-bold hover:bg-primary-700"
          >
            Add Budget
          </button>
        </form>
      </div>

      {/* Forecast Line Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Budget Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="planned" stroke="#2563EB" strokeWidth={3} name="Planned" />
            <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} name="Actual" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetPlanning;