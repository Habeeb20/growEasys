import { useState, useEffect } from 'react';
import axios from 'axios';

const useBusinessDetailsCheck = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched user data:', res.data);
      
      if (res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setError('Invalid response: No user data');
      }
    } catch (err) {
      console.error('Fetch user error:', err);
      setError(err.response?.data?.error || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Return raw data; consumer decides on modal
  const needsBusinessDetails = user && !user.businessDetailsCompleted;

  return { user, loading, error, needsBusinessDetails, refetch: fetchUser };
};

export default useBusinessDetailsCheck;