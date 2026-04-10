import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
//import UHome from '../UComponents/UHome'
import Topbar from '../UComponents/Topbar'
import AboutPage from '../UComponents/AboutPage'
import HomePage from '../UComponents/HomePage'
import Login from '../UComponents/Login'
import Register from '../UComponents/Register'
import ViewSingleProduct from '../UComponents/ViewSingleProduct'
import MyProfile from '../UComponents/MyProfile'
import ForgotPassword from '../UComponents/ForgotPassword'



function AppContent(){
  const location = useLocation()
  const hideTopBar = ["/login", "/register","/forgotpassword"]
  return (
    <div>
      {!hideTopBar.includes(location.pathname) && <Topbar/>}
      <Routes>
          {/* <Route path='/uhome' element={<UHome/>} /> */}
          <Route path='/about' element={<AboutPage/>} />
          <Route path='/homepage' element={<HomePage/>} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/viewsingleproduct/:id' element={<ViewSingleProduct/>}/>
          <Route path='/myprofile' element={<MyProfile/>}/>
          <Route path='/forgotpassword'element={<ForgotPassword/>}/>
      </Routes>
    </div>
  )
}

export default function UserRoute() {
  return (
    <div>
        <AppContent/>
    </div>
  )
}
