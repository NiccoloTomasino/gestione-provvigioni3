import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CommissionProvider } from './context/CommissionContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CommissionProvider>
      <App />
    </CommissionProvider>
  </React.StrictMode>
);
