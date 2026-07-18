import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import 'nprogress/nprogress.css';
import { AuthProvider } from './context/AuthContext.jsx'
import { FeedProvider } from './context/FeedContext.jsx'
import { UploadProvider } from './context/UploadContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AuthProvider>
      <UploadProvider>
        <FeedProvider>
          <App />
        </FeedProvider>
      </UploadProvider>
    </AuthProvider>
  // </StrictMode>,
)
