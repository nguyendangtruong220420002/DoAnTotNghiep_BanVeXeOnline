/* eslint-disable no-unused-vars */
import React, { useState, useEffect} from 'react';
import {  Box, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { getAuth, signInWithCredential, PhoneAuthProvider, RecaptchaVerifier,signInWithPhoneNumber } from 'firebase/auth';
import {auth } from '../../../src/pages/Firebase/firebaseConfig';
import ConfirmInfo from '../../../src/pages/AboutPage/ConfirmInfo'

const OTPModal = ({ open, handleClose, verificationId, phoneNumber, setVerificationId  }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showConfirmInfo, setShowConfirmInfo] = useState(false);
  

  useEffect(() => {
    if (open) {
      setTimeLeft(120); 
    }
  }, [open]);

  useEffect(() => {
    if (timeLeft > 0 && open) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, open]);
 
  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^\d?$/.test(value)) { 
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index]) {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const auth = getAuth();
    const otpCode = otp.join('');
    const credential = PhoneAuthProvider.credential(verificationId, otpCode);
    try {
      await signInWithCredential(auth, credential);
      setShowConfirmInfo(true);
      
    } catch (error) {
      setOtpError('Mã OTP không hợp lệ.');
    } finally {
      setLoading(false);
    }
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const handleResendOTP = async () => {
    if (timeLeft === 0) {
        setTimeLeft(120); 
        setOtp(['', '', '', '', '', '']);
        setOtpError('');
        
        try {
            const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => {
                    console.log('Recaptcha resolved');
                },
                'error-callback': (error) => {
                    console.error('Recaptcha failed', error);
                }
            });
            await recaptchaVerifier.render();
            console.log('recaptchaVerifier', recaptchaVerifier);
            const internationalPhoneNumber = `+84${phoneNumber.slice(1)}`;
            console.log("phone gửi lại", internationalPhoneNumber);

            const confirmationResult = await signInWithPhoneNumber(auth, internationalPhoneNumber, recaptchaVerifier);
            console.log("OTP gửi lại", confirmationResult);

            setVerificationId(confirmationResult.verificationId);
        } catch (error) {
            console.error('Gửi lại OTP thất bại:', error);
            setOtpError('Gửi lại OTP thất bại, vui lòng thử lại.');
        }
    }
};
const handleConfirmInfoSubmit = (userInfo) => {
  console.log('Thông tin người dùng:', userInfo);
    handleClose(); 
};
  
  if (!open) return null;
  return (
      
    <Box>
    {showConfirmInfo ? ( 
      <ConfirmInfo onSubmit={handleConfirmInfoSubmit} open={showConfirmInfo} phoneNumber={phoneNumber} />
    ) : (
      <Box component="form" sx={{ marginTop: '20px' }} onSubmit={handleSubmit}>
        <Typography sx={{
          fontSize: '14px',
          textAlign: 'center',
          fontFamily: 'ixi-type, sans-serif',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
        }}>
          Mã xác thực đã được gửi về số {phoneNumber}
        </Typography>
        <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px', marginTop: '15px' }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              id={`otp-${index}`}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength="1"
              className={`custom-input ${otpError ? 'error' : ''}`}
              style={{
                width: '20px',
                height: '20px',
                textAlign: 'center',
                fontSize: '20px',
                borderRadius: '10px',
                border: otpError ? '1px solid #c8380d' : '1px solid',
                padding: '10px',
              }}
            />
          ))}
        </Box>
        {otpError && (
          <Typography sx={{
            color: '#c8380d',
            marginTop: '10px',
            marginLeft: '2px',
            fontSize: '13px',
            fontFamily: 'ixi-type, sans-serif',
            textAlign: 'center'
          }}>
            {otpError}
          </Typography>
        )}
        {timeLeft > 0 ? (
          <>
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: '400px',
                height: '45px',
                marginTop: '20px',
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
              disabled={loading || timeLeft === 0}
            >
              {loading ? 'Vui lòng chờ ...' : 'Xác thực'}
            </Button>

            <Typography sx={{
              fontSize: '14px',
              textAlign: 'center',
              color: '#888690',
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              Thời gian còn lại <Typography sx={{ fontSize: '15px', color: 'black', alignItems: 'center', padding: '5px' }}>{formatTime(timeLeft)}</Typography>
            </Typography>
          </>
        ) : (
          <Typography sx={{ fontSize: '14px', textAlign: 'center', marginTop: '10px' }}>
            <Button
              variant="text"
              onClick={handleResendOTP}
              sx={{ fontSize: '14px', color: '#c8380d', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}
            >
              Gửi mã lại
            </Button>
          </Typography>
        )}
        <Box id="recaptcha-container"></Box>
      </Box>
    )}
  </Box>
);
};


OTPModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  verificationId: PropTypes.string.isRequired,
  setVerificationId: PropTypes.func.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  
};

export default OTPModal;
