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



const Login = ({ open, handleClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
 

  // Xử lý khi người dùng gửi form đăng nhập
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    // Thêm logic xử lý đăng nhập ở đây
  };

  // Xử lý khi người dùng gửi form đăng ký
  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    // Thêm logic xử lý đăng ký ở đây
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
        <Box sx={{marginTop:'50px'}}>
            <Button
                variant="contained"
                sx={{width:'400px',height:'45px',position: "absolute",fontFamily:'ixi-type, sans-serif',left: "50%",transform: "translateX(-50%)",
                  borderRadius:'50px',fontSize:'16px',backgroundColor:'rgb(220,99,91)',textTransform: 'none'}}>Đăng nhập 
            </Button>
          </Box>
          <Box sx={{marginTop:'130px',fontSize:'14px',textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', color: '#ef5222' }}> Quên mật khẩu</Box>
         
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
};

export default Login;
