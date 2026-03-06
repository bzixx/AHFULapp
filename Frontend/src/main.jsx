import React from 'react'
import ReactDOM from 'react-dom/client'
import AHFULApp from './AHFULApp.jsx'
import './SiteStyles.css'
import { StoreProvider } from './Store.jsx'
import { BrowserRouter as Router } from "react-router-dom";



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <Router>
        <AHFULApp />
      </Router>
    </StoreProvider>
  </React.StrictMode>,
)