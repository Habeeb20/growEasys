import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { format, isValid } from 'date-fns';
import { FiPlus, FiEye, FiSearch, FiFilter, FiDownload, FiAlertCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Loading from '../../utils/Loading';
import ErrorDisplay from '../../utils/ErrorDisplay';

const ExpenseTracking = () => {

  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 });
  const [chartData, setChartData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [summary, setSummary] = useState({ totalExpenses: 0, unbudgeted: 0, approved: 0 });
  const [currentPage, setCurrentPage] = useState(1); // For pagination controls

  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch data function (supports page param)
  const fetchData = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        axios.get(`${BASE_URL}/expenses?page=${page}&limit=10`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/expenses/summary`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      let fetchedExpenses = [];
      let fetchedPagination = { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 };
      if (expensesRes.data && Array.isArray(expensesRes.data.expenses)) {
        fetchedExpenses = expensesRes.data.expenses;
        fetchedPagination = expensesRes.data.pagination || fetchedPagination;
      } else if (Array.isArray(expensesRes.data)) {
        fetchedExpenses = expensesRes.data;
      } else {
        console.warn('Unexpected expenses response shape:', expensesRes.data);
      }
      setExpenses(fetchedExpenses);
      setPagination(fetchedPagination);
      setCurrentPage(fetchedPagination.currentPage);

      const totalExpenses = fetchedExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      const approved = fetchedExpenses.filter(e => e.status === 'approved').length;
      setSummary({
        totalExpenses,
        unbudgeted: summaryRes.data.unbudgetedTotal || 0,
        approved
      });

      const monthlyData = generateMonthlyData(fetchedExpenses);
      setChartData(monthlyData);

      const forecast = generateForecast(monthlyData);
      setForecastData(forecast);
    } catch (err) {
      setError('Failed to load expenses: ' + (err.response?.data?.error || err.message));
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [token, currentPage]);

  // Aggregate monthly data
  const generateMonthlyData = (expensesList) => {
    if (!Array.isArray(expensesList)) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, idx) => {
      const monthExpenses = expensesList.filter(e => {
        const expenseDate = new Date(e.date);
        return isValid(expenseDate) && expenseDate.getMonth() === idx;
      });
      const expensesTotal = monthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      const budgetTotal = 5000; // Mock; replace with real budget fetch per month/category
      return { name: month, expenses: expensesTotal, budget: budgetTotal };
    });
  };

  // Generate forecast
  const generateForecast = (data) => {
    if (!Array.isArray(data)) return [];
    const avgExpenses = data.reduce((sum, d) => sum + d.expenses, 0) / data.length || 0;
    const nextMonths = ['Jul', 'Aug', 'Sep', 'Oct']; // Extend if needed
    return nextMonths.map((month, idx) => ({
      name: month,
      forecast: Math.round(avgExpenses * (1 + 0.05 * (idx + 1))) // 5% growth, rounded
    }));
  };

  // Filtered expenses (client-side search/filter)
  const filteredExpenses = Array.isArray(expenses)
    ? expenses.filter(e => {
        const matchesSearch = (e.description || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (e.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || e.status === filterStatus;
        return matchesSearch && matchesFilter;
      })
    : [];

  // Handle add success
  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchData(currentPage); // Refetch current page
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Safe date formatter
  const safeFormatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isValid(date) ? format(date, 'yyyy-MM-dd') : 'Invalid Date';
  };

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Expense Tracking Dashboard</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition transform hover:scale-105 shadow-md"
        >
          <FiPlus className="text-lg" /> Add Expense
        </button>
      </div>

      {/* Pagination Info */}
      {pagination.totalItems > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} expenses
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
            </button>
            <span>Page {currentPage} of {pagination.totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between transition hover:shadow-xl">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">${summary.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <FiAlertCircle className="text-4xl text-blue-500 opacity-80" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between transition hover:shadow-xl">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Unbudgeted Spend</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">${(summary.unbudgeted || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <FiAlertCircle className="text-4xl text-red-500 opacity-80" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between transition hover:shadow-xl">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Approved Expenses</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{summary.approved} / {expenses.length}</p>
          </div>
          <FiAlertCircle className="text-4xl text-green-500 opacity-80" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-400 focus:outline-none transition"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-400 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="reimbursed">Reimbursed</option>
          <option value="paid">Paid</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <FiFilter className="text-lg" /> Advanced Filters
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow">
          <FiDownload className="text-lg" /> Export CSV
        </button>
      </div>

      {/* Recent Expenses Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Expenses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category / Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{safeFormatDate(expense.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {expense.category} {expense.vendorId?.name ? `/ ${expense.vendorId.name}` : ''}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">{expense.description || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right font-medium">${(expense.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        expense.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        expense.status === 'reimbursed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        expense.status === 'paid' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {expense.status?.charAt(0).toUpperCase() + expense.status?.slice(1) || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => setSelectedExpense(expense)}
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
                  <td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">No expenses found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses vs Budget Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Monthly Expenses vs Budget</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fill: '#888' }} />
                <YAxis tick={{ fill: '#888' }} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                <Legend />
                <Bar dataKey="expenses" fill="#2563EB" name="Expenses" radius={[4, 4, 0, 0]} />
                <Bar dataKey="budget" fill="#10B981" name="Budget" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 h-300 flex items-center justify-center">No data available for chart.</p>
          )}
        </div>

        {/* Expense Forecast Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Expense Forecast (Next 4 Months)</h3>
          {forecastData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fill: '#888' }} />
                <YAxis tick={{ fill: '#888' }} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                <Legend />
                <Line type="monotone" dataKey="forecast" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444' }} name="Forecasted Expenses" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 h-300 flex items-center justify-center">No forecast data available.</p>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && <AddExpenseModal onClose={() => setShowAddModal(false)} onSuccess={handleAddSuccess} />}

      {/* View Details Modal */}
      {selectedExpense && <ExpenseDetailsModal expense={selectedExpense} onClose={() => setSelectedExpense(null)} />}
    </div>
  );
};

// Add Expense Modal Component (Compact, Professional, Reduced Height)
const AddExpenseModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    category: '', amount: '', date: format(new Date(), 'yyyy-MM-dd'), description: '', vendorName: '', paymentMethod: 'card',
    tags: '', authCode: '', taxAmount: '', budgetId: '' // Extra fields for enterprise
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [authCode, setAuthCode] = useState(''); // Separate state for authCode (not sent in form preview)

  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    try {
      // Prepare payload (split tags, convert amount to number) - authCode not included in main payload; handle separately if needed for approval logic
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        taxAmount: parseFloat(form.taxAmount) || 0,
        tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
        authCode: authCode // Include only on submit for backend verification (instant approval logic assumed on server)
      };
      await axios.post(`${BASE_URL}/expenses`, payload, { headers: { Authorization: `Bearer ${token}` } });
      onSuccess();
    } catch (err) {
      setModalError(err.response?.data?.error || 'Failed to add expense. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-2 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xs w-full mx-auto flex flex-col max-h-[80vh] max-w-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Add New Expense</h3>
          {modalError && <p className="text-red-500 mt-1 text-xs bg-red-50 dark:bg-red-900 p-1 rounded">{modalError}</p>}
        </div>

        {/* Scrollable Form Body - Compact */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
          <input
            name="category"
            placeholder="Category *"
            value={form.category}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 focus:ring-1 focus:ring-primary-400 text-gray-800 dark:text-gray-100"
            required
          />
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Amount *"
            value={form.amount}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 focus:ring-1 focus:ring-primary-400 text-gray-800 dark:text-gray-100"
            required
          />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 focus:ring-1 focus:ring-primary-400 text-gray-800 dark:text-gray-100"
            required
          />
          <textarea
            name="description"
            placeholder="Description *"
            value={form.description}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 focus:ring-1 focus:ring-primary-400 h-16 resize-none text-gray-800 dark:text-gray-100"
            required
          />
          <input
            name="vendorName"
            placeholder="Vendor Name"
            value={form.vendorName}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 focus:ring-1 focus:ring-primary-400 text-gray-800 dark:text-gray-100"
          />
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 focus:ring-1 focus:ring-primary-400 text-gray-800 dark:text-gray-100"
          >
            <option value="cash">Cash</option>
            <option value="card">Credit/Debit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="invoice">Vendor Invoice</option>
            <option value="reimbursement">Employee Reimbursement</option>
          </select>
          <input
            name="taxAmount"
            type="number"
            step="0.01"
            placeholder="Tax Amount"
            value={form.taxAmount}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 focus:ring-1 focus:ring-primary-400 text-gray-800 dark:text-gray-100"
          />
          <input
            name="tags"
            placeholder="Tags (comma-separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 focus:ring-1 focus:ring-primary-400 text-gray-800 dark:text-gray-100"
          />
          <input
            name="authCode"
            placeholder="Admin Auth Code"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 focus:ring-1 focus:ring-primary-400 text-gray-800 dark:text-gray-100"
          />
        </form>

        {/* Fixed Footer Buttons */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2 bg-gray-50 dark:bg-gray-900">
          <button
            type="submit"
            disabled={modalLoading}
            onClick={handleSubmit}
            className="flex-1 bg-primary-600 text-white py-2 text-sm rounded hover:bg-primary-700 transition disabled:opacity-50 font-medium"
          >
            {modalLoading ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 dark:border-gray-600 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Expense Details Modal Component
const ExpenseDetailsModal = ({ expense, onClose }) => {
   const safeFormatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isValid(date) ? format(date, 'yyyy-MM-dd') : 'Invalid Date';
  };

  const safeDate = safeFormatDate(expense.date);
  const tagsDisplay = Array.isArray(expense.tags) ? expense.tags.join(', ') : (expense.tags || 'None');
  const attachments = expense.attachments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 max-h-screen overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Expense Details</h3>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <p><strong className="font-semibold">ID:</strong> {expense._id}</p>
          <p><strong className="font-semibold">Date:</strong> {safeDate}</p>
          <p><strong className="font-semibold">Category:</strong> {expense.category || 'N/A'}</p>
          <p><strong className="font-semibold">Amount:</strong> ${ (expense.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) } {expense.taxAmount ? ` (Tax: $${expense.taxAmount.toLocaleString()})` : ''}</p>
          <p><strong className="font-semibold">Total:</strong> ${ ((expense.amount || 0) + (expense.taxAmount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 }) }</p>
          <p><strong className="font-semibold">Description:</strong> {expense.description || 'No description'}</p>
          <p><strong className="font-semibold">Status:</strong> <span className="capitalize">{expense.status || 'unknown'}</span></p>
          <p><strong className="font-semibold">Vendor:</strong> {expense.vendorId?.name || 'N/A'} {expense.vendorId?.email ? `(${expense.vendorId.email})` : ''}</p>
          <p><strong className="font-semibold">Budget Linked:</strong> {expense.budgetId ? `Yes (${expense.budgetId.name || expense.budgetId})` : 'No (Unbudgeted)'}</p>
          <p><strong className="font-semibold">Payment Method:</strong> {expense.paymentMethod?.charAt(0).toUpperCase() + expense.paymentMethod?.slice(1) || 'N/A'}</p>
          <p><strong className="font-semibold">Reimbursed:</strong> {expense.reimbursed ? 'Yes' : 'No'}</p>
          <p><strong className="font-semibold">Approved By:</strong> {expense.approvedBy?.firstName + ' ' + expense.approvedBy?.lastName || 'N/A'}</p>
          <p><strong className="font-semibold">Tags:</strong> {tagsDisplay}</p>
          {attachments.length > 0 && (
            <p><strong className="font-semibold">Attachments:</strong> 
              {attachments.map((att, idx) => (
                <a key={idx} href={att} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline ml-2">View {idx + 1}</a>
              ))}
            </p>
          )}
          {/* <p><strong className="font-semibold">Created At:</strong> {safeFormatDate(expense.createdAt)}</p>
          <p><strong className="font-semibold">Updated At:</strong> {safeFormatDate(expense.updatedAt)}</p> */}
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

export default ExpenseTracking;