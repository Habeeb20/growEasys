import React from 'react';
   import { Link } from 'react-router-dom';

   const ErrorDisplay = ({ errorMessage, onRetry }) => {
     return (
       <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 z-50">
         <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in">
           {/* Error Icon */}
           <div className="flex justify-center mb-4">
             <div className="relative w-16 h-16">
               <div className="absolute inset-0 rounded-full bg-gradient-to-r from-light-purple to-not-too-deep-yellow flex items-center justify-center">
                 <svg
                   className="w-10 h-10 text-white"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg"
                 >
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                   />
                 </svg>
               </div>
             </div>
           </div>
           {/* Error Message */}
           <h2 className="text-2xl font-bold text-light-deep-green text-center mb-4">
             Oops, Something Went Wrong
           </h2>
           <p className="text-gray-600 text-center mb-6">
             {errorMessage || 'An unexpected error occurred. Please try again.'}
           </p>
           
           {/* Action Buttons */}
           <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
             {onRetry && (
               <button
                 onClick={onRetry}
                 className="bg-gradient-to-r from-light-purple to-light-deep-green text-white px-6 py-3 rounded-lg font-semibold hover:from-light-deep-green hover:to-light-purple transition transform hover:scale-105"
               >
                 Retry
               </button>
             )}
             <Link
               to="/dashboard"
               className="bg-not-too-deep-yellow text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition transform hover:scale-105"
             >
               Go to Home
             </Link>
           </div>
           {/* Branding */}
           <p className="text-sm text-light-deep-green text-center mt-6">
             growEasy - Empowering Professionals Worldwide
           </p>
         </div>
       </div>
     );
   };

   export default ErrorDisplay;