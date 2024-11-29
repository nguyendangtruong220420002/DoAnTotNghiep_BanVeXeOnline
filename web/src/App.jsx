/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate  } from 'react-router-dom';
import HomePage from "../src/pages/HomePage/HomePage"
import BusinessPage  from "../src/pages/Business/business"
import AdminPage from "../src/pages/Leader/admin"
import InforCustoOfTrips from "../src/pages/AboutPage/InforCustoOfTrips"
import ShowTrips from "../src/pages/HomePage/showTrips"
import Payment from "../src/pages/AboutPage/Payment"
import PaymentCancel from "../src/pages/AboutPage/PaymentCancel"
import PaymetSuccess from "../src/pages/AboutPage/PaymetSuccess"

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);
  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'User') {
        navigate('/'); 
      } else if (userInfo.role === 'Business') {
        navigate('/business'); 
      } else if (userInfo.role === 'Admin') {
        navigate('/admin'); 
      }
    }
  }, [userInfo, navigate]);
  
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/admin" element={<AdminPage  />} />
        <Route path="/inforCustoOfTrips" element={<InforCustoOfTrips  />} />
        <Route path="/inforCustoOfTrips" element={<InforCustoOfTrips  />} />
        <Route path="/showTrips" element={<ShowTrips />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/paymentCancel" element={<PaymentCancel />} />
        <Route path="/paymentSuccess" element={<PaymetSuccess />} />
        
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