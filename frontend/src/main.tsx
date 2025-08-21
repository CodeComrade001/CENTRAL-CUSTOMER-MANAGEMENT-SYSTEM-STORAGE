import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AdminAuthProvider } from './middleware/admin/adminAuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </AdminAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
