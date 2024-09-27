/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { getAuth, signInWithCredential, PhoneAuthProvider } from 'firebase/auth';

const OTPModal = ({ open, handleClose, verificationId }) => {
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const auth = getAuth();
    const credential = PhoneAuthProvider.credential(verificationId, otp);

    try {
      await signInWithCredential(auth, credential);
      // Handle successful sign-in
      handleClose();
    } catch (error) {
      setOtpError('Mã OTP không hợp lệ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="otp-modal-title"
      aria-describedby="otp-modal-description"
    >
      <Box
        sx={{
          width: '400px',
          padding: '20px',
          bgcolor: 'background.paper',
          borderRadius: '10px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography id="otp-modal-title" variant="h6" component="h2">
          Nhập mã OTP
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={!!otpError}
            helperText={otpError}
            sx={{ marginTop: '20px' }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ width: '100%', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Xác thực...' : 'Xác thực'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

OTPModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  verificationId: PropTypes.string.isRequired,
};

export default OTPModal;
