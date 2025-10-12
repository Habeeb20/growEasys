import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FaArrowLeft } from 'react-icons/fa';
import Loading from '../../utils/Loading';
import { savePendingRequest } from '../../db';
import axios from 'axios';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: localStorage.getItem('email') || '',
    code: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const codeRefs = useRef([]);

  const handleCodeChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 1); // Only digits, max 1 char
    const newCode = formData.code.split('');
    newCode[index] = value;
    const updatedCode = newCode.join('');
    setFormData({ ...formData, code: updatedCode });

    // Auto-focus next input
    if (value && index < 3) {
      codeRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !formData.code[index] && index > 0) {
      codeRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      codeRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      codeRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.code.length !== 4) {
      toast.error('Please enter the full 4-digit code.');
      return;
    }
    setIsLoading(true);
    try {
      if (navigator.onLine) {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-email`, formData);
        const { token, message } = response.data;
        localStorage.setItem('token', token);
        toast.success(message || 'Email verified successfully!');
        navigate('/login'); // Redirect after verification
      } else {
        await savePendingRequest('/auth/verify-email', 'POST', formData);
        toast.info('Verification queued. It will sync when online.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Verification failed. Please check the code.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResendLoading(true);
    try {
      if (navigator.onLine) {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/resendcode`, { email: formData.email });
        toast.success(response.data.message || 'Verification code resent successfully!');
        setCanResend(false);
        setTimeout(() => setCanResend(true), 60000); // 1-minute cooldown
      } else {
        await savePendingRequest('/auth/resend-verification', 'POST', { email: formData.email });
        toast.info('Resend request queued. It will sync when online.');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (codeRefs.current[0]) {
      codeRefs.current[0].focus();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-success-50">
      {isLoading && <Loading />}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-600 hover:text-primary-700 transition-colors p-2 rounded-lg hover:bg-primary-50"
          >
            <FaArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-primary-700 text-center flex-1">Verify Email</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
         
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Verification Code</label>
            <div className="flex space-x-2">
              {Array.from({ length: 4 }, (_, index) => (
                <input
                  key={index}
                  ref={(el) => (codeRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={formData.code[index] || ''}
                  onChange={(e) => handleCodeChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all bg-white"
                  placeholder="_"
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter the 4-digit code sent to {formData.email}</p>
          </div>
          <button
            type="submit"
            disabled={isLoading || formData.code.length !== 4}
            className="w-full bg-primary-500 text-white p-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 focus:ring-2 focus:ring-primary-400 transition-all"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={handleResend}
            disabled={resendLoading || !canResend}
            className="text-primary-600 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {resendLoading ? 'Resending...' : 'Didn\'t receive code? Resend'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;