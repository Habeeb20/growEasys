import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';

import { toast } from 'sonner';
import { FaEye,  } from 'react-icons/fa';

import Loading from '../../utils/Loading';

import { Player } from '@lottiefiles/react-lottie-player';
import { savePendingRequest } from '../../db';

import axios from 'axios';

// Assume you have a Lottie animation JSON file in public/animations/signup-animation.json
// You can download a free professional animation from lottiefiles.com (e.g., growth or professional network theme)

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
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
        // Online: Send to backend
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, formData);
        const { token, message } = response.data;
        // Store token in localStorage
        localStorage.setItem('token', token);
        // Dispatch to Redux
        dispatch(setCredentials({ token, user: { email: formData.email } })); // Adjust based on response
        toast.success(message || 'Signup successful!');
      } else {
        // Offline: Queue in IndexedDB
        await savePendingRequest('/signup', 'POST', formData);
        toast.info('Signup request queued. It will sync when you’re back online.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Signup failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {isLoading && <Loading />}
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Left Side: Lottie Animation */}
        <div className="hidden md:flex w-1/2 bg-light-deep-green items-center justify-center p-8">
          <Player
            autoplay
            loop
            src="/animations/signup-animation.json" // Replace with your Lottie JSON path
            style={{ height: '80%', width: '80%' }}
          />
        </div>
        {/* Right Side: Form Inputs */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-light-deep-green mb-6">Sign Up for growEasy</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-purple"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-purple"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-purple"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-purple"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-purple"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-600"
              >
                {showPassword ? <FaEye /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-light-deep-green text-white p-3 rounded-lg hover:from-light-deep-green hover:to-light-purple transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;






// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { setCredentials } from '../../store/slices/authSlice';
// import { toast } from 'sonner';
// import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Fixed import for FaEyeSlash
// import Loading from '../../utils/Loading';
// import { savePendingRequest } from '../../db';
// import axios from 'axios';

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     phone: '',
//     email: '',
//     password: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useDispatch();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       if (navigator.onLine) {
//         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, formData);
//         const { token, message } = response.data;
//         localStorage.setItem('token', token);
//         dispatch(setCredentials({ token, user: { email: formData.email } }));
//         toast.success(message || 'Signup successful!');
//       } else {
//         await savePendingRequest('/signup', 'POST', formData);
//         toast.info('Signup request queued. It will sync when you’re back online.');
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || 'Signup failed. Please try again.';
//       toast.error(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       {isLoading && <Loading />}
//       <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
//         {/* Left Side: Styled with Animation */}
//         <div className="hidden md:flex w-1/2 bg-gradient-to-br from-light-purple to-light-deep-green items-center justify-center p-8 animate-pulse-slow">
//           <div className="text-center text-white font-bold text-2xl animate-fade-in">
//             Welcome to growEasy
//             <div className="mt-4 h-16 w-16 bg-not-too-deep-yellow rounded-full flex items-center justify-center animate-bounce-slow">
//               <span className="text-light-purple">🚀</span>
//             </div>
//           </div>
//         </div>
//         {/* Right Side: Form Inputs */}
//         <div className="w-full md:w-1/2 p-8">
//           <h2 className="text-2xl font-bold text-center text-light-deep-green mb-6">Sign Up for growEasy</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="firstName" className="block text-gray-700 mb-2">First Name</label>
//               <input
//                 type="text"
//                 id="firstName"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-purple"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
//               <input
//                 type="text"
//                 id="lastName"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-purple"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-purple"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-purple"
//                 required
//               />
//             </div>
//             <div className="relative">
//               <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-purple"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-10 text-gray-600"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-light-deep-green text-white p-3 rounded-lg hover:bg-opacity-90 transition"
//             >
//               Sign Up
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;