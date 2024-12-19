/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Stack, Paper,Divider,
    Alert, Typography,TableContainer,TableCell,TableHead,Table, TableRow,TableBody,IconButton ,TablePagination} from '@mui/material';
import PropTypes from 'prop-types';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import moment from 'moment-timezone';
import { vi } from "date-fns/locale";
import { format ,parse,parseISO ,isBefore} from "date-fns";
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const TicketManagement = ({ userInfo }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [busTripsList, setTripsList] = useState([]);
  const [busRouteList, setBusRouteList] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [selectedTripDates, setSelectedTripDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); 
  const [alert, setAlert] = useState({ open: false, severity: '', message: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingTicketId, setEditingTicketId] = useState(null);

  
  const [ticket, setTicket] = useState({
    userId:userInfo._id,
    note:"",
    tripId: selectedTripId,
    date:selectedDate,
    status :"",
    seatId:"",
  });
  console.log("ticket",ticket);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
   
    setTicket({
      ...ticket,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTripId || !selectedDate || !ticket.seatId) {
      setAlert({ open: true, severity: 'error', message: 'Vui lòng điền đầy đủ thông tin.' });
      return;
  }

  // Kiểm tra định dạng seatId
  if (!ticket.seatId.trim()) {
      setAlert({ open: true, severity: 'error', message: 'Vui lòng nhập vị trí chỗ ngồi.' });
      return;
  }
    const newTicket = {
      ...ticket,
      tripId: selectedTripId,
      date: selectedDate,
    };
    
  try {
    let response;
    if (editingTicketId) {
      response = await fetch(`${API_URL}/api/tripsRoutes/editTicket/${editingTicketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicket),
      });
    } else {
      response = await fetch(`${API_URL}/api/tripsRoutes/addTicket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicket),
      });
    }

    if (response.ok) {
      await fetchTripsList(); 
      await fetchUserList();
      await fetchBusRouteList();
      setTicket({
        userId: userInfo._id,
        note: "",
        tripId: selectedTripId,
        date: selectedDate,
        status: "",
        seatId: "",
      });
      setEditingTicketId(null);
      setAlert({ open: true, severity: 'success', message: editingTicketId ? 'Cập nhật vé thành công!' : 'Thêm vé thành công!' });
    } else {
      setAlert({ open: true, severity: 'error', message: 'Có lỗi khi xử lý vé!' });
    }
  } catch (error) {
    console.error('Error:', error);
    setAlert({ open: true, severity: 'error', message: 'Có lỗi khi xử lý vé!' });
  }
};

const onEditTicket = (ticketItem) => {
  console.log("ticketItem._id",ticketItem._id);
  setTicket({
    note: ticketItem.note,
    seatId: ticketItem.seatId,
    status: ticketItem.status,
    tripId: selectedTripId,
    date: selectedDate,
  });
  setEditingTicketId(ticketItem._id);
};
  const fetchTripsList = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tripsRoutes/list?userId=${userInfo._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTripsList(data);
        console.log("Thông ti chuyến đi")
      } else {
        console.error('Error bus list:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const fetchUserList = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/getAll`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.users);  
      } else {
        console.error('Error fetching user list:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const fetchBusRouteList = async () => {
    try {
      const response = await fetch(`${API_URL}/api/busRoutes/list?userId=${userInfo._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setBusRouteList(data);
      } else {
        console.error('Error bus list:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchTripsList();
    fetchBusRouteList();
    fetchUserList();
  }, [userInfo._id]);

  const getRouteInfo = (routeId) => {
    const route = busRouteList.find((route) => route._id === routeId);
    return route ? `${route.departure} đến ${route.destination}` : '';
  };

  const handleAlertClose = () => {
    setAlert({ open: false, severity: '', message: '' });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };


  const filteredTrip = selectedTripDates.find(trip => trip.date === selectedDate);
  const getFullNameByUserId = (userId) => {
    const foundUser = user.find(u => u._id === userId);
    return foundUser ? foundUser.fullName : '';
  };
  const getPhoneByUserId = (userId) => {
    const foundUser = user.find(u => u._id === userId);
    return foundUser ? foundUser.phoneNumber : '';
  };
 
  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth size="small" sx={{ width: '600px' , marginRight:'10px'}}>
        <InputLabel sx={{color: '#706966',fontSize: '16px','&.Mui-focused': { color: '#ed6c02' },}}>Chọn chuyến đi</InputLabel>
        <Select
          color="warning" value={selectedTripId}
          onChange={(e) => {
            setSelectedTripId(e.target.value);
            const selectedTrip = busTripsList.find((trip) => trip._id === e.target.value);
            setSelectedTripDates(selectedTrip ? selectedTrip.tripDates : []); 
          }}
          label="Chọn chuyến đi"
          sx={{
            fontSize: '14.4px',
            backgroundColor: '#fef3f0',
            '&.Mui-focused': {
              backgroundColor: 'white',
              boxShadow: '0 0 0 2px rgb(255, 224, 212)',
            },
          }}
        >
          {busTripsList.map((trip) => (
            <MenuItem key={trip._id} value={trip._id}
            sx={{backgroundColor: '#f9f9f9',  fontSize: '13px'}}>
              {trip.TripsName} - {getRouteInfo(trip.routeId)} - (
                {moment(trip.departureTime, "DD/MM/YYYY, HH:mm").tz("Asia/Ho_Chi_Minh").format("HH:mm")} - {moment(trip.endTime, "DD/MM/YYYY, HH:mm").tz("Asia/Ho_Chi_Minh").format("HH:mm")})          
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth  size="small" sx={{ width: '500px' }}>
        <InputLabel sx={{
          color: '#706966',
          fontSize: '16px',
          '&.Mui-focused': { color: '#ed6c02' },
        }}>Ngày chuyến đi</InputLabel>
        <Select
          color="warning"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)} 
          label="Ngày của tuyến"  
          sx={{
            fontSize: '14.5px',
            backgroundColor: '#fef3f0',
            '&.Mui-focused': {
              backgroundColor: 'white',
              boxShadow: '0 0 0 2px rgb(255, 224, 212)',
            },
          }}
        >
                  {selectedTripDates.map((tripDate) => {
          const tripDateParsed = parse(tripDate.date, "dd/MM/yyyy, HH:mm", new Date());
          if (isNaN(tripDateParsed)) {
            console.error('Invalid date:', tripDate.date);
            return null;  
          }
          const isPast = isBefore(tripDateParsed, new Date());

          return (
            <MenuItem
              key={tripDate._id}
              value={tripDate.date}
              sx={{ color: isPast ? "gray" : "black", backgroundColor: '#f9f9f9', fontSize: '14px'}}
              InputProps={{
                sx: {
                  fontSize: '13px',
                  backgroundColor: '#fef3f0',
                  '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 0 0 2px rgb(255, 224, 212)' },
                },
              }}
              InputLabelProps={{ sx: { fontSize: '13px' } }}
            >
              {/* Chỉ hiển thị ngày mà không có giờ */}
              {format(tripDateParsed, "eeee, dd/MM/yyyy", { locale: vi })}
            </MenuItem>
          );
        })}
        </Select>
      </FormControl>
      {selectedTripId && selectedDate && (
        
    <Box sx={{  borderRadius: '10px', marginTop: '10px',
      border: '1px solid #e5e5e5',
      padding: '10px', 
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
       <Typography sx={{textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', }}>{editingTicketId ? "Cập nhật vé" : "Thêm vé xe"}</Typography>
      <Typography sx={{ display:'flex' ,marginTop: '10px', marginLeft:'15px'}}>
      <TextField
      label="Ghi chú (Không bắt buộc)"
      name="note"
      value={ticket.note}
      fullWidth
      sx={{ marginBottom: '10px' ,width:'500px', marginRight:'10px' }}
      size="small"
      onChange={handleInputChange} 
      color="warning"
      InputProps={{
        sx: {
          fontSize: '14px',
          backgroundColor: '#fef3f0',
          '&.Mui-focused': {
            backgroundColor: 'white',
            boxShadow: ' 0 0 0 2px rgb(255, 224, 212)'
          },
        },
      }}
      InputLabelProps={{
        sx: {
          fontSize: '13px',
        },
      }}
    />
    <TextField
      label="Vị trí Chỗ"
      name="seatId"
      fullWidth
      sx={{ marginBottom: '10px' ,width:'200px', marginRight:'10px' }}
      size="small"
      value={ticket.seatId}
      onChange={handleInputChange} 
      color="warning"
      InputProps={{
        sx: {
          fontSize: '14px',
          backgroundColor: '#fef3f0',
          '&.Mui-focused': {
            backgroundColor: 'white',
            boxShadow: ' 0 0 0 2px rgb(255, 224, 212)'
          },
        },
      }}
      InputLabelProps={{
        sx: {
          fontSize: '13px',
        },
      }}

    />
    <FormControl fullWidth size="small" sx={{ marginBottom: '10px' }}>
    <InputLabel sx={{
          color: '#706966',
          fontSize: '16px',
          '&.Mui-focused': { color: '#ed6c02' },
        }}>Trạng thái</InputLabel>
    <Select
      label="Trạng thái"
      name="status"
      
      value={ticket.status} 
      // onChange={handleInputChange} 
      onChange={handleInputChange}
      color="warning"
      sx={{
        width:'200px', marginRight:'10px', 
        fontSize: '14.4px',
        backgroundColor: '#fef3f0',
        '&.Mui-focused': {
          backgroundColor: 'white',
          boxShadow: '0 0 0 2px rgb(255, 224, 212)',
        },
      }}
    >
      <MenuItem value="Đã đặt"  sx={{backgroundColor: '#f9f9f9',  fontSize: '13px'}}>Đã đặt</MenuItem>
      <MenuItem value="Đã thanh toán"  sx={{backgroundColor: '#f9f9f9',  fontSize: '13px'}}>Đã thanh toán</MenuItem>
      <MenuItem value="Đã đặt trước"  sx={{backgroundColor: '#f9f9f9',  fontSize: '13px'}}>Đã đặt trước</MenuItem>
      <MenuItem value="Đã Hủy" sx={{backgroundColor: '#f9f9f9',  fontSize: '13px'}}>Đã Hủy</MenuItem>
    </Select>
  </FormControl>
    <Button
      variant="contained"
      color="warning"
      type="submit" 
      // onClick={handleAddTicket}
      // onChange={handleInputChange}
      onClick={handleSubmit} 
      sx={{
        borderRadius:'50px', width:'70px',height:'40px',fontSize:'13px',backgroundColor: '#4CAF50',color: 'white', 
             '&:hover': {backgroundColor: '#576757', },}}> 
             
             <SaveAsOutlinedIcon sx={{ width:'25px'}}></SaveAsOutlinedIcon>
    </Button>
</Typography>
    
  </Box>
)}
     <Box sx={{display:'flex', alignItems:'center',}}>
      <Stack sx={{ width: '600px', mt: 2,marginLeft:'30px'  }}>
        {alert.open && (
          <Alert 
            severity={alert.severity} 
            onClose={handleAlertClose}
          >
            {alert.message}
          </Alert>
        )}
      </Stack>
     </Box>
     
     <Box sx={{ borderRadius: '10px', border: '1px solid #e5e5e5', padding: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}>
     <Box sx={{display:'flex' , justifyContent:'space-between', width:'50%'}}>
      <Typography sx={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Danh Sách Vé xe </Typography>
        {filteredTrip?.sales ? (
          <Typography sx={{display:'flex', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
            Số lượng vé đã đặt cho chuyến {" "}
            {filteredTrip.bookedSeats?.booked.filter(
              (seat) => seat.status === "Đã đặt trước" || seat.status === "Đã thanh toán"
            ).length || 0}
          </Typography>
        ) : ("")}
       </Box>
      <TableContainer component={Paper} sx={{ border: '1px solid #e5e5e5', marginTop: '10px', maxHeight: '400px', overflowY: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell  sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>STT</TableCell>
            <TableCell  sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Vé</TableCell>
            <TableCell  sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Họ tên Khách hàng</TableCell>
            <TableCell  sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Số điện thoại</TableCell>
            <TableCell  sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Thời gian đặt vé</TableCell>
            <TableCell  sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Tổng giá tiền</TableCell>
            <TableCell  sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Ghi chú</TableCell>
            <TableCell  sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Trạng Thái</TableCell>
            <TableCell  sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Công Cụ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
          {filteredTrip?.bookedSeats?.booked.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)).map((seat, index) => (
            <TableRow key={index}>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{index + 1}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>
                {seat.status === "Đã Hủy" ? (
                  seat.seatId
                ) : (
                  <>
                  <CheckCircleRoundedIcon sx={{ width: '10px', color: '#0a9d00' }} />
                  <Typography>{seat.seatId}</Typography>
                    </>
                )}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{getFullNameByUserId(seat.userId)}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{getPhoneByUserId(seat.userId)}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}> {format(new Date(seat.bookingDate), "eee, HH:mm dd/MM/yyyy", { locale: vi })}</TableCell>
              {busTripsList.filter((trip) => trip._id === selectedTripId) .map((trip) => (
                  <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}
                    key={trip._id}>{trip.totalFareAndPrice.toLocaleString("vi-VN", {style: "currency",currency: "VND",})} </TableCell>
              ))}
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{seat.note}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{seat.status}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>
                  {seat.status === "Đã Hủy" ? (
                       <LockRoundedIcon sx={{ width: '25px' ,color: '#d00700' }} />
                  ) : (
                    
                    <IconButton
                    sx={{
                      color: '#f4b807',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', 
                      borderRadius: '50px', 
                      height: '30px', 
                      '&:hover': { color: '#313731' }
                    }}
                    onClick={() => onEditTicket(seat)}
                  >
                    <ReportProblemOutlinedIcon sx={{ width: '25px' }} />
                  </IconButton>
                  )}
                </TableCell>
            </TableRow>
          ))}
           <TableRow>
    <TableCell colSpan={9} sx={{ textAlign: 'left', fontWeight: 'bold' }}>
    {filteredTrip?.sales ? (
        <>
          <Typography sx={{ textAlign: 'left', fontSize: '16px', lineHeight:'21px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)', position: 'sticky', bottom: 0, backgroundColor: 'white' }}>
            Tổng số lượng vé đã thanh toán: {filteredTrip.sales.totalTicketsSold || 0}
          </Typography>
          <Typography sx={{ textAlign: 'left', fontSize: '16px', lineHeight:'21px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)', position: 'sticky', bottom: 0, backgroundColor: 'white' }}>
            Tổng số tiền đã thanh toán: {" "}
            {filteredTrip.sales.totalRevenue.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }) || 0}
          </Typography>
        </>
      ) : (
        "Không có dữ liệu doanh thu."
      )}
    </TableCell>
  </TableRow>
          
        </TableBody>
        
      </Table>
      <TablePagination
  rowsPerPageOptions={[5, 10, 25]}
  component="div"
  count={filteredTrip?.bookedSeats?.booked.length || 0}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  labelRowsPerPage="Số dòng mỗi trang:"
  labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count}`}
/>
    </TableContainer>
     
    </Box>
    </Box>
  );
};

TicketManagement.propTypes = {
  userInfo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default TicketManagement;
