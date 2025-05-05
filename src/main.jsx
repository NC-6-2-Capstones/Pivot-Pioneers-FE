import './index.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <React.StrictMode>
      {/* Add Material UI ThemeProvider here if needed */}
      <App />
    </React.StrictMode>
  )