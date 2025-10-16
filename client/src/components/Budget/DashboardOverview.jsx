/* eslint-disable no-unused-vars */
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';
import useBusinessDetailsCheck from './UseBusinessDetailsCheck';
import BusinessDetailsModal from './BusinessDetailsModal';
import Loading from '../../utils/Loading';
const data = [
  { name: 'Marketing', value: 400, fill: '#2563EB' },
  { name: 'Operations', value: 300, fill: '#10B981' },
  { name: 'HR', value: 200, fill: '#F59E0B' },
  { name: 'IT', value: 150, fill: '#EF4444' },
  { name: 'Other', value: 100, fill: '#6B7280' },
];

const monthlyData = [
  { month: 'Jan', spent: 400, budget: 500 },
  { month: 'Feb', spent: 450, budget: 500 },
  { month: 'Mar', spent: 380, budget: 500 },
  { month: 'Apr', spent: 420, budget: 500 },
  { month: 'May', spent: 460, budget: 500 },
  { month: 'Jun', spent: 490, budget: 500 },
];

const progressData = [
  { title: 'Q1 Allocation', progress: 85, description: 'Quarter 1 Budget Usage' },
  { title: 'Project Approval', progress: 92, description: 'Pending Approvals' },
  { title: 'Compliance', progress: 78, description: 'Audit Compliance Rate' },
];

const OverviewDashboard = () => {
    const { user, loading, error, needsBusinessDetails, refetch } = useBusinessDetailsCheck();
      if (loading) {
        return <Loading />;
      }
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{user?.businessDetails?.businessName || "Dashboard Overview"} </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$1,250,000</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">75% Allocated</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Spent This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$89,450</p>
            </div>
            <div className="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-success-600 h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">42% of Monthly Budget</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Over Budget Alerts</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">3</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Departments</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Budget Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Monthly Spending Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line type="monotone" dataKey="spent" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="budget" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Waterwave/Progress Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {progressData.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{item.title}</h3>
            <div className="relative w-full h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  className="text-gray-200 dark:text-gray-700"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  className="text-primary-500"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${item.progress * 31.831}, 31.831`}
                  transform={`rotate(-90 18 18)`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-2xl font-bold text-primary-600">{item.progress}%</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewDashboard;