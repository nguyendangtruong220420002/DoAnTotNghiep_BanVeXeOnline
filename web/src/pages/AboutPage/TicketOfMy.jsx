/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Divider
} from "@mui/material";
import PropTypes from 'prop-types';
import axios from 'axios';

const TicketOfMy = ({ userInfo }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0); 
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/bookingRoutes/getBookingByUserId`, {
          params: { userId: userInfo._id },
        });
        setBookings(response.data);
        console.log("setBookings",bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userInfo]);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue); 
  };
  const filterBookingsByPaymentStatus = (status) => {
    return bookings.filter((booking) => booking.paymentStatus === status);
  };
  return (
    <Box sx={{ width: '800px', height: '475px', backgroundColor: '#fffafa', 
         }}>      
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="payment status tabs"
        centered
        sx={{ width: "98%", borderBottom: 4,marginBottom:'15px',borderRadius: '10px', border: '2px solid #e5e7eb', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' ,}}
      >
        <Tab className='button6'  sx={{width:'33%', textAlign:'center'}} label="Chờ thanh toán" />
        <Tab  className='button6'  sx={{width:'33%', textAlign:'center'}}  label="Đã thanh toán" />
        <Tab  className='button6'  sx={{width:'33%', textAlign:'center'}}  label="Đã Hủy" />
      </Tabs>

      {selectedTab === 0 && (
        <Box  sx={{  maxHeight: '500px', overflowY: 'auto',  '&::-webkit-scrollbar': {width: ''},scrollbarWidth: 'none',}}>
          {filterBookingsByPaymentStatus('Đang chờ thanh toán').length === 0 ? (
            <Typography className="button39-1">Không có vé nào đang chờ thanh toán.</Typography>
          ) : (
            filterBookingsByPaymentStatus('Đang chờ thanh toán').sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)).map((booking) => (
                <Box key={booking.BookingID} sx={{ marginBottom: 2, width: "98%" , borderRadius: '15px', border: '2px solid #e5e7eb', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'}}>
                <Typography sx={{borderRadius: '5px', border: '1px solid #c1c1c1', margin:'12px'}}>
                    <Box sx={{display:'flex', justifyContent:'space-between', marginTop:'10px'}}>
                        <Typography className="button39-1">{booking.departureDate}</Typography>
                        <Typography className="button39-1" > Đang chờ . . .</Typography>
                    </Box>
                    <Typography className="button39-2">{booking.Timehouse}</Typography>
                    <Typography className="button39-3">{booking.tripId.userId.fullName}</Typography>
                    <Typography className="button39-3">{booking.tripId.routeId.departure} - {booking.tripId.routeId.destination} </Typography>
                    <Typography className="button39-3"><strong>Đón/trả</strong> {booking.selectedDepartureName} - {booking.selectedDestinationName}</Typography>
                    <Typography className="button39-3"
                    sx={{marginBottom:'10px',}}> <strong>Số điện thoại nhà xe:</strong> {booking.tripId.userId.phoneNumber}</Typography>
                    <Divider></Divider>
                    <Typography className="button39-1" sx={{marginTop:'5px'}}><strong>Tổng tiền:</strong>{new Intl.NumberFormat('vi-VN', {style: 'currency',currency: 'VND',}).format(booking.totalFare)}</Typography>
                </Typography>
            </Box>
            ))
          )}
        </Box>
      )}
      {selectedTab === 1 && (
        <Box sx={{  maxHeight: '500px', overflowY: 'auto',  '&::-webkit-scrollbar': {width: ''},scrollbarWidth: 'none',
          }} >
          {filterBookingsByPaymentStatus('Đã thanh toán').length === 0 ? (
            <Typography className="button39-1">Không có vé đã thanh toán.</Typography>
          ) : (
            filterBookingsByPaymentStatus('Đã thanh toán').sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)).map((booking) => (
                <Box key={booking.BookingID} sx={{ marginBottom: 2, width: "98%" , borderRadius: '15px', border: '2px solid #e5e7eb', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'}}>
                        <Typography sx={{borderRadius: '5px', border: '1px solid #c1c1c1', margin:'12px'}}>
                            <Box sx={{display:'flex', justifyContent:'space-between', marginTop:'10px'}}>
                                <Typography className="button39-1">{booking.departureDate}</Typography>
                                <Typography className="button39-1">{booking.seatId}</Typography>
                            </Box>
                            <Typography className="button39-2">{booking.Timehouse}</Typography>
                            <Typography className="button39-3">{booking.tripId.userId.fullName}</Typography>
                            <Typography className="button39-3">{booking.tripId.routeId.departure} - {booking.tripId.routeId.destination} </Typography>
                            <Typography className="button39-3"><strong>Đón/trả</strong> {booking.selectedDepartureName} - {booking.selectedDestinationName}</Typography>
                            <Typography className="button39-3"
                            sx={{marginBottom:'10px',}}> <strong>Số điện thoại nhà xe:</strong> {booking.tripId.userId.phoneNumber}</Typography>
                            <Divider></Divider>
                            <Typography className="button39-1" sx={{marginTop:'5px'}}><strong>Tổng tiền:</strong>{new Intl.NumberFormat('vi-VN', {style: 'currency',currency: 'VND',}).format(booking.totalFare)}</Typography>
                        </Typography>
              </Box>
            ))
          )}
        </Box>
      )}

      {selectedTab === 2 && (
        <Box sx={{  maxHeight: '500px', overflowY: 'auto',  '&::-webkit-scrollbar': {width: ''},scrollbarWidth: 'none',}}>
          {filterBookingsByPaymentStatus('Thanh toán không thành công').length === 0 ? (
            <Typography className="button39-1">Không có vé nào thanh toán không thành công.</Typography>
          ) : (
            filterBookingsByPaymentStatus('Thanh toán không thành công').sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)).map((booking) => (
                <Box key={booking.BookingID} sx={{ marginBottom: 2, width: "98%" , borderRadius: '15px', border: '2px solid #e5e7eb', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'}}>
                <Typography sx={{borderRadius: '5px', border: '1px solid #c1c1c1', margin:'12px'}}>
                    <Box sx={{display:'flex', justifyContent:'space-between', marginTop:'10px'}}>
                        <Typography className="button39-1">{booking.departureDate}</Typography>
                        <Typography className="button39-1" > Đã hủy</Typography>
                    </Box>
                    <Typography className="button39-2">{booking.Timehouse}</Typography>
                    <Typography className="button39-3">{booking.tripId.userId.fullName}</Typography>
                    <Typography className="button39-3">{booking.tripId.routeId.departure} - {booking.tripId.routeId.destination} </Typography>
                    <Typography className="button39-3"
                    sx={{marginBottom:'10px',}}> <strong>Số điện thoại nhà xe:</strong> {booking.tripId.userId.phoneNumber}</Typography>
                    <Divider></Divider>
                    <Typography className="button39-1" sx={{marginTop:'5px'}}></Typography>
                </Typography>
            </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

TicketOfMy.propTypes = {
    userInfo: PropTypes.object,
};

export default TicketOfMy;