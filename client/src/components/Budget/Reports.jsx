import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  BarChart,
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';
import { Bar } from 'recharts';

const pieData = [
  { name: 'Marketing', value: 400, fill: '#2563EB' },
  { name: 'Operations', value: 300, fill: '#10B981' },
  { name: 'HR', value: 200, fill: '#F59E0B' },
  { name: 'IT', value: 150, fill: '#EF4444' },
  { name: 'Other', value: 100, fill: '#6B7280' },
];

const radialData = [
  { name: 'Budget Utilization', value: 75, fill: '#2563EB' },
  { name: 'Compliance', value: 90, fill: '#10B981' },
  { name: 'Forecast Accuracy', value: 85, fill: '#F59E0B' },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Reports & Analytics</h2>
      
      {/* Budget Utilization Pie Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Budget Utilization by Department</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Waterwave/Progress Radial Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {radialData.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{item.name}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" barSize={20} data={[item]}>
                <RadialBar
                  minAngle={15}
                  background
                  clockWise
                  dataKey="value"
                  fill={item.fill}
                />
                <Tooltip />
                <Legend />
              </RadialBarChart>
            </ResponsiveContainer>
            <p className="text-center text-2xl font-bold text-primary-600 mt-2">{item.value}%</p>
          </div>
        ))}
      </div>

      {/* Diminishing Return Funnel Chart (using stacked bars) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Budget Approval Funnel</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="stage" type="category" />
            <Tooltip />
            <Bar dataKey="approved" stackId="a" fill="#10B981" />
            <Bar dataKey="pending" stackId="a" fill="#F59E0B" />
            <Bar dataKey="rejected" stackId="a" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Sample data
const funnelData = [
  { stage: 'Submitted', approved: 100, pending: 0, rejected: 0 },
  { stage: 'Reviewed', approved: 80, pending: 15, rejected: 5 },
  { stage: 'Approved', approved: 70, pending: 5, rejected: 5 },
  { stage: 'Allocated', approved: 65, pending: 0, rejected: 5 },
];

export default Reports;