/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register'; // Use Vite PWA's virtual module
import { store } from './store/store.js';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import {customColors} from "./utils/color.js"
import { toast } from 'sonner';
// Handle service worker registration with error fallback
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, please refresh.');
  },
  onOfflineReady() {
    console.log('App is ready to work offline.');
    toast.success('App is now available offline!');
  },
  onRegisterError(error) {
    console.error('Service Worker registration failed:', error);
    toast.error('Offline mode unavailable due to a setup issue. Continuing online.');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster
        theme="light"
        position="top-right"
        expand={true}
        richColors={true}
        closeButton
        toastOptions={{
          style: {
            background: `linear-gradient(to right, ${customColors['light-purple']}, ${customColors['light-deep-green']})`,
            color: 'white',
            borderRadius: '8px',
          },
        }}
      />
      <App />
    </Provider>
  </React.StrictMode>
);