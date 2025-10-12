/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{jsx,js}'],
    darkMode: 'class',
  theme: {
    extend: {





      colors: {
        // Primary brand colors
        'light-purple': '#080656FF',
        'light-deep-green': '#2563EB',
        'not-too-deep-yellow': '#E1D30DFF',
        primary: {
          50: '#EBF4FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2B6CB0',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },

        // Secondary accent colors
        secondary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#4FD1C5',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },

        // Neutral grays
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#A0AEC0',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },

        // Semantic colors
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052e16',
        },

        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451a03',
        },

        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450a0a',
        },

        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },

        // Background variations
        background: {
          DEFAULT: '#F7FAFC',
          dark: '#0F172A',
          card: '#FFFFFF',
          'card-dark': '#1E293B',
          muted: '#F1F5F9',
          'muted-dark': '#334155',
        },

        // Border colors
        border: {
          DEFAULT: '#E2E8F0',
          dark: '#334155',
          light: '#F1F5F9',
        },

        // Text colors
        foreground: {
          DEFAULT: '#0F172A',
          secondary: '#64748B',
          muted: '#94A3B8',
          dark: '#F8FAFC',
          'secondary-dark': '#CBD5E1',
          'muted-dark': '#94A3B8',
        }
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Courier New', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },

      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },

      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },

      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'none': 'none',
        // Custom shadows
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
        'glow': '0 0 20px rgb(59 130 246 / 0.5)',
        'glow-lg': '0 0 40px rgb(59 130 246 / 0.3)',
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 0.5s ease-in-out infinite',

        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Slower pulse

      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        bounceIn: {
          '0%': {
            transform: 'scale(0.3)',
            opacity: '0'
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '1'
          },
          '70%': { transform: 'scale(0.9)' },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          },
        },
        scaleIn: {
          '0%': {
            transform: 'scale(0)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          },
        },
      },

      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  

  
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      backdropBlur: {
        xs: '2px',
      },
      
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    
  
  plugins: [
    // form styling plugin 
     require('@tailwindcss/forms'),
    
    //typography plugin
    require('@tailwindcss/typography'),
    
    // Custom plugin for inventory-specific utilities
    function({ addUtilities, addComponents, theme }) {
      // Custom utilities for inventory management
      addUtilities({
        '.inventory-card': {
          '@apply bg-white dark:bg-background-card-dark rounded-lg shadow-card border border-border dark:border-border-dark transition-all duration-200 hover:shadow-card-hover': {},
        },
        '.inventory-button-primary': {
          '@apply bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2': {},
        },
        '.inventory-button-secondary': {
          '@apply bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2': {},
        },
        '.inventory-input': {
          '@apply w-full px-3 py-2 border border-border dark:border-border-dark rounded-lg bg-white dark:bg-background-card-dark text-foreground dark:text-foreground-dark placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200': {},
        },
        '.status-active': {
          '@apply bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200': {},
        },
        '.status-inactive': {
          '@apply bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200': {},
        },
        '.status-pending': {
          '@apply bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200': {},
        },
        '.status-error': {
          '@apply bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200': {},
        },
        '.low-stock': {
          '@apply bg-error-50 border-error-200 text-error-900 dark:bg-error-900 dark:border-error-700 dark:text-error-100': {},
        },
        '.good-stock': {
          '@apply bg-success-50 border-success-200 text-success-900 dark:bg-success-900 dark:border-success-700 dark:text-success-100': {},
        }
      });

      // Custom components
      addComponents({
        '.notification': {
          '@apply fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg border backdrop-blur-sm z-50 animate-slide-in': {},
        },
        '.notification-success': {
          '@apply bg-success-50 border-success-200 text-success-800 dark:bg-success-900 dark:border-success-700 dark:text-success-100': {},
        },
        '.notification-error': {
          '@apply bg-error-50 border-error-200 text-error-800 dark:bg-error-900 dark:border-error-700 dark:text-error-100': {},
        },
        '.notification-warning': {
          '@apply bg-warning-50 border-warning-200 text-warning-800 dark:bg-warning-900 dark:border-warning-700 dark:text-warning-100': {},
        },
        '.notification-info': {
          '@apply bg-info-50 border-info-200 text-info-800 dark:bg-info-900 dark:border-info-700 dark:text-info-100': {},
        },
      });
    }
  ],

};


