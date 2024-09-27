/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import OTPModal from '../../../src/pages/AboutPage/OTPModal'
import { getAuth,signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import {auth } from '../../../src/pages/Firebase/firebaseConfig';

const RegisterForm = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [openOTPModal, setOpenOTPModal] = useState(false);
    const [verificationId, setVerificationId] = useState('');

  


    const handlePhoneNumberChange = (event) => {
        const value = event.target.value;
    
        // Chỉ cho phép nhập các ký tự số
        const newValue = value.replace(/[^0-9]/g, '');
    
        // Kiểm tra số điện thoại hợp lệ
        if (newValue.length > 0 && !/^0\d{9}$/.test(newValue)) {
          setPhoneError('Số điện thoại không đúng.');
        } else {
          setPhoneError('');
        }
        setPhoneNumber(newValue);
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        if (phoneNumber && !phoneError) {
          try {
            const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
              size: 'invisible',
              callback: () => {
                console.log('Recaptcha resolved');
              },
              'error-callback': (error) => {
                console.error('Recaptcha failed', error);
                setPhoneError('Recaptcha không hoạt động, vui lòng thử lại.');
              }
            });
            const internationalPhoneNumber = `+84${phoneNumber.slice(1)}`;
            console.log("phone", internationalPhoneNumber);

            const confirmationResult = await signInWithPhoneNumber(auth, internationalPhoneNumber, recaptchaVerifier);
            console.log("OTP", confirmationResult);

            setVerificationId(confirmationResult.verificationId);
            setOpenOTPModal(true);
            console.log(verificationId);
          } catch (error) {
            console.error('Gửi OTP thất bại:', error);
            setPhoneError('Gửi OTP thất bại, vui lòng thử lại.');
          }
        }
      };
 
  return (
   <Box component="form"  sx={{ marginTop:'40px'   }}>
          <Box className="input-container">
            <input
              placeholder="Nhập số điện thoại"
              className="custom-input"
              onChange={handlePhoneNumberChange}
              value={phoneNumber}   
              maxLength={10}
              inputMode="numeric"
            />
            <span className="input-icon">
              <CallRoundedIcon sx={{ fontSize: '25px' }} />
            </span>
          </Box>
          {phoneError && (
        <Typography sx={{
            color: '#c8380d',
            marginTop: '10px', 
            marginLeft: '2px', 
            fontSize: '13px',
            fontFamily:'ixi-type, sans-serif',
        
        }}>
          {phoneError}
        </Typography>
      )}
          
          <Box sx={{marginTop:'50px'}}>
              <Button
                onClick={handleSubmit}
                  variant="contained"
                  type="submit"
                  disabled={!!phoneError || !phoneNumber}
                  sx={{width:'400px',height:'45px',position: "absolute",fontFamily:'ixi-type, sans-serif',left: "50%",transform: "translateX(-50%)",
                    borderRadius:'50px',fontSize:'16px',backgroundColor:'rgb(220,99,91)',textTransform: 'none',
                    '&.Mui-disabled': {
              backgroundColor: '#999695',color:'white',
            },}}>Tiếp tục 
              </Button>
            </Box>
            <Box id="recaptcha-container">
        <OTPModal open={openOTPModal} handleClose={() => setOpenOTPModal(false)} verificationId={verificationId} />
      </Box>

    </Box>
  );
};

export default RegisterForm;
