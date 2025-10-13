/* eslint-disable no-unused-vars */


import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, AlertCircle, Users, CheckCircle, AlertTriangle, Globe, Settings, FileText } from 'lucide-react';
import { LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';

// Sample data for existing charts (from original)
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

// Sample data for new categories
const collaborationData = [
  { title: 'Pending Approvals', progress: 45, description: 'Workflow Items Awaiting Review' },
  { title: 'Team Collaboration Rate', progress: 88, description: 'Active User Engagements' },
];

const complianceData = [
  { title: 'Compliance Rate', progress: 92, description: 'Regulatory Adherence' },
  { title: 'Risk Exposure', progress: 35, description: 'Potential Vulnerabilities' }, // Lower is better, but visualized as progress
  { title: 'ESG Score', progress: 78, description: 'Sustainability Metrics' },
];

const mobileData = [
  { title: 'Mobile Sync Completion', progress: 95, description: 'Data Synchronization Rate' },
  { title: 'Accessibility Compliance', progress: 85, description: 'WCAG Standards Met' },
];

const scalabilityData = [
  { title: 'System Load', progress: 60, description: 'Current Resource Utilization' },
  { title: 'Customization Usage', progress: 70, description: 'Active Custom Features' },
];

const expenseData = [
  { name: 'Travel', value: 250, fill: '#3B82F6' },
  { name: 'Supplies', value: 180, fill: '#EAB308' },
  { name: 'Meals', value: 120, fill: '#EF4444' },
  { name: 'Misc', value: 90, fill: '#6EE7B7' },
];

const expenseTrendData = [
  { month: 'Jan', expenses: 300 },
  { month: 'Feb', expenses: 350 },
  { month: 'Mar', expenses: 280 },
  { month: 'Apr', expenses: 320 },
  { month: 'May', expenses: 380 },
  { month: 'Jun', expenses: 410 },
];

// Reusable Progress Circle Component (Waterwave-like, using SVG for circular progress)
const ProgressCircle = ({ title, progress, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
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
          strokeDasharray={`${progress * 0.31831}, 31.831`} // Adjusted for 0-100 scale
          transform="rotate(-90 18 18)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-2xl font-bold text-primary-600">{progress}%</p>
      </div>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{description}</p>
  </div>
);

// Component for Collaboration & Workflow
const CollaborationWorkflow = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Collaboration & Workflow</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {collaborationData.map((item, index) => (
        <ProgressCircle key={index} {...item} />
      ))}
    </div>
    {/* Additional elements: e.g., a simple list for recent activities */}
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Workflow Activities</h3>
      <ul className="space-y-2">
        <li className="flex items-center text-gray-600 dark:text-gray-400">
          <Users className="w-5 h-5 mr-2" /> Budget approval for Marketing - Pending
        </li>
        <li className="flex items-center text-gray-600 dark:text-gray-400">
          <CheckCircle className="w-5 h-5 mr-2" /> Comment added to Operations forecast
        </li>
      </ul>
    </div>
  </div>
);


export default CollaborationWorkflow