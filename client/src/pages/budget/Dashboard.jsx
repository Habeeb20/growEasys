/* eslint-disable no-unused-vars */

// import React, { useState, useEffect } from 'react'; // Added useEffect
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Added for API calls
// import { 
//   LayoutDashboard, 
//   BarChart3, 
//   FileText, 
//   Users, 
//   Settings, 
//   PieChart, 
//   TrendingUp, 
//   DollarSign, 
//   MonitorCheckIcon,
//   AlertCircle, // Added for pending icon
//   CheckCircle // Added for approved icon
// } from 'lucide-react';
// import ThemeToggle from '../../utils/ThemeToggle';
// import OverviewDashboard from '../../components/Budget/DashboardOverview';
// import useBusinessDetailsCheck from '../../components/Budget/UseBusinessDetailsCheck'; // Your hook
// import BudgetPlanning from '../../components/Budget/BudgetPlanning';
// import ExpenseTracking from '../../components/Budget/ExpenseTracking';
// import Reports from '../../components/Budget/Reports';
// import UserManagement from '../../components/Budget/UserManagement';
// import SettingsComponent from '../../components/Budget/Settings';
// import MobileAccessibility from '../../components/Budget/MobileAccessibility';
// import ComplianceRiskESG from '../../components/Budget/ColmplianceRisk';
// import ScalabilityCustomization from '../../components/Budget/ScalabiliityCustomization';
// import Loading from '../../utils/Loading';
// import BusinessDetailsModal from '../../components/Budget/BusinessDetailsModal'; // Import modal here
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts'; // Added recharts for extra charts
// import { format, isValid } from 'date-fns'; // Added for dates if needed
// import ErrorDisplay from '../../utils/ErrorDisplay';

// const sidebarItems = [
//   { id: 'overview', name: 'Overview', icon: LayoutDashboard, component: OverviewDashboard },
//   { id: 'budget', name: 'Budget Planning', icon: DollarSign, component: BudgetPlanning },
//   { id: 'tracking', name: 'Expense Tracking', icon: TrendingUp, component: ExpenseTracking },
//   { id: 'reports', name: 'Reports & Analytics', icon: BarChart3, component: Reports },
//   { id: 'users', name: 'User Management', icon: Users, component: UserManagement },
//   { id: 'scalabity', name: 'Scalability', icon: BarChart3, component: ScalabilityCustomization },
//   { id: 'mobile', name: 'Mobile Accessbility', icon: MonitorCheckIcon, component: MobileAccessibility },
//   { id: 'settings', name: 'Settings', icon: Settings, component: SettingsComponent },
// ];

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { user, loading, error, needsBusinessDetails, refetch } = useBusinessDetailsCheck();
//   const [activeItem, setActiveItem] = useState('overview');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
  
//   const ActiveComponent = sidebarItems.find(item => item.id === activeItem)?.component || OverviewDashboard;

//   // New states for real data (only if overview)
//   const [budgets, setBudgets] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [pendingExpenses, setPendingExpenses] = useState([]);
//   const [approvedExpenses, setApprovedExpenses] = useState([]);
//   const [businessDetails, setBusinessDetails] = useState({ name: 'Your Business' }); // Default
//   const [dataLoading, setDataLoading] = useState(true);
//   const [dataError, setDataError] = useState('');
//   const token = localStorage.getItem('token');
//   const BASE_URL = import.meta.env.VITE_BACKEND_URL;

//   // Fetch real data only for overview
//   useEffect(() => {
//     if (activeItem !== 'overview') return;

//     const fetchDashboardData = async () => {
//       setDataLoading(true);
//       setDataError('');
//       try {
//         const [budgetsRes, expensesRes] = await Promise.all([
//           axios.get(`${BASE_URL}/budgets`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${BASE_URL}/expenses`, { headers: { Authorization: `Bearer ${token}` } }), // Assume /expenses endpoint
//         ]);

//         // Handle budgets
//         let fetchedBudgets = [];
//         if (Array.isArray(budgetsRes.data)) fetchedBudgets = budgetsRes.data;
//         else if (budgetsRes.data && Array.isArray(budgetsRes.data.budgets)) fetchedBudgets = budgetsRes.data.budgets;
//         setBudgets(fetchedBudgets);

//         // Handle expenses
//         let fetchedExpenses = [];
//         if (Array.isArray(expensesRes.data)) fetchedExpenses = expensesRes.data;
//         else if (expensesRes.data && Array.isArray(expensesRes.data.expenses)) fetchedExpenses = expensesRes.data.expenses;
//         setExpenses(fetchedExpenses);

//         // Filter pending and approved (assume status field: 'pending', 'approved')
//         const pending = fetchedExpenses.filter(e => e.status === 'pending');
//         const approved = fetchedExpenses.filter(e => e.status === 'approved');
//         setPendingExpenses(pending);
//         setApprovedExpenses(approved);

//         // Handle business details from user (assume user.businessName or similar; adjust field)
//         setBusinessDetails({ name: user?.businessName || user?.companyName || user?.name || 'Your Business' });

//       } catch (err) {
//         setDataError('Failed to load dashboard data: ' + (err.response?.data?.error || err.message));
//       } finally {
//         setDataLoading(false);
//       }
//     };

//     if (token) fetchDashboardData();
//   }, [activeItem, token, user]); // Dependencies: refetch on switch to overview or changes

//   const handleItemClick = (id) => {
//     setActiveItem(id);
//     setSidebarOpen(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   // Compute aggregates for Overview (real data) - only compute if overview
//   const totalBudgets = activeItem === 'overview' ? budgets.reduce((sum, b) => sum + (b.amount || 0), 0) : 0;
//   const totalSpent = activeItem === 'overview' ? expenses.reduce((sum, e) => sum + (e.amount || 0), 0) : 0;
//   const pendingAmount = activeItem === 'overview' ? pendingExpenses.reduce((sum, e) => sum + (e.amount || 0), 0) : 0;
//   const approvedAmount = activeItem === 'overview' ? approvedExpenses.reduce((sum, e) => sum + (e.amount || 0), 0) : 0;
//   const utilizationPercentage = totalBudgets > 0 ? Math.round((totalSpent / totalBudgets) * 100) : 0;

//   // Over budget alerts
//   const overBudgetBudgets = activeItem === 'overview' ? budgets.filter(b => (b.spent || 0) > (b.amount || 0)) : [];
//   const overBudgetCount = overBudgetBudgets.length;
//   const overBudgetAmount = overBudgetBudgets.reduce((sum, b) => sum + ((b.spent || 0) - (b.amount || 0)), 0);
//   const overBudgetPercentage = budgets.length > 0 ? Math.round((overBudgetCount / budgets.length) * 100) : 0;

//   // Chart data functions - only generate if overview
//   const generateBudgetChartData = () => {
//     if (activeItem !== 'overview') return [];
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     return months.map(month => {
//       const monthBudgets = budgets.filter(b => new Date(b.createdAt).getMonth() === months.indexOf(month));
//       const monthSpent = expenses.filter(e => new Date(e.date).getMonth() === months.indexOf(month));
//       return {
//         month,
//         budgeted: monthBudgets.reduce((sum, b) => sum + (b.amount || 0), 0),
//         spent: monthSpent.reduce((sum, e) => sum + (e.amount || 0), 0),
//       };
//     });
//   };

//   const budgetChartData = generateBudgetChartData();

//   const generateCategoryPieData = () => {
//     if (activeItem !== 'overview') return [];
//     const categoryMap = {};
//     expenses.forEach(e => {
//       const cat = e.category || 'Unknown';
//       categoryMap[cat] = (categoryMap[cat] || 0) + (e.amount || 0);
//     });
//     return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
//   };

//   const categoryPieData = generateCategoryPieData();
//   const COLORS = ['#2563EB', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'];

//   const generatePendingTrendData = () => {
//     if (activeItem !== 'overview') return [];
//     const dateMap = {};
//     pendingExpenses.forEach(e => {
//       const dateKey = format(new Date(e.date), 'yyyy-MM-dd');
//       dateMap[dateKey] = (dateMap[dateKey] || 0) + (e.amount || 0);
//     });
//     return Object.entries(dateMap).map(([date, amount]) => ({ date, amount })).sort((a, b) => new Date(a.date) - new Date(b.date));
//   };

//   const pendingTrendData = generatePendingTrendData();

//   // Full-screen loading
//   if (loading) {
//     return <Loading />;
//   }

//   // Error state
//   if (error)
//     return <ErrorDisplay message={error} />;

//   // Main layout
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
//       {/* Header */}
//       <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <button
//             className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//           <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{businessDetails.name || 'Budget Manager'}</h1>
//         </div>
//         <div className="flex items-center gap-4">
//           <ThemeToggle />
//           <button
//             onClick={handleLogout}
//             className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside
//           className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
//             sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } md:translate-x-0`}
//         >
//           <nav className="p-4 space-y-2">
//             {sidebarItems.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => handleItemClick(item.id)}
//                 className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
//                   activeItem === item.id
//                     ? 'bg-primary-600 text-white shadow-md'
//                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <item.icon className="w-5 h-5 mr-3" />
//                 <span className="font-medium">{item.name}</span>
//               </button>
//             ))}
//           </nav>
//         </aside>

//         {/* Overlay for mobile sidebar */}
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black/50 z-40 md:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         {/* Main Content */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           {activeItem === 'overview' ? (
//             <>
//               {dataLoading && <Loading />}
//               {dataError && <ErrorDisplay message={dataError} />}
//               {!dataLoading && !dataError && (
//                 <div className="space-y-6">
//                   {/* Top Grid: Now 5 cards including Over Budget Alerts */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
//                     <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-xl shadow-lg border border-yellow-200 dark:border-yellow-700 flex flex-col justify-between transition hover:shadow-xl">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium flex items-center gap-2">
//                             <AlertCircle className="w-5 h-5" /> Pending Expenses
//                           </p>
//                           <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-100">{pendingExpenses.length} items</p>
//                         </div>
//                       </div>
//                       <div className="mt-2">
//                         <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
//                         <div className="relative pt-1">
//                           <div className="flex mb-2 items-center justify-between">
//                             <div>
//                               <span className="text-xs font-semibold inline-block text-yellow-600 dark:text-yellow-400">
//                                 {totalBudgets > 0 ? Math.round((pendingAmount / totalBudgets) * 100) : 0}% of Budget
//                               </span>
//                             </div>
//                           </div>
//                           <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200 dark:bg-yellow-800">
//                             <div style={{ width: `${totalBudgets > 0 ? (pendingAmount / totalBudgets) * 100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500 animate-pulse"></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl shadow-lg border border-green-200 dark:border-green-700 flex flex-col justify-between transition hover:shadow-xl">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm text-green-700 dark:text-green-300 font-medium flex items-center gap-2">
//                             <CheckCircle className="w-5 h-5" /> Approved Expenses
//                           </p>
//                           <p className="text-2xl font-bold text-green-800 dark:text-green-100">{approvedExpenses.length} items</p>
//                         </div>
//                       </div>
//                       <div className="mt-2">
//                         <p className="text-lg font-semibold text-green-600 dark:text-green-400">${approvedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
//                         <div className="relative pt-1">
//                           <div className="flex mb-2 items-center justify-between">
//                             <div>
//                               <span className="text-xs font-semibold inline-block text-green-600 dark:text-green-400">
//                                 {totalBudgets > 0 ? Math.round((approvedAmount / totalBudgets) * 100) : 0}% of Budget
//                               </span>
//                             </div>
//                           </div>
//                           <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200 dark:bg-green-800">
//                             <div style={{ width: `${totalBudgets > 0 ? (approvedAmount / totalBudgets) * 100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 animate-pulse"></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl shadow-lg border border-blue-200 dark:border-blue-700 flex flex-col justify-between transition hover:shadow-xl">
//                       <div>
//                         <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Budgeted</p>
//                         <p className="text-2xl font-bold text-blue-800 dark:text-blue-100">${totalBudgets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
//                       </div>
//                       <div className="mt-2">
//                         <div className="relative pt-1">
//                           <div className="flex mb-2 items-center justify-between">
//                             <div>
//                               <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
//                                 100% Allocated
//                               </span>
//                             </div>
//                           </div>
//                           <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-800">
//                             <div style={{ width: '100%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 animate-pulse"></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl shadow-lg border border-red-200 dark:border-red-700 flex flex-col justify-between transition hover:shadow-xl">
//                       <div>
//                         <p className="text-sm text-red-700 dark:text-red-300 font-medium">Total Spent</p>
//                         <p className="text-2xl font-bold text-red-800 dark:text-red-100">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
//                       </div>
//                       <div className="mt-2">
//                         <div className="relative pt-1">
//                           <div className="flex mb-2 items-center justify-between">
//                             <div>
//                               <span className="text-xs font-semibold inline-block text-red-600 dark:text-red-400">
//                                 {utilizationPercentage}% Utilization
//                               </span>
//                             </div>
//                           </div>
//                           <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200 dark:bg-red-800">
//                             <div style={{ width: `${utilizationPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 animate-pulse"></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl shadow-lg border border-purple-200 dark:border-purple-700 flex flex-col justify-between transition hover:shadow-xl">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm text-purple-700 dark:text-purple-300 font-medium flex items-center gap-2">
//                             <AlertCircle className="w-5 h-5" /> Over Budget Alerts
//                           </p>
//                           <p className="text-2xl font-bold text-purple-800 dark:text-purple-100">{overBudgetCount} budgets</p>
//                         </div>
//                       </div>
//                       <div className="mt-2">
//                         <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">${overBudgetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} exceeded</p>
//                         <div className="relative pt-1">
//                           <div className="flex mb-2 items-center justify-between">
//                             <div>
//                               <span className="text-xs font-semibold inline-block text-purple-600 dark:text-purple-400">
//                                 {overBudgetPercentage}% of Budgets
//                               </span>
//                             </div>
//                           </div>
//                           <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200 dark:bg-purple-800">
//                             <div style={{ width: `${overBudgetPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 animate-pulse"></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Charts Section */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Budget vs Spent Line Chart */}
//                     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
//                       <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Budgeted vs Spent (Monthly)</h3>
//                       {budgetChartData.some(d => d.budgeted > 0 || d.spent > 0) ? (
//                         <ResponsiveContainer width="100%" height={300}>
//                           <LineChart data={budgetChartData}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="month" />
//                             <YAxis />
//                             <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
//                             <Legend />
//                             <Line type="monotone" dataKey="budgeted" stroke="#2563EB" strokeWidth={3} name="Budgeted" />
//                             <Line type="monotone" dataKey="spent" stroke="#EF4444" strokeWidth={3} name="Spent" />
//                           </LineChart>
//                         </ResponsiveContainer>
//                       ) : (
//                         <p className="text-gray-500 text-center">No data available.</p>
//                       )}
//                     </div>

//                     {/* Expense Categories Pie Chart */}
//                     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
//                       <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Expenses by Category</h3>
//                       {categoryPieData.length > 0 ? (
//                         <ResponsiveContainer width="100%" height={300}>
//                           <RePieChart>
//                             <Pie
//                               data={categoryPieData}
//                               cx="50%"
//                               cy="50%"
//                               labelLine={false}
//                               label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                               outerRadius={80}
//                               fill="#8884d8"
//                               dataKey="value"
//                             >
//                               {categoryPieData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                               ))}
//                             </Pie>
//                             <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
//                           </RePieChart>
//                         </ResponsiveContainer>
//                       ) : (
//                         <p className="text-gray-500 text-center">No data available.</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Pending Expenses Trend Chart */}
//                   <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Pending Expenses Trend</h3>
//                     {pendingTrendData.length > 0 ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <LineChart data={pendingTrendData}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="date" />
//                           <YAxis />
//                           <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
//                           <Legend />
//                           <Line type="monotone" dataKey="amount" stroke="#F59E0B" strokeWidth={3} name="Pending Amount" />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <p className="text-gray-500 text-center">No pending expenses.</p>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : (
//             <ActiveComponent />
//           )}
//         </main>
//       </div>

//       {/* Business Details Modal - Pops if needed (z-50 ensures on top) */}
//       {needsBusinessDetails && (
//         <BusinessDetailsModal
//           isOpen={needsBusinessDetails}
//           onClose={() => { /* Optional: Could allow close, but per your req, one-time/mandatory */ }}
//           onSuccess={refetch} // Refetch hides it automatically
//         />
//       )}
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Added for API calls
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  MonitorCheckIcon,
  AlertCircle, // Added for pending icon
  CheckCircle // Added for approved icon
} from 'lucide-react';
import ThemeToggle from '../../utils/ThemeToggle';
import OverviewDashboard from '../../components/Budget/DashboardOverview';
import useBusinessDetailsCheck from '../../components/Budget/UseBusinessDetailsCheck'; // Your hook
import BudgetPlanning from '../../components/Budget/BudgetPlanning';
import ExpenseTracking from '../../components/Budget/ExpenseTracking';
import Reports from '../../components/Budget/Reports';
import UserManagement from '../../components/Budget/UserManagement';
import SettingsComponent from '../../components/Budget/Settings';
import MobileAccessibility from '../../components/Budget/MobileAccessibility';
import ComplianceRiskESG from '../../components/Budget/ColmplianceRisk';
import ScalabilityCustomization from '../../components/Budget/ScalabiliityCustomization';
import Loading from '../../utils/Loading';
import BusinessDetailsModal from '../../components/Budget/BusinessDetailsModal'; // Import modal here
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts'; // Added recharts for extra charts
import { format, isValid } from 'date-fns'; // Added for dates if needed
import ErrorDisplay from '../../utils/ErrorDisplay';

const sidebarItems = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard, component: OverviewDashboard },
  { id: 'budget', name: 'Budget Planning', icon: DollarSign, component: BudgetPlanning },
  { id: 'tracking', name: 'Expense Tracking', icon: TrendingUp, component: ExpenseTracking },
  { id: 'reports', name: 'Reports & Analytics', icon: BarChart3, component: Reports },
  { id: 'users', name: 'User Management', icon: Users, component: UserManagement },
  { id: 'scalabity', name: 'Scalability', icon: BarChart3, component: ScalabilityCustomization },
  { id: 'mobile', name: 'Mobile Accessbility', icon: MonitorCheckIcon, component: MobileAccessibility },
  { id: 'settings', name: 'Settings', icon: Settings, component: SettingsComponent },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, error, needsBusinessDetails, refetch } = useBusinessDetailsCheck();
  const [activeItem, setActiveItem] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  console.log(user)
  const ActiveComponent = sidebarItems.find(item => item.id === activeItem)?.component || OverviewDashboard;

  // New states for real data (only if overview)
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [approvedExpenses, setApprovedExpenses] = useState([]);
  const [businessDetails, setBusinessDetails] = useState({ name: 'Your Business' }); // Default
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch real data only for overview
  useEffect(() => {
    if (activeItem !== 'overview') return;

    const fetchDashboardData = async () => {
      setDataLoading(true);
      setDataError('');
      try {
        const [budgetsRes, expensesRes] = await Promise.all([
          axios.get(`${BASE_URL}/budgets`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/expenses`, { headers: { Authorization: `Bearer ${token}` } }), // Assume /expenses endpoint
        ]);

        // Handle budgets
        let fetchedBudgets = [];
        if (Array.isArray(budgetsRes.data)) fetchedBudgets = budgetsRes.data;
        else if (budgetsRes.data && Array.isArray(budgetsRes.data.budgets)) fetchedBudgets = budgetsRes.data.budgets;
        setBudgets(fetchedBudgets);

        // Handle expenses
        let fetchedExpenses = [];
        if (Array.isArray(expensesRes.data)) fetchedExpenses = expensesRes.data;
        else if (expensesRes.data && Array.isArray(expensesRes.data.expenses)) fetchedExpenses = expensesRes.data.expenses;
        setExpenses(fetchedExpenses);

        // Filter pending and approved (assume status field: 'pending', 'approved')
        const pending = fetchedExpenses.filter(e => e.status === 'pending');
        const approved = fetchedExpenses.filter(e => e.status === 'approved');
        setPendingExpenses(pending);
        setApprovedExpenses(approved);

        // Handle business details from user (assume user.businessName or similar; adjust field)
        setBusinessDetails({ name: user?.businessDetails?.businessName || user?.companyName || user?.name || 'Your Business' });

      } catch (err) {
        setDataError('Failed to load dashboard data: ' + (err.response?.data?.error || err.message));
      } finally {
        setDataLoading(false);
      }
    };

    if (token) fetchDashboardData();
  }, [activeItem, token, user]); // Dependencies: refetch on switch to overview or changes

  const handleItemClick = (id) => {
    setActiveItem(id);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Compute aggregates for Overview (real data) - only compute if overview
  const totalBudgets = activeItem === 'overview' ? budgets.reduce((sum, b) => sum + (b.amount || 0), 0) : 0;
  const totalSpent = activeItem === 'overview' ? expenses.reduce((sum, e) => sum + (e.amount || 0), 0) : 0;
  const pendingAmount = activeItem === 'overview' ? pendingExpenses.reduce((sum, e) => sum + (e.amount || 0), 0) : 0;
  const approvedAmount = activeItem === 'overview' ? approvedExpenses.reduce((sum, e) => sum + (e.amount || 0), 0) : 0;
  const utilizationPercentage = totalBudgets > 0 ? Math.round((totalSpent / totalBudgets) * 100) : 0;

  // Over budget alerts
  const overBudgetBudgets = activeItem === 'overview' ? budgets.filter(b => (b.spent || 0) > (b.amount || 0)) : [];
  const overBudgetCount = overBudgetBudgets.length;
  const overBudgetAmount = overBudgetBudgets.reduce((sum, b) => sum + ((b.spent || 0) - (b.amount || 0)), 0);
  const overBudgetPercentage = budgets.length > 0 ? Math.round((overBudgetCount / budgets.length) * 100) : 0;

  // Chart data functions - only generate if overview
  const generateBudgetChartData = () => {
    if (activeItem !== 'overview') return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => {
      const monthBudgets = budgets.filter(b => new Date(b.createdAt).getMonth() === months.indexOf(month));
      const monthSpent = expenses.filter(e => new Date(e.date).getMonth() === months.indexOf(month));
      return {
        month,
        budgeted: monthBudgets.reduce((sum, b) => sum + (b.amount || 0), 0),
        spent: monthSpent.reduce((sum, e) => sum + (e.amount || 0), 0),
      };
    });
  };

  const budgetChartData = generateBudgetChartData();

  const generateCategoryPieData = () => {
    if (activeItem !== 'overview') return [];
    const categoryMap = {};
    expenses.forEach(e => {
      const cat = e.category || 'Unknown';
      categoryMap[cat] = (categoryMap[cat] || 0) + (e.amount || 0);
    });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  };

  const categoryPieData = generateCategoryPieData();

  // New: Budget by Category Pie Data
  const generateBudgetCategoryPieData = () => {
    if (activeItem !== 'overview') return [];
    const categoryMap = {};
    budgets.forEach(b => {
      const cat = b.category || 'Unknown';
      categoryMap[cat] = (categoryMap[cat] || 0) + (b.amount || 0);
    });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  };

  const budgetCategoryPieData = generateBudgetCategoryPieData();
  const COLORS = ['#2563EB', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'];

  const generatePendingTrendData = () => {
    if (activeItem !== 'overview') return [];
    const dateMap = {};
    pendingExpenses.forEach(e => {
      const dateKey = format(new Date(e.date), 'yyyy-MM-dd');
      dateMap[dateKey] = (dateMap[dateKey] || 0) + (e.amount || 0);
    });
    return Object.entries(dateMap).map(([date, amount]) => ({ date, amount })).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const pendingTrendData = generatePendingTrendData();

  // Full-screen loading
  if (loading) {
    return <Loading />;
  }

  // Error state
  if (error)
    return <ErrorDisplay message={error} />;

  // Main layout
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{businessDetails.name || 'Budget Manager'}</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                  activeItem === item.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeItem === 'overview' ? (
            <>
              {dataLoading && <Loading />}
              {dataError && <ErrorDisplay message={dataError} />}
              {!dataLoading && !dataError && (
                <div className="space-y-6">
                  {/* Top Grid: Now 5 cards including Over Budget Alerts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-xl shadow-lg border border-yellow-200 dark:border-yellow-700 flex flex-col justify-between transition hover:shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Pending Expenses
                          </p>
                          <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-100">{pendingExpenses.length} items</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-yellow-600 dark:text-yellow-400">
                                {totalBudgets > 0 ? Math.round((pendingAmount / totalBudgets) * 100) : 0}% of Budget
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200 dark:bg-yellow-800">
                            <div style={{ width: `${totalBudgets > 0 ? (pendingAmount / totalBudgets) * 100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl shadow-lg border border-green-200 dark:border-green-700 flex flex-col justify-between transition hover:shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" /> Approved Expenses
                          </p>
                          <p className="text-2xl font-bold text-green-800 dark:text-green-100">{approvedExpenses.length} items</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">${approvedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-green-600 dark:text-green-400">
                                {totalBudgets > 0 ? Math.round((approvedAmount / totalBudgets) * 100) : 0}% of Budget
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200 dark:bg-green-800">
                            <div style={{ width: `${totalBudgets > 0 ? (approvedAmount / totalBudgets) * 100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl shadow-lg border border-blue-200 dark:border-blue-700 flex flex-col justify-between transition hover:shadow-xl">
                      <div>
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Budgeted</p>
                        <p className="text-2xl font-bold text-blue-800 dark:text-blue-100">${totalBudgets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="mt-2">
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                                100% Allocated
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-800">
                            <div style={{ width: '100%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl shadow-lg border border-red-200 dark:border-red-700 flex flex-col justify-between transition hover:shadow-xl">
                      <div>
                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">Total Spent</p>
                        <p className="text-2xl font-bold text-red-800 dark:text-red-100">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="mt-2">
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-red-600 dark:text-red-400">
                                {utilizationPercentage}% Utilization
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200 dark:bg-red-800">
                            <div style={{ width: `${utilizationPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl shadow-lg border border-purple-200 dark:border-purple-700 flex flex-col justify-between transition hover:shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-700 dark:text-purple-300 font-medium flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Over Budget Alerts
                          </p>
                          <p className="text-2xl font-bold text-purple-800 dark:text-purple-100">{overBudgetCount} budgets</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">${overBudgetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} exceeded</p>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-purple-600 dark:text-purple-400">
                                {overBudgetPercentage}% of Budgets
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200 dark:bg-purple-800">
                            <div style={{ width: `${overBudgetPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Budget vs Spent Line Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Budgeted vs Spent (Monthly)</h3>
                      {budgetChartData.some(d => d.budgeted > 0 || d.spent > 0) ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={budgetChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                            <Legend />
                            <Line type="monotone" dataKey="budgeted" stroke="#2563EB" strokeWidth={3} name="Budgeted" />
                            <Line type="monotone" dataKey="spent" stroke="#EF4444" strokeWidth={3} name="Spent" />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-gray-500 text-center">No data available.</p>
                      )}
                    </div>

                    {/* Expense Categories Pie Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Expenses by Category</h3>
                      {categoryPieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <RePieChart>
                            <Pie
                              data={categoryPieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {categoryPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                          </RePieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-gray-500 text-center">No data available.</p>
                      )}
                    </div>
                  </div>

                  {/* New Row for Budget Categories Pie Chart */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Budget Categories Pie Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Budgets by Category</h3>
                      {budgetCategoryPieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <RePieChart>
                            <Pie
                              data={budgetCategoryPieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {budgetCategoryPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                          </RePieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-gray-500 text-center">No data available.</p>
                      )}
                    </div>

                    {/* Pending Expenses Trend Chart (moved to share row) */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Pending Expenses Trend</h3>
                      {pendingTrendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={pendingTrendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#F59E0B" strokeWidth={3} name="Pending Amount" />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-gray-500 text-center">No pending expenses.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <ActiveComponent />
          )}
        </main>
      </div>

      {/* Business Details Modal - Pops if needed (z-50 ensures on top) */}
      {needsBusinessDetails && (
        <BusinessDetailsModal
          isOpen={needsBusinessDetails}
          onClose={() => { /* Optional: Could allow close, but per your req, one-time/mandatory */ }}
          onSuccess={refetch} // Refetch hides it automatically
        />
      )}
    </div>
  );
};

export default Dashboard;