/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Modal, Box, TextField, Typography, Button, Tabs, Tab, IconButton  } from '@mui/material';
import PropTypes from 'prop-types';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import RegisterForm from '../../../src/pages/AboutPage/RegisterForm'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';



const Login = ({ open, handleClose, setUserInfo }) => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [alerts, setAlerts] = useState([]);

  const showAlert = (severity, message) => {
    const newAlert = {
      severity: severity,
      message: message,
      id: Date.now(),
    };
    setAlerts((prevAlerts) => {
      const updatedAlerts = [...prevAlerts, newAlert];
      if (updatedAlerts.length > 3) {
        updatedAlerts.shift(); 
      }
      return updatedAlerts;
    });
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, { phoneNumber, password });
  
      if (response.data) {
        const { user, token } = response.data; 
        console.log("Thông tin người dùng:", user);
        console.log("token", token);
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(user));
  
        setUserInfo(user);  
  
        alert('Đăng nhập thành công');
        if (user.role === 'User') {
           navigate('/'); 
        } else if (user.role === 'Business') {
          navigate('/business'); 
        } else if (user.role === 'Admin') {
          navigate('/admin');
        }
        
        
        setPhoneNumber('');
        setPassword('');
        setErrorMessage('');
        
        handleClose(); 
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Lỗi khi đăng nhập.');
    }
  };

  return (
    <Modal
    open={open}
    onClose={(event, reason) => {
      if (reason !== "backdropClick") {
        handleClose();
      }
    }}
    aria-labelledby="login-modal-title"
    aria-describedby="login-modal-description"
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '500px',
          height: '470px',
          bgcolor: 'background.paper',
          borderRadius: '10px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative', 
        }}    
      >
        
        <CloseRoundedIcon 
          onClick={handleClose}  
          sx={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: '#1e1e1e',
            '&:hover': {
              color: '#7c7878',
            },
          }} 
        />
      <Typography  sx={{ fontSize:'24px', fontFamily:'ixi-type, sans-serif',textShadow:' 1px 1px 2px rgba(0, 0, 0, 0.1)' , marginTop:'40px', 
         }}>
          {tabValue === 0 ? 'Đăng nhập tài khoản' : 'Tạo tài khoản'}
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ display: 'flex', justifyContent: 'space-between' , marginTop:'20px'}}>
          {/* Tab Đăng Nhập */}
          <Tab label={<Box sx={{ fontSize: '15.5px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', color: tabValue === 0 ? '#ef5222' :'black', marginLeft: '5px'}}>Đăng Nhập</Box>}
            iconPosition="start" sx={{width: '200px',borderBottom: tabValue === 0 ? '3px solid #ef5222' : '3px solid #f1eded',transition: 'none',}}
            
          />
          {/* Tab Đăng Ký */}
          <Tab sx={{width: '200px',borderBottom: tabValue === 1 ? '3px solid #ef5222' : '3px solid #f1eded',color: tabValue === 1 ? '#ef5222' :'black' ,transition: 'none',}}
            label={<Box sx={{ fontSize: '15.5px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',  }}> Đăng Ký</Box>}/>
          </Tabs>
        {tabValue === 0 && (
          <Box component="form" onSubmit={handleLoginSubmit} sx={{ marginTop:'40px'   }}>
        <Box className="input-container">
          <input
            placeholder="Nhập số điện thoại"
            className="custom-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <span className="input-icon">
            <CallRoundedIcon sx={{ fontSize: '25px' }} />
          </span>
        </Box>
        
        <Box className="input-container" sx={{ marginTop:'33px' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Nhập mật khẩu"
          className="custom-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="input-icon" >
          <PasswordRoundedIcon sx={{ fontSize: '25px' }} />
        </span>
        <IconButton
          className="pass-icon"
          onClick={handleClickShowPassword}
          style={{ position: 'absolute',  }}
        >
          {showPassword ? <VisibilityOffRoundedIcon sx={{ fontSize: '18px' }}/> : <VisibilityRoundedIcon sx={{ fontSize: '18px' }} />}
        </IconButton>  
        </Box>
        <Box sx={{ height: '30px', marginTop: '10px' }}>
      {errorMessage && <Typography sx={{
            color: '#c8380d',
            marginTop: '10px',
            marginLeft: '5px',
            fontSize: '12px',
            fontFamily: 'ixi-type, sans-serif',
          }}>{errorMessage}</Typography>}
    </Box>
    <Box >
      <Button
        variant="contained"
        type="submit"
        sx={{
          width: '400px',
          height: '45px',
          position: 'relative',
          fontFamily: 'ixi-type, sans-serif',
          borderRadius: '50px',
          fontSize: '16px',
          backgroundColor: 'rgb(220,99,91)',
          textTransform: 'none',
          marginTop: '10px',
        }}
      >
        Đăng nhập
      </Button>
    </Box>
          <Box sx={{marginTop:'35px',fontSize:'14px',textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', color: '#ef5222' }}> Quên mật khẩu</Box>
         
          </Box>
        )}
        {tabValue === 1 && (
          
          <RegisterForm />
        )}
      </Box>
    </Modal>
  );
};

Login.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired
};

export default Login;
