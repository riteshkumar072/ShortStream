import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes/>
    </div>
  )
}

export default App