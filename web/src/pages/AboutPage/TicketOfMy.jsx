/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef  } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Autocomplete,
  Button 
} from "@mui/material";
import "../HomePage/css/content.css";
import PropTypes from 'prop-types';
import axios from 'axios';

const TicketOfMy = ({userInfo}) => {
    console.log("userInfo",userInfo);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchBookings = async () => {
          try {
            const response = await axios.get(`${API_URL}/api/bookings/${userInfo._id}`);
            setBookings(response.data); 
            console.log("bookings",bookings);
          } catch (error) {
            console.error('Error fetching bookings:', error);
          } finally {
            setLoading(false); 
          }
        };
    
        fetchBookings();
      }, [userInfo._id]);
return (
    <Box sx={{
        width: "1200px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        margin: "auto",
        border: "1px solid #ececec",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        }}>   
    <Typography  className="button38-6">Lịch sử mua vé</Typography>
    <Box>
      {bookings.length === 0 ? (
        <Typography>Không có booking nào.</Typography> 
      ) : (
        <Box>
          {bookings.map((booking) => (
            <Box key={booking.BookingID}>
              <Typography>Booking ID: {booking.BookingID}</Typography>
              <Typography>Tuyến đường: {booking.selectedDepartureName} - {booking.selectedDestinationName}</Typography>
              <Typography>Ngày đi: {new Date(booking.departureDate).toLocaleDateString()}</Typography>
              <Typography>Trạng thái thanh toán: {booking.paymentStatus}</Typography>
              <Typography>Giá vé: {booking.totalFare} VND</Typography>
              <Typography>Thông tin hành khách: {booking.passengerInfo.fullName} - {booking.passengerInfo.phoneNumber}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
    </Box>

  )
};
TicketOfMy.propTypes = {
  userInfo: PropTypes.func,
};
      
export default TicketOfMy;