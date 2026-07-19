import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from '../pages/auth/Register'
import Login from '../pages/auth/Login'
import Home from '../pages/Home.jsx'
import CreatePost from '../pages/CreateShot.jsx'
import Profile from '../pages/Profile.jsx'
import BottomNav from '../components/BottomNav.jsx'
import Saved from '../pages/Saved.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import EditProfile from '../pages/EditProfile.jsx'

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