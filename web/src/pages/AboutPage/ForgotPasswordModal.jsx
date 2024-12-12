 /* eslint-disable no-unused-vars */
import React, { useState,useEffect } from 'react';
import { Box, Button, Typography, TextField, Modal, Paper } from '@mui/material';
import { auth } from '../Firebase/firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import axios from 'axios';
import PropTypes from 'prop-types';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';

const ForgotPasswordModal = ({ open, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [otp, setOtp] = useState([]);
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    if (open) setTimeLeft(120);
  }, [open]);
  useEffect(() => {
    if (timeLeft > 0 && open) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, open]);
  const formatTime = (time) => `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`;

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) { 
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };
  const handlePhoneNumberChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);
    setPhoneError('');
  };

  const handleSendOTP = async () => {
    if (!/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(phoneNumber)) {
      setPhoneError('Số điện thoại không đúng.');
      return;
    }
    setTimeLeft(120);
    setOtp([]);
    setOtpError('');
    try {
      const response = await axios.post(`${API_URL}/api/users/check-phone`, { phoneNumber });

      if (!response.data.exists) {
        setPhoneError('Số điện thoại không tồn tại trong hệ thống.');
        return;
      }

      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => console.log('Recaptcha resolved'),
      });

      const internationalPhoneNumber = `+84${phoneNumber.slice(1)}`;
      const confirmationResult = await signInWithPhoneNumber(auth, internationalPhoneNumber, recaptchaVerifier);
      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true);
    } catch (error) {
      console.error('Gửi OTP thất bại:', error);
      setPhoneError('Gửi OTP thất bại, vui lòng thử lại.');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setPhoneError('Vui lòng nhập mã OTP.');
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      setOtpVerified(true);
    } catch (error) {
      setPhoneError('Mã OTP không hợp lệ.');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setPhoneError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPhoneError('Mật khẩu không khớp.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/users/forgotPassword`, {
        phoneNumber,
        newPassword,
      });
      alert('Mật khẩu đã được cập nhật thành công.');
      onClose();  // Close modal on success
    } catch (error) {
      console.error('Cập nhật mật khẩu thất bại:', error);
      setPhoneError('Cập nhật mật khẩu thất bại, vui lòng thử lại.');
    }
  };

  return (
    <Modal  open={open}
    onClose={(event, reason) => {
      if (reason !== "backdropClick") {
        onClose();
      }
    }}
    aria-labelledby="login-modal-title"
    aria-describedby="login-modal-description"
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
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
          onClick={onClose}  
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
        <Paper 
          sx={{
            width: '500px',
            height: '470px',
            borderRadius: '10px',
          
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontSize:'24px', fontFamily:'ixi-type, sans-serif',textShadow:' 1px 1px 2px rgba(0, 0, 0, 0.1)' , marginTop:'40px', 
         display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            Quên mật khẩu
          </Typography>
          <Box component="form" sx={{ marginTop: '20px', margin:'auto' , display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            {!otpSent && (
              <>
                  <TextField
                fullWidth
                variant="outlined"
                color='warning'
                placeholder="Nhập số điện thoại"
                className="custom-input"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                error={!!phoneError}  
                helperText={phoneError}  
                inputProps={{ maxLength: 10 }} 
                sx={{width:'80%', marginTop:'15px', height:'58px'}}
              />
             
                <Box id="recaptcha-container"></Box>
                <Button
                  onClick={handleSendOTP}
                  variant="contained"
                  disabled={!phoneNumber || !!phoneError}
                  sx={{
                    width: '400px',
                    height: '45px',
                    
                    position: 'relative',
                    fontFamily: 'ixi-type, sans-serif',
                    borderRadius: '50px',
                    fontSize: '16px',
                    backgroundColor: 'rgb(220,99,91)',
                    textTransform: 'none',
                    marginTop: '40px',
                  }}
                >
                  Gửi mã OTP
                </Button>
              </>
            )}

            {otpSent && !otpVerified && (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Nhập mã OTP"
                  color="warning"
                  className="custom-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  sx={{ width: '40%', marginTop: '15px', height: '58px', textAlign:'center',  }}
                />
                  <Typography sx={{ margin: 2 }}>{formatTime(timeLeft)}</Typography>
                <Button
                  onClick={handleVerifyOTP}
                  variant="contained"
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
                  Xác nhận OTP
                </Button>
                {timeLeft === 0 && (
          <Button onClick={handleSendOTP} variant="text" sx={{ marginTop: 2 }}>
            Gửi lại mã OTP
          </Button>
        )}
              </>
            )}

            {otpVerified && (
              <>
               <TextField
              fullWidth
              variant="outlined"
              color="warning"
              className="custom-input"
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              inputProps={{ maxLength: 20 }} 
              sx={{ width: '80%', marginTop: '15px', height: '58px' }}
            />

            <TextField
              fullWidth
              variant="outlined"
              color="warning"
              className="custom-input"
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              inputProps={{ maxLength: 20 }} 
              sx={{ width: '80%', marginTop: '15px', height: '58px' }}
            />
                <Button
                  onClick={handleResetPassword}
                  variant="contained"
                  sx={{
                    width: '200px',
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
                  Đổi mật khẩu
                </Button>
              </>
            )}
          </Box>
          
        </Paper>
      </Box>
    </Modal>
  );
};

ForgotPasswordModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ForgotPasswordModal;

