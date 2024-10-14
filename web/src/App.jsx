/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "../src/pages/HomePage/HomePage"
import BusinessPage  from "../src/pages/Business/business"
import AdminPage from "../src/pages/Leader/admin"

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
      </Routes>
    </Router>
  );
}

export default App;
