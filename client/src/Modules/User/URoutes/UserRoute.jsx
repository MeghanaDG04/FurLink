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
import BookingForm from '../UComponents/BookingForm'
import Payment from '../UComponents/Payment'
import Orders from '../UComponents/Orders'
import Cart from '../UComponents/Cart'
import WishList from '../UComponents/WishList'
import Adopt from '../UComponents/Adopt'
import AdoptionLayout from '../UComponents/AdoptionLayout'
import PetListing from '../UComponents/PetListing'
import PetDetail from '../UComponents/PetDetail'
import MyAdoptions from '../UComponents/MyAdoptions'
import AdoptionAbout from '../UComponents/AdoptionAbout'
import UserSubmitPet from '../UComponents/UserSubmitPet'
import UserMyPets from '../UComponents/UserMyPets'


function AppContent(){
  const location = useLocation()
  const hideTopBar = ["/login", "/register","/forgotpassword"]
  const isAdoptionRoute = location.pathname.startsWith("/adopt")
  
  return (
    <div>
      {!hideTopBar.includes(location.pathname) && !isAdoptionRoute && <Topbar/>}
      <Routes>
          {/* <Route path='/uhome' element={<UHome/>} /> */}
          <Route path='/about' element={<AboutPage/>} />
          <Route path='/homepage' element={<HomePage/>} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/viewsingleproduct/:id' element={<ViewSingleProduct/>}/>
          <Route path='/myprofile' element={<MyProfile/>}/>
          <Route path='/forgotpassword'element={<ForgotPassword/>}/>
          <Route path='/bookingform' element={<BookingForm/>}/>
          <Route path ='/payment' element={<Payment/>}/>
          <Route path ='/orders' element={<Orders/>}/>
          <Route path ='/cart' element={<Cart/>}/>
          <Route path ='/wishlist' element={<WishList/>}/>
          
          {/* Adoption Section with separate layout */}
          <Route path='/adopt' element={<AdoptionLayout/>}>
            <Route index element={<PetListing/>} />
            <Route path='browse' element={<PetListing/>} />
            <Route path='pet/:id' element={<PetDetail/>} />
            <Route path='my-adoptions' element={<MyAdoptions/>} />
            <Route path='about' element={<AdoptionAbout/>} />
            <Route path='submit-pet' element={<UserSubmitPet/>} />
            <Route path='my-pets' element={<UserMyPets/>} />
          </Route>
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
