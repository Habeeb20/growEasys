/* eslint-disable no-unused-vars */
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   LayoutDashboard, 
//   BarChart3, 
//   FileText, 
//   Users, 
//   Settings, 
//   PieChart, 
//   TrendingUp, 
//   DollarSign, 
//   MonitorCheckIcon
// } from 'lucide-react';
// import ThemeToggle from '../../utils/ThemeToggle';
// import OverviewDashboard from '../../components/Budget/DashboardOverview';
// import useBusinessDetailsCheck from '../../components/Budget/UseBusinessDetailsCheck';
// import BudgetPlanning from '../../components/Budget/BudgetPlanning';
// import ExpenseTracking from '../../components/Budget/ExpenseTracking';
// import Reports from '../../components/Budget/Reports';
// import UserManagement from '../../components/Budget/UserManagement';
// import SettingsComponent from '../../components/Budget/Settings';
// import MobileAccessibility from '../../components/Budget/MobileAccessibility';
// import ComplianceRiskESG from '../../components/Budget/ColmplianceRisk';
// import ScalabilityCustomization from '../../components/Budget/ScalabiliityCustomization';
// import Loading from '../../utils/Loading';


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
//   const { user, loading, modal } = useBusinessDetailsCheck();
//   const [activeItem, setActiveItem] = useState('overview');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const ActiveComponent = sidebarItems.find(item => item.id === activeItem)?.component || OverviewDashboard;

//   const handleItemClick = (id) => {
//     setActiveItem(id);
//     setSidebarOpen(false); // Close sidebar on mobile
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   if(loading) return <Loading />
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
//           <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Budget Manager</h1>
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
//           <ActiveComponent />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  MonitorCheckIcon
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
  const ActiveComponent = sidebarItems.find(item => item.id === activeItem)?.component || OverviewDashboard;

  const handleItemClick = (id) => {
    setActiveItem(id);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Full-screen loading
  if (loading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error} <button onClick={refetch} className="ml-4 text-blue-500 underline">Retry</button>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Budget Manager</h1>
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
          <ActiveComponent />
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