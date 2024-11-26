/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import HomePage from "../src/pages/HomePage/HomePage"
import BusinessPage  from "../src/pages/Business/business"
import AdminPage from "../src/pages/Leader/admin"
import InforCustoOfTrips from "../src/pages/AboutPage/InforCustoOfTrips"
import ShowTrips from "../src/pages/HomePage/showTrips"
import Payment from "../src/pages/AboutPage/Payment"

function App() {
  const [userInfo, setUserInfo] = useState({ fullName: '' });
  
  return (
    // <div>
    //   <HomePage></HomePage>
      
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/admin" element={<AdminPage  />} />
        <Route path="/inforCustoOfTrips" element={<InforCustoOfTrips  />} />
        <Route path="/inforCustoOfTrips" element={<InforCustoOfTrips  />} />
        <Route path="/showTrips" element={<ShowTrips />} />
        <Route path="/payment" element={<Payment />} />
        
      </Routes>
    </Router>
  );
}

export default App;
