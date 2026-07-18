import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from '../pages/auth/Register'
import Login from '../pages/auth/Login'
import Home from '../pages/general/Home'
import CreatePost from '../pages/general/CreateShot.jsx'
import Profile from '../pages/general/Profile'
import BottomNav from '../components/BottomNav.jsx'
import Saved from '../pages/general/Saved.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import EditProfile from '../pages/general/EditProfile.jsx'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/shot' element={<Home />} />
          <Route path='/shot/:shotId' element={<Home />} />

          <Route path='/create/details' element={<CreatePost />} />

          <Route path='/saved' element={<Saved />} />
          <Route path='/saved/:shotId' element={<Saved />} />

          <Route path='/user/:id/shot?' element={<Profile />} />
          <Route path='/user/:id/shot/:shotId' element={<Profile />} />

          <Route path='/edit/profile' element={<EditProfile/>} />
        </Route>
      </Routes>
      <BottomNav />
    </Router>
  )
}

export default AppRoutes