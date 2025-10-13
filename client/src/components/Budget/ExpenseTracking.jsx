import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jan', expenses: 400, budget: 500 },
  { name: 'Feb', expenses: 450, budget: 500 },
  { name: 'Mar', expenses: 380, budget: 500 },
  { name: 'Apr', expenses: 420, budget: 500 },
  { name: 'May', expenses: 460, budget: 500 },
  { name: 'Jun', expenses: 490, budget: 500 },
];

const ExpenseTracking = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Expense Tracking</h2>
      
      {/* Recent Expenses Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Expenses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">${expense.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      expense.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses vs Budget Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Expenses vs Budget</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expenses" fill="#2563EB" name="Expenses" />
            <Bar dataKey="budget" fill="#10B981" name="Budget" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Sample data
const recentExpenses = [
  { id: 1, date: '2025-10-01', category: 'Marketing', amount: 2500, status: 'approved' },
  { id: 2, date: '2025-10-02', category: 'Travel', amount: 1200, status: 'pending' },
  { id: 3, date: '2025-10-03', category: 'Software', amount: 800, status: 'approved' },
  { id: 4, date: '2025-10-04', category: 'Office Supplies', amount: 450, status: 'rejected' },
  { id: 5, date: '2025-10-05', category: 'Training', amount: 1800, status: 'approved' },
];

export default ExpenseTracking;