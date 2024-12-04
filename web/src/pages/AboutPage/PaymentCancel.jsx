/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material'
import logo from '../../../public/images/logohome (2).png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import PropTypes from "prop-types";
import moment from "moment-timezone";

const PaymentCancel = (socket) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingId, setBookingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [dataOfShowTrips, setDataOfShowTrips] = useState(null);
  const [InforCusto, setInforCusto] = useState(null);

  // useEffect(() => {
  //   const queryParams = new URLSearchParams(location.search);
  //   const id = queryParams.get('bookingId');
  //   setBookingId(id);
  // }, [location]);
  useEffect(() => {
    // Lấy các tham số từ URL
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('bookingId');
    const trips = queryParams.get('dataOfShowTrips');
    const customer = queryParams.get('InforCusto');

    console.log("Raw Params from URL:");
    console.log("bookingId:", id);
    console.log("dataOfShowTrips (raw):", trips);
    console.log("InforCusto (raw):", customer);

    setBookingId(id);

    // Giải mã và log dữ liệu sau khi parse
    try {
      const parsedTrips = trips ? JSON.parse(decodeURIComponent(trips)) : null;
      const parsedCustomer = customer
        ? JSON.parse(decodeURIComponent(customer))
        : null;

      setDataOfShowTrips(parsedTrips);
      setInforCusto(parsedCustomer);

      console.log("Decoded Params:");
      console.log("dataOfShowTrips (parsed):", parsedTrips);
      console.log("InforCusto (parsed):", parsedCustomer);
    } catch (error) {
      console.error("Lỗi khi giải mã hoặc parse JSON:", error);
    }
  }, [location]);
  console.log("bookingId", bookingId)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const departureDate = queryParams.get("departureDate")
    const tripId = queryParams.get("tripId")
    const formattedDepartureDate = departureDate.replace("Th ", "").trim();
    const parts = formattedDepartureDate.split(", ");
    const dayMonthYear = parts[1];
    const formattedDepartureTime = moment(dayMonthYear, "D/MM/YYYY")
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    if (bookingId) {
      axios.get(`${API_URL}/api/addPaymentRoute/cancel`, {
        params: { bookingId },
      })
      .then((response) => {
        socket.socket?.emit('delete-get-seat', { tripId, bookingDate: formattedDepartureTime })
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Lỗi khi xử lý hủy thanh toán:', error);
        setErrorMessage('Đã xảy ra lỗi khi xử lý yêu cầu hủy.');
      });
    }
  }, [bookingId]);



  return (
    <Box sx={{ position: 'relative', }}>
      <AppBar sx={{
        backgroundColor: '#e7e7e7',
        position: 'unset',
      }} >
        <Toolbar sx={{ height: '70px', boxShadow: '2px 2px 6px rgba(47, 46, 46, 0.5)', zIndex: 1 }} >
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }} className='menu1'>
            <Box component="img" src={logo} alt="" sx={{ width: '300px', height: '70px', marginTop: '3px' }} ></Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ position: 'relative', height: 'auto' }}>
        <Box>
          <Box sx={{ width: '100%', height: 'auto', backgroundColor: '#f2f2f2' }}>
            <Box sx={{ width: '1000px', height: 'auto', alignItems: 'center', margin: 'auto', }}>
              <Box>
                <Button
                  startIcon={<ArrowBackIosNewRoundedIcon sx={{ width: '15px', color: '#888888' }} />}
                  onClick={() => navigate('/showTrips', { state: { dataOfShowTrips, InforCusto } })}
                  variant="outlined"
                  sx={{
                    border: 'none', textTransform: "none", fontSize: "13.5px", color: '#0456ca', lineHeight: '20px', padding: "15px 7px", textShadow: '1px 1px 2px rgba(255, 255, 255, 0.2)'
                  }}>Quay lại
                </Button>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }} >
                  <Box sx={{ display: 'flex', flexDirection: 'column', border: "1px solid #ddd", borderRadius: '10px', width: '620px', backgroundColor: 'rgb(255, 255, 255)' }}>
                    <Typography className='button35' sx={{ marginLeft: '18px', marginTop: '20px' }} >Phương thức thanh toán <span style={{ color: 'red' }}>*</span></Typography>
                    <Typography> Thanh toán không thành công </Typography>

                  </Box>

                </Box>

              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

PaymentCancel.prototype = {
  socket: PropTypes.object
}


export default PaymentCancel;