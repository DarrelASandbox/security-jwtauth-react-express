import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Disable strictmode to prevent useEffect to render twice.
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
