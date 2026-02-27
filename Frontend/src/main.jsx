import React from 'react'
import ReactDOM from 'react-dom/client'
import AHFULApp from './AHFULApp.jsx'
import './SiteStyles.css'
import { StoreProvider } from './Store.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
        <AHFULApp />
    </StoreProvider>
  </React.StrictMode>,
)