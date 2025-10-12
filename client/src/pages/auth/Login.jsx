import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { toast } from 'sonner';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Loading from '../../utils/Loading';
import { savePendingRequest } from '../../db';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (navigator.onLine) {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, formData);
        const { token, message } = response.data;
        localStorage.setItem('token', token);
        dispatch(setCredentials({ token, user: { email: formData.email } }));
        toast.success(message || 'Login successful!');
        navigate("/dashboard")
      } else {
        await savePendingRequest('/auth/login', 'POST', formData);
        toast.info('Login request queued. It will sync when youre back online.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Login failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-success-50">
      {isLoading && <Loading />}
      <div className="flex w-full h-[480px] max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side: Animated Welcome Section */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary-500 to-success-500 items-center justify-center p-8 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-success-500/10 animate-pulse"></div>
          <div className="relative z-10 text-center text-white">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <span className="text-3xl">🚀</span>
            </div>
            <h1 className="text-2xl font-bold mb-2 animate-fade-in">Welcome to</h1>
            <h2 className="text-3xl font-black bg-gradient-to-r from-white to-primary-200/80 bg-clip-text text-transparent mb-2">
              growEasy
            </h2>
            <p className="text-sm opacity-90 animate-fade-in-delay">Empowering Professionals Worldwide</p>
          </div>
        </div>
        {/* Right Side: Form Inputs */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary-700 mb-2">Login to growEasy</h2>
            <p className="text-gray-600 text-sm">Don't have an account? <button onClick={() => navigate('/signup')} className="text-primary-600 font-semibold hover:underline">Sign up</button></p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-lg font-bold text-base hover:from-primary-600 hover:to-primary-700 focus:ring-2 focus:ring-primary-400/50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed outline outline-1 outline-primary-300"
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-600">
              Forgot your password? <button className="text-primary-600 font-semibold hover:underline">Reset</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;