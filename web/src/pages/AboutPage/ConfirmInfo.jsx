/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal, Snackbar, Alert  } from '@mui/material';
import PropTypes from 'prop-types';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import InputAdornment from '@mui/material/InputAdornment';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import EnhancedEncryptionRoundedIcon from '@mui/icons-material/EnhancedEncryptionRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import axios from 'axios'; // Import axios

const ConfirmInfo = ({ open, handleClose, onSubmit, phoneNumber }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false); 

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => { // Đánh dấu hàm là async
    e.preventDefault();
    setError(''); // Reset error message

    // Kiểm tra thông tin người dùng
    if (!fullName) {
      setError('Vui lòng nhập họ và tên!');
      return;
    }
    if (!email) {
      setError('Vui lòng nhập email!');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu!');
      return;
    }
    if (!confirmPassword) {
      setError('Vui lòng xác nhận mật khẩu!');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }

    // Tạo thông tin người dùng
    const userInfo = { fullName, email, password, phoneNumber };
    console.log("Thông tin:", userInfo);

    try {
      const response = await axios.post('http://localhost:5000/api/users', userInfo); // Sử dụng userInfo
      console.log(response.data); // Xử lý phản hồi từ server
      onSubmit(userInfo); // Gọi onSubmit chỉ sau khi lưu thành công
      handleClose(); // Đóng modal sau khi xử lý thành công
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
      setError('Đã xảy ra lỗi khi tạo tài khoản.'); // Hiển thị lỗi cho người dùng
    }
  };

  return (
    <>
    <Modal open={open} disableBackdropClick sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Box sx={{
        width: '500px',
        height: '470px',
        bgcolor: 'background.paper',
        borderRadius: '10px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        alignItems: 'center',
        position: 'relative',
      }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            margin: '10px',
            width: '420px',
            marginLeft: '40px',
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: '10px' }}>
            Thêm thông tin
          </Typography>
          <TextField
            className="date"
            label="Họ và tên"
            fullWidth
            margin="normal"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeRoundedIcon
                    sx={{
                      color: "rgb(88, 87, 87)", fontSize: "23px",
                      "&.Mui-focused": {
                        color: "rgb(126, 28, 28)",
                      },
                    }}
                  />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "#fef3f0",
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                  borderColor: "rgb(126, 28, 28)",
                },
                fontSize: "16px",
                fontFamily: "InterTight, sans-serif",
                fontWeight: "normal",
                transition: "box-shadow 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                },
              },
            }}
          />
          <TextField
            label="Email"
            className="date"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailRoundedIcon
                    sx={{ color: "rgb(88, 87, 87)", fontSize: "23px" }}
                  />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "#fef3f0",
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                  borderColor: "rgb(126, 28, 28)",
                },
                fontSize: "16px",
                fontFamily: "InterTight, sans-serif",
                fontWeight: "normal",
                transition: "box-shadow 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                },
              },
            }}
          />
          <TextField
            label="Mật khẩu mới"
            className="date"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EnhancedEncryptionRoundedIcon
                    sx={{ color: "rgb(88, 87, 87)", fontSize: "23px" }}
                  />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "#fef3f0",
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                  borderColor: "rgb(126, 28, 28)",
                },
                fontSize: "16px",
                fontFamily: "InterTight, sans-serif",
                fontWeight: "normal",
                transition: "box-shadow 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                },
              },
            }}
          />
          <TextField
            label="Xác nhận mật khẩu"
            className="date"
            fullWidth
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockResetRoundedIcon
                    sx={{ color: "rgb(88, 87, 87)", fontSize: "23px" }}
                  />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "#fef3f0",
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                  borderColor: "rgb(126, 28, 28)",
                },
                fontSize: "16px",
                fontFamily: "InterTight, sans-serif",
                fontWeight: "normal",
                transition: "box-shadow 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                },
              },
            }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" sx={{
            marginTop: '20px',
            width: '420px',
            bgcolor: 'rgb(126, 28, 28)',
            "&:hover": {
              bgcolor: 'rgb(200, 0, 0)',
            },
          }}>
            Xác nhận
          </Button>
        </Box>
      </Box>
    </Modal>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Tài khoản đã được tạo thành công!
        </Alert>
      </Snackbar>
    </>
  );
};

ConfirmInfo.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  phoneNumber: PropTypes.string.isRequired,
};

export default ConfirmInfo;
