
// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getPendingRequests, clearPendingRequest } from './db';
import { lazy, Suspense } from 'react';
const Signup = lazy(() => import('./pages/auth/Signup'));

function App() {
  useEffect(() => {
    const syncRequests = async () => {
      if (navigator.onLine) {
        const requests = await getPendingRequests();
        for (const req of requests) {
          try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/${req.endpoint}`, {
              method: req.method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(req.body),
            });
            await clearPendingRequest(req.id);
          } catch (error) {
            console.error('Sync error:', error);
          }
        }
      }
    };

    window.addEventListener('online', syncRequests);
    return () => window.removeEventListener('online', syncRequests);
  }, []);

  return (
    <Router>
    <Suspense>
         <Routes>
        <Route path="/" element={<Signup />} />
        {/* Add routes for login, verify-email, forgot-password, reset-password */}
      </Routes>
    </Suspense>
     
    </Router>
  );
}

export default App;




