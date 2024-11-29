/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box,MenuItem, TextField,Select, InputLabel,TablePagination , Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,IconButton,Autocomplete,FormControl  } from "@mui/material";
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import axios from "axios";
import moment from 'moment-timezone';


const Trips = ({ userInfo, }) => {

  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [editingTripsId, setEditingTripsId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [busRouteList, setBusRouteList] = useState([]);
  const [busList, setBusList] = useState([]); 
  const [busTripsList, setTripsList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [departureTime, setDepartureTime] = useState(''); 
  const [endTime, setEndTime] = useState('');

  const [trips, setTrips] = useState({
    TripsName: '',
    routeId: '',
    busId: '',
    departureTime: '',
    status: '',
    endTime:'',
    bookedSeats:'',
    tripType:'',
    totalFareAndPrice: '',
  });

  //tính giá vé/ghế
  useEffect(() => {
    const fare = (busRouteList.find((route) => route._id === trips.routeId)?.totalFare || 0);
    const busPrice = (busList.find((bus) => bus._id === trips.busId)?.Price || 0);
    const totalFareAndPrice = fare + busPrice;
  
    setTrips((prevTrips) => ({
      ...prevTrips,
      totalFareAndPrice: totalFareAndPrice,
    }));
  }, [trips.routeId, trips.busId, busRouteList, busList]);
  console.log("trips",trips);
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrips((prevTrips) => ({
      ...prevTrips,
      [name]: value,
    }));
    
    if (name === 'departureTime') {
      setDepartureTime(value);
  } else if (name === 'endTime') {
      setEndTime(value); 
  }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };
  
  

  const handleSubmit = async(e) => {
    e.preventDefault(); 
   
    const formattedDepartureTime = moment(trips.departureTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm');
    const formattedEndTime = moment(trips.endTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm');
     console.log('Thời gian khởi hành:', formattedDepartureTime);
     console.log('Thời gian kết thúc:', formattedEndTime);
   
    const Trips = { 
      ...trips, userId: userInfo._id, 
      departureTime: formattedDepartureTime,  
      endTime: formattedEndTime, 
    
    };
     console.log('Dữ liệu gửi đến backend', Trips);
    try {
      let response;
      if (editingTripsId) {
        response = await fetch(`${API_URL}/api/tripsRoutes/update/${editingTripsId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Trips),
        });
      } else {
        response = await fetch(`${API_URL}/api/tripsRoutes/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Trips),
        });
      }
  
      if (response.ok) {
        await fetchTripsList(); 
        await  fetchBusList(); 
        setTrips({ TripsName: '',routeId: '',busId: '',departureTime: '',status: '',endTime:'',bookedSeats:'',});
        setEditingTripsId(null); 
        setAlert({ open: true, message: editingTripsId ? 'Cập nhật chuyến xe thành công!' : 'Thêm chuyến xe thành công!', severity: 'success' });
      } else {
        const errorData = await response.json();
      setAlert({ open: true, message: errorData.message || 'Có lỗi xảy ra!', severity: 'error' });
      }
    } catch (error) {
      setAlert({ open: true, severity: 'error', message: 'Có lỗi xảy ra, vui lòng thử lại.' });
    }
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
      } else {
        console.error('Error bus list:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const fetchBusList = async () => {
    try {
      const response = await fetch(`${API_URL}/api/buses/list?userId=${userInfo._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setBusList(data);
      } else {
        console.error('Error bus list:', response.statusText);
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
    fetchBusList(); 
    fetchBusRouteList();
    fetchTripsList();
  }, []);
  const onEdit = (tripsItem) => {
    const departureTimeEdit = moment(tripsItem.departureTime, "DD/MM/YYYY, HH:mm").tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm');
    const endTimeEdit = moment(tripsItem.endTime, "DD/MM/YYYY, HH:mm").tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm');
   
    console.log('Editing trip item:', tripsItem); 
    setTrips({
      TripsName: tripsItem.TripsName,
      busId: tripsItem.busId,
      routeId:tripsItem.routeId,
      departureTime:departureTimeEdit,
      status: tripsItem.status,
      endTime: endTimeEdit,
      bookedSeats:tripsItem.bookedSeats,
      tripType:tripsItem.tripType,
      
    });
    setEditingTripsId(tripsItem._id);
    setIsEditing(true);
  };
  const onDelete = async (tripsItem) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tuyến xe này không?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_URL}/api/tripsRoutes/delete/${tripsItem._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          await fetchTripsList(); 
          setAlert({ open: true, message: 'Xóa chuyến xe thành công!', severity: 'success' });
        } else {
          const errorData = await response.json();
          setAlert({ open: true, message: errorData.error || 'Có lỗi xảy ra!', severity: 'error' });
        }
      } catch (error) {
        console.error('Error:', error);
        setAlert({ open: true, message: 'Có lỗi xảy ra!', severity: 'error' });
      }
    }
  };
  
  const handleAlertClose = () => {
    setAlert((prevAlert) => ({ ...prevAlert, open: false }));
};
  return (
    <Box sx={{ width: "1200px",}}>
      <Box sx={{
          borderRadius: '10px',
          border: '1px solid #e5e5e5',
          padding: '10px', 
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}>
         <Typography sx={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
            {isEditing ? 'Sửa Chuyến Xe' : 'Thêm Chuyến Xe'}
        </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection:'column',
          gap:2, 
          marginLeft:'20px'
        }}
      >
        <Box  sx={{
          display: "flex",
          flexDirection:'column',
          gap:3, 
          marginTop:'10px'
        }}>
          <Box sx={{display: "flex",gap:2, }}>
          <TextField
        color="warning"
        label="Tên chuyến Xe"
        size="small"
        name="TripsName"
        sx={{width:'250px'}}
        value={trips.TripsName}
        onChange={handleChange}
        InputProps={{
            sx: {
              fontSize: '13px',
              backgroundColor: '#fef3f0',
              '&.Mui-focused': {
                backgroundColor: 'white',
                boxShadow: '0 0 0 2px rgb(255, 224, 212)',
              },
              inputProps: {
                min: 0,
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
        color="warning"
        label="Thời gian khởi hàng"
        variant="outlined"
        size="small"
        sx={{width:'250px'}}
        name="departureTime"
        type="datetime-local"
        value={trips.departureTime || ''}
        onChange={handleChange}
        InputProps={{
            sx: {
              fontSize: '13px',
              backgroundColor: '#fef3f0',
              '&.Mui-focused': {
                backgroundColor: 'white',
                boxShadow: '0 0 0 2px rgb(255, 224, 212)',
              },
              inputProps: {
                min: 0,
              },
            },
          }}
          InputLabelProps={{
            shrink: true, 
            sx: {
              fontSize: '13px',
            },
          }}
      />
        <TextField
        color="warning"
        label="Thời gian đến"
        variant="outlined"
        size="small"
        sx={{width:'250px'}}
        name="endTime"
        type="datetime-local"
        value={trips.endTime || ''} 
        onChange={handleChange}
        InputProps={{
            sx: {
              fontSize: '13px',
              backgroundColor: '#fef3f0',
              '&.Mui-focused': {
                backgroundColor: 'white',
                boxShadow: '0 0 0 2px rgb(255, 224, 212)',
              },
              inputProps: {
                min: 0,
              },
            },
          }}
          InputLabelProps={{
            shrink: true, 
            sx: {
              fontSize: '13px',
            },
          }}
      />
      <FormControl size="small" sx={{ width: '200px' }}>
        <InputLabel 
          sx={{color: '#706966',fontSize:'13px','&.Mui-focused': {
            color: '#ed6c02', 
          },}}
        >
          Trạng thái
        </InputLabel>
        <Select
          label="Trạng thái"
          name="status"
          value={trips.status}
          onChange={handleChange}
          color="warning"
          sx={{
            fontSize: '13px',
            backgroundColor: '#fef3f0',
            '&.Mui-focused': {
              backgroundColor: 'white',
              boxShadow: '0 0 0 2px rgb(255, 224, 212)',
            }
          }}
        >
          <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
          <MenuItem value="Hoạt động thành công">Hoạt động thành công</MenuItem>
          <MenuItem value="Hủy">Hủy</MenuItem>
        </Select>
      </FormControl>
          </Box>
        <Box sx={{display:'flex',gap:2}}>
        <FormControl sx={{ width: '350px', mb: 2 }} size="small">
         <InputLabel sx={{color: '#706966',fontSize:'13px','&.Mui-focused': {
        color: '#ed6c02', 
      },}}>Tên tuyến Xe</InputLabel>
        <Select
          color="warning"
          label="ID Tuyến Xe"
          name="routeId"
          value={trips.routeId}
          onChange={handleChange}
          sx={{
            fontSize: '13px',
            backgroundColor: '#fef3f0',
            '&.Mui-focused': {
              backgroundColor: 'white',
              boxShadow: '0 0 0 2px rgb(255, 224, 212)',
            },
          }}
        >
          {busRouteList.map((busRoute) => (
            <MenuItem key={busRoute._id} value={busRoute._id}>
            <Box sx={{display:'flex', alignItems:'center'}}><Typography sx={{fontSize:'13px'}}>{busRoute.routeName}</Typography>( <Typography sx={{fontSize:'10px'}}>{busRoute.departure} đến {busRoute.destination}</Typography>)</Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: '300px', mb: 2 }} size="small">
      <InputLabel 
        sx={{
          color: '#706966',
          fontSize: '13px',
          '&.Mui-focused': { color: '#ed6c02' },
        }}
      >
        Loại xe
      </InputLabel>
      <Select
        color="warning"
        label="Loại xe"
        name="busId"
        value={trips.busId}
        onChange={handleChange}
        sx={{
          fontSize: '13px',
          backgroundColor: '#fef3f0',
          '&.Mui-focused': {
            backgroundColor: 'white',
            boxShadow: '0 0 0 2px rgb(255, 224, 212)',
          },
        }}
      >
    {busList.map((bus) => (
      <MenuItem 
        key={bus._id} 
        value={bus._id} 
       // disabled={bus.status === 'Đang phục vụ'} 
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px' }}>{bus.busType}</Typography>
          {/* <Typography sx={{ fontSize: '10px' }}>{bus.licensePlate}</Typography> */}
        </Box>
      </MenuItem>
    ))}
  </Select>
</FormControl>
      <FormControl size="small" sx={{ width: '200px' }}>
            <InputLabel 
               sx={{color: '#706966',fontSize:'13px','&.Mui-focused': {
                color: '#ed6c02', 
              },}}
            >
              Loại chuyến xe
            </InputLabel>
            <Select
              label="Loại chuyến xe"
              name="tripType"
              value={trips.tripType}
              onChange={handleChange}
              color="warning"
              sx={{
                fontSize: '13px',
                backgroundColor: '#fef3f0',
                '&.Mui-focused': {
                  backgroundColor: 'white',
                  boxShadow: '0 0 0 2px rgb(255, 224, 212)',
                }
              }}
            >
              <MenuItem value="Cố định">Cố định</MenuItem>
              <MenuItem value="Không cố định">Linh hoạt</MenuItem>
            </Select>
          </FormControl>
          <TextField
              color="warning"
              label="Giá vé/ghế"
              variant="outlined"
              size="small"
              sx={{ width: '120px' }}
              name="departureTime"
              type="text"  
              value={(trips.totalFareAndPrice || 0).toLocaleString()} 
              InputProps={{
                disabled: true,  
                sx: {
                  fontSize: '13px',
                  backgroundColor: '#f6f6f6',
                  color:'#dc635b',
                  '&.Mui-focused': {
                    backgroundColor: '#dc635b',
                    boxShadow: '0 0 0 2px rgb(255, 224, 212)',
                  },
                },
              }}
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: '14px',
                  color:'#dc635b',
                },
              }}
            />
        </Box>
        </Box>
        <Box sx={{display:"flex",gap:2, alignContent:'center', marginLeft:'20px'}}>
        <Button type="submit"  variant="contained" color="primary"sx={{
                 borderRadius:'50px', width:'70px',height:'40px',fontSize:'13px',backgroundColor: '#4CAF50',color: 'white', 
                      '&:hover': {backgroundColor: '#576757', },}}> 
                      <SaveAsOutlinedIcon sx={{ width:'25px'}}></SaveAsOutlinedIcon>
        </Button >
          <Stack sx={{ width: '600px',}}>
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
      </Box>
      </Box>
      <Box sx={{ borderRadius: '10px', border: '1px solid #e5e5e5', padding: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}>
      <Typography sx={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Danh Sách Tuyến xe</Typography>
      <TableContainer component={Paper} sx={{ border: '1px solid #e5e5e5', marginTop: '10px', maxHeight: '400px', overflowY: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
          <TableCell sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>STT</TableCell> {/* Cột STT */}
            <TableCell sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Tên chuyến</TableCell>
            <TableCell sx={{ minWidth: 50, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Tuyến xe</TableCell>
            <TableCell sx={{ minWidth: 50, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Loại xe</TableCell>
            <TableCell sx={{ minWidth: 50, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>(Đặt/Tổng)</TableCell>
            <TableCell sx={{ minWidth: 50, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Thời gian khởi hành</TableCell>
            <TableCell sx={{ minWidth: 50, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Thời gian đến</TableCell>
            <TableCell sx={{ minWidth: 50, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Tổng giá vé(VND)</TableCell>
            <TableCell sx={{ minWidth: 50, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Loại chuyến</TableCell>
            <TableCell sx={{ minWidth: 50, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Trạng thái</TableCell>
            <TableCell sx={{ minWidth: 50, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Thao Tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {busTripsList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tripsItem, index) => (
            
            <TableRow key={index}>
               <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{page * rowsPerPage + index + 1}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{tripsItem.TripsName}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>
              {busRouteList.find((route) => route._id === tripsItem.routeId)?.routeName}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>
              {busList.find((bus) => bus._id === tripsItem.busId)?.busType}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{tripsItem.bookedSeats}/{busList.find((bus) => bus._id === tripsItem.busId)?.cartSeat} chỗ
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{tripsItem.departureTime}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{tripsItem.endTime}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{tripsItem.totalFareAndPrice} VND</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{tripsItem.tripType}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{tripsItem.status}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>
                <IconButton 
                  sx={{
                    color: '#f4b807',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                    borderRadius: '50px',
                    height: '30px',
                    '&:hover': { color: '#313731' }
                  }}
                  onClick={() => onEdit(tripsItem)}
                >
                  <ReportProblemOutlinedIcon sx={{ width: '25px' }} />
                </IconButton>
                <IconButton 
                  sx={{
                    color: '#F44336',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                    borderRadius: '50px',
                    height: '30px',
                    '&:hover': { color: '#313731' }
                  }}
                  onClick={() => onDelete(tripsItem)}
                >
                  <DeleteForeverOutlinedIcon sx={{ width: '25px' }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={7} sx={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', position: 'sticky', bottom: 0, backgroundColor: 'white' }}>
              Tổng số chuyến xe: {busTripsList.length}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={busRouteList.length}
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
Trips.propTypes = {
  userInfo: PropTypes.shape({ 
    _id: PropTypes.string.isRequired,
  }).isRequired, 
  setUserInfo: PropTypes.func.isRequired,
};
export default Trips;
