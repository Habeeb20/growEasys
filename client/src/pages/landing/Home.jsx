import React, { useState, useEffect } from 'react';
import axios from "axios";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  DollarSign, 
  Calculator, 
  Package, 
  FilePlus, 
  ShoppingBag, 
  Building, 
  LayoutDashboard 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../utils/ThemeToggle';
import { toast } from 'sonner';
import Loading from '../../utils/Loading';
const modules = [
  { id: 1, name: 'HRM Dashboard', icon: Users, color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 2, name: 'HMS Module', icon: Activity, color: 'bg-green-100 dark:bg-green-900' },
  { id: 3, name: 'Sales Tracker', icon: TrendingUp, color: 'bg-orange-100 dark:bg-orange-900' },
  { id: 4, name: 'Budget Planner', icon: DollarSign, color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 5, name: 'Accounting', icon: Calculator, color: 'bg-purple-100 dark:bg-purple-900' },
  { id: 6, name: 'Inventory', icon: Package, color: 'bg-indigo-100 dark:bg-indigo-900' },
  { id: 7, name: 'Requisition', icon: FilePlus, color: 'bg-pink-100 dark:bg-pink-900' },
  { id: 8, name: 'Procurement', icon: ShoppingBag, color: 'bg-red-100 dark:bg-red-900' },
  { id: 9, name: 'Workplace', icon: Building, color: 'bg-teal-100 dark:bg-teal-900' },
  { id: 10, name: 'Analytics', icon: LayoutDashboard, color: 'bg-gray-100 dark:bg-gray-900' },
];

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Initialize as null

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.status === 200) { // Fixed: Use axios status check
          console.log(response.data); // Debug: Log full response
          setUser(response.data.user); // Fixed: Extract user from response.data.user
          toast.success(response.data.message || "Welcome back on board!");
        } else {
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error); // Better logging
        if (error.response?.status === 401) { // Handle unauthorized specifically
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    };

    fetchDashboard();
  }, []); // Empty dependency array: runs once on mount

  const handleCardClick = (id) => {
    navigate(`/module/${id}`);
  };

  if (!user) {
    return <Loading />; // Show loading until user data loads
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col relative">
      {/* Header */}
      <header className="p-4 flex justify-end">
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 w-full">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center w-full md:w-auto gap-4">
            <input
              type="text"
              placeholder="Search modules..."
              className="w-full md:w-80 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white dark:bg-gray-800"
            />
          </div>
        </div>

        {/* Modules Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Access your professional tools</p>
          </div>

          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Quick Access</span>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => handleCardClick(module.id)}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center text-2xl mb-3`}>
                <module.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{module.name}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;