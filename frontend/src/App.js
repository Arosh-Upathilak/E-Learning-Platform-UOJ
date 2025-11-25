import React from 'react';
import "./index.css";
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner'
import Login from './components/login/Login';
import Footer from './components/footer/Footer';
import SendOtp from './components/sendotp/SendOtp';
import CreateAccount from './components/create/CreateAccount';
import VerifyOtp from './components/verifyotp/VerifyOtp';
import ForgotPassword from './components/forgotpassword/ForgotPassword';
import StudentHome from './pages/student/home/StudentHome'
import AdminHome from './pages/admin/home/AdminHome';
import PrivateRouter from './components/privateRouter/PrivateRouter';

export default function App() {
  return (
  
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Toaster  closeButton position="top-right" richColors/>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/send-otp" element={<SendOtp/>} />
            <Route path="/register" element={<CreateAccount />} />
            <Route path="/verify-otp/:id" element={<VerifyOtp/>} />
            <Route path="/forgot-password/:id" element={<ForgotPassword/>} />
            <Route path="/home" element={<PrivateRouter element={<StudentHome/>} />}/>


            {/*Amdin*/}
            <Route path='/admin/home' element={<PrivateRouter element={<AdminHome/>} adminOnly/>}/>
          </Routes>
        </div>
        <Footer/>
      </div>
  )
}
