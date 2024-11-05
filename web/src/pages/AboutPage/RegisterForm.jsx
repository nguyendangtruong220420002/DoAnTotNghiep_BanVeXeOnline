/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import OTPModal from '../../../src/pages/AboutPage/OTPModal'
import { getAuth,signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import {auth } from '../../../src/pages/Firebase/firebaseConfig';
import axios from 'axios';

const RegisterForm = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [openOTPModal, setOpenOTPModal] = useState(false);
    const [verificationId, setVerificationId] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;

    const handlePhoneNumberChange = (event) => {
        const value = event.target.value; 
        const newValue = value.replace(/[^0-9]/g, '');
        if (newValue.length > 0 && !/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(newValue)) {
          setPhoneError('Số điện thoại không đúng.');
        } else {
          setPhoneError('');
        }
        setPhoneNumber(newValue);
      };
    
      const checkPhoneNumberExists = async (phoneNumber) => {
        try {
          const response = await axios.post(`${API_URL}/api/users/check-phone`, { phoneNumber });
          return response.data.exists; 
        } catch (error) {
          console.error('Lỗi khi kiểm tra số điện thoại:', error);
          setPhoneError('Lỗi khi kiểm tra số điện thoại, vui lòng thử lại.');
          return false;
        }
      };
      const handleSubmit = async (event) => {
        event.preventDefault();
        if (phoneNumber && !phoneError) {
          const exists = await checkPhoneNumberExists(phoneNumber);
          if (exists) {
            setPhoneError('Số điện thoại đã tồn tại.');
            return; // Ngừng xử lý nếu số điện thoại đã tồn tại
          }
      
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
    <>
    {!openOTPModal && (
      <Box component="form" sx={{ marginTop: '40px' }}>
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
            fontFamily: 'ixi-type, sans-serif',
          }}>
            {phoneError}
          </Typography>
        )}
         <Box id="recaptcha-container"></Box>
        <Box sx={{ marginTop: '50px' }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            type="submit"
            disabled={!!phoneError || !phoneNumber}
            sx={{
              width: '400px',
              height: '45px',
              position: "relative",
              fontFamily: 'ixi-type, sans-serif',
              left: "50%",
              transform: "translateX(-50%)",
              borderRadius: '50px',
              fontSize: '16px',
              backgroundColor: 'rgb(220,99,91)',
              textTransform: 'none',
              '&.Mui-disabled': {
                backgroundColor: '#999695',
                color: 'white',
              },
            }}
          >
            Tiếp tục
          </Button>
        </Box>
       
      </Box>
    )}
    <OTPModal
      open={openOTPModal}
      handleClose={() => setOpenOTPModal(false)}
      verificationId={verificationId}
      phoneNumber={phoneNumber}
      setVerificationId={setVerificationId}  
   
    />
  </>
);
};

export default RegisterForm;
