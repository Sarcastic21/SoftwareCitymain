import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// Get the root element
const rootElement = document.getElementById('root');

// Create a root
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <Router>
    <App />
  </Router>
);
