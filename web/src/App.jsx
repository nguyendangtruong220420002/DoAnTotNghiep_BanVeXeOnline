/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from "../src/pages/HomePage/HomePage"
import BusinessPage from "../src/pages/Business/business"
import AdminPage from "../src/pages/Leader/admin"
import InforCustoOfTrips from "../src/pages/AboutPage/InforCustoOfTrips"
import ShowTrips from "../src/pages/HomePage/showTrips"
import Payment from "../src/pages/AboutPage/Payment"
import PaymentCancel from "../src/pages/AboutPage/PaymentCancel"
import PaymetSuccess from "../src/pages/AboutPage/PaymetSuccess"
import ForgotPasswordForm from "./pages/AboutPage/ForgotPasswordModal"

import { io } from 'socket.io-client'

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const socket = io(`http://127.0.0.1:2820`, {
      autoConnect: false,
    });
    socket.connect();

    setSocket(socket);
    console.log("socket in app.jsx", socket);
    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);
  // useEffect(() => {
  //   if (userInfo) {
  //     if (userInfo.role === 'Business') {
  //       navigate('/business'); 
  //     } else if (userInfo.role === 'Admin') {
  //       navigate('/admin'); 
  //     } else if (userInfo.role === 'User') {
  //       navigate('/') ; 
  //     } 
  //   }
  // }, [userInfo, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/business" element={<BusinessPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/inforCustoOfTrips" element={<InforCustoOfTrips socket={socket} />} />
      <Route path="/showTrips" element={<ShowTrips socket={socket} />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/paymentCancel" element={<PaymentCancel socket={socket} />} />
      <Route path="/paymentSuccess" element={<PaymetSuccess />} />
      <Route path="/ForgotPassword" element={<ForgotPasswordForm />} />

    </Routes>

  );
}


export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}