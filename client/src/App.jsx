// /* eslint-disable react-hooks/rules-of-hooks */
// /* eslint-disable no-unused-vars */

// // src/App.jsx
// import { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import { getPendingRequests, clearPendingRequest } from './db';
// import { lazy, Suspense } from 'react';
// import Navbar from './components/Navbar';
// const Signup = lazy(() => import('./pages/auth/Signup'));

// function AppContent() {
//   const location = useLocation();
//   const [theme, setTheme] = useState('light');

//   // Routes where navbar and footer should be hidden
//   const hideLayoutRoutes = [
//     '/business/dashboard',
//     '/login',
//     '/register',
//     '/forgot-password',
//     '/reset-password',
//     '/verify-email',
//     '/2fa',
//     '/account-locked',
//   ];
//   const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

//   useEffect(() => {
//     const syncRequests = async () => {
//       if (navigator.onLine) {
//         const requests = await getPendingRequests();
//         for (const req of requests) {
//           try {
//             await fetch(`${import.meta.env.VITE_BACKEND_URL}/${req.endpoint}`, {
//               method: req.method,
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify(req.body),
//             });
//             await clearPendingRequest(req.id);
//           } catch (error) {
//             console.error('Sync error:', error);
//           }
//         }
//       }
//     };

//     window.addEventListener('online', syncRequests);
//     return () => window.removeEventListener('online', syncRequests);
//   }, []);

//   const handleThemeToggle = () => {
//     setTheme(theme === 'light' ? 'dark' : 'light');
//   };

//   return (
//     <>
//       {!shouldHideLayout && (
//         <Navbar
//           isAuthenticated={false}
//           currentTheme={theme}
//           onThemeToggle={handleThemeToggle}
//           onLogin={() => console.log('Login clicked')}
//           onDashboard={() => console.log('Dashboard clicked')}
//         />
//       )}
      
//       <Suspense>
//         <Routes>
//           <Route path="/" element={<Signup />} />
//           {/* Add routes for login, verify-email, forgot-password, reset-password */}
//         </Routes>
//       </Suspense>
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;



/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */



/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */

// src/App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { getPendingRequests, clearPendingRequest } from './db';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/landing/Home';
const Signup = lazy(() => import('./pages/auth/Signup'));
const Login = lazy(()=> import("./pages/auth/Login"))
const Verifyemail = lazy(()=> import("./pages/auth/VerifyEmail"))

function AppContent() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Routes where navbar and footer should be hidden
  const hideLayoutRoutes = [
    '/business/dashboard',
  
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/2fa',
    '/account-locked',
  ];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

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

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      {!shouldHideLayout && (
        <Navbar
          isAuthenticated={false}
          currentTheme={theme}
          onThemeToggle={handleThemeToggle}
          onLogin={() => console.log('Login clicked')}
          onDashboard={() => console.log('Dashboard clicked')}
        />
      )}
      
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/login' element={<Login/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/verifyemail" element={<Verifyemail />} />
          <Route path="/dashboard" element={<Home />} />

          {/* Add routes for login, verify-email, forgot-password, reset-password */}
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;