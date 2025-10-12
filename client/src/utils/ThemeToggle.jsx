// import React, { useState, useEffect } from 'react';
// import { Sun, Moon } from 'lucide-react';

// const ThemeToggle = () => {
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     // Load theme from localStorage on mount
//     const savedTheme = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     const initialTheme = savedTheme === 'dark' || (!savedTheme && prefersDark);
//     setIsDark(initialTheme);
//     document.documentElement.classList.toggle('dark', initialTheme);
//   }, []);

//   const toggleTheme = () => {
//     setIsDark(!isDark);
//     document.documentElement.classList.toggle('dark');
//     localStorage.setItem('theme', !isDark ? 'dark' : 'light');
//   };

//   return (
//     <button
//       onClick={toggleTheme}
//       className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
//       aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
//     >
//       {isDark ? <Sun className="w-5 h-5 text-primary-600" /> : <Moon className="w-5 h-5 text-primary-600" />}
//     </button>
//   );
// };

// export default ThemeToggle;


import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="w-5 h-5 text-primary-600" /> : <Moon className="w-5 h-5 text-primary-600" />}
    </button>
  );
};

export default ThemeToggle;