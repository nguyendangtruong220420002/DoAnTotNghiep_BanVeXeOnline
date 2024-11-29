/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Stack, Paper,Divider,
    Alert, Typography,TableContainer,TableCell,TableHead,Table, TableRow,TableBody,IconButton ,TablePagination} from '@mui/material';
import PropTypes from 'prop-types';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import moment from 'moment-timezone';

const Schedule = ({ userInfo }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [busTripsList, setTripsList] = useState([]);
  const [busRouteList, setBusRouteList] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [schedule, setSchedule] = useState([{ name: '', address: '', time: '' }]);
  const [alert, setAlert] = useState({ open: false, severity: '', message: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
   const [editingTripsId, setEditingTripsId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prevState) => !prevState);
  };
  const handleChange = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const addStop = () => {
    setSchedule([...schedule, { name: '', address: '', time: '' }]);
  };

  const removeStop = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      if (!selectedTripId) {
        setAlert({ open: true, severity: 'warning', message: 'Vui lòng chọn một chuyến đi' });
        return;
      }
    //   console.log("selectedTripId:", selectedTripId);
    //   console.log("Dữ liệu gửi lên:", schedule);
      const response = await fetch(`${API_URL}/api/tripsRoutes/update-schedule/${selectedTripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tripId: selectedTripId,  schedule: schedule,  }), 
      });
  
      if (!response.ok) {
        await fetchTripsList(); 
        throw new Error('Cập nhật lịch trình không thành công');
      }
      const updatedTrip = await response.json();
      setTripsList((prevTripsList) => 
        prevTripsList.map((trip) =>
          trip._id === updatedTrip._id ? { ...trip, schedule: updatedTrip.schedule } : trip
        )
      );
      
      //console.log('Lịch trình đã được cập nhật:', updatedTrip);
      setAlert({ open: true, severity: 'success', message: 'Cập nhật lịch trình thành công!' });
  
    } catch (error) {
      console.error('Lỗi khi cập nhật lịch trình:', error);
      setAlert({ open: true, severity: 'error', message: 'Có lỗi xảy ra khi cập nhật lịch trình.' });
    }
  };
  //console.log('Dữ liệu gửi lên:', JSON.stringify({ schedule }));
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
        console.log('Dữ liệu chuyến đi:', data);
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
    fetchTripsList();
    fetchBusRouteList();
  }, [userInfo._id]);

  const getRouteInfo = (routeId) => {
    const route = busRouteList.find((route) => route._id === routeId);
    return route ? `${route.departure} đến ${route.destination}` : '';
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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


  const onEdit = (tripsItem) => {
    console.log('Editing trip item:', tripsItem); 
    setSchedule(tripsItem.schedule || []);
    setEditingTripsId(tripsItem._id);
    setIsEditing(true);   
  };
  const onDelete = async (tripsItem) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa lịch trình chuyến xe này không?");
    
    if (confirmDelete) {
      try {
        // Gọi API xóa lịch trình chuyến đi
        const response = await fetch(`${API_URL}/api/tripsRoutes/trip/${tripsItem._id}/schedule`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          await fetchTripsList();
          setAlert({ open: true, message: 'Xóa lịch trình chuyến xe thành công!', severity: 'success' });
        } else {
          const errorData = await response.json();
          setAlert({ open: true, message: errorData.message || 'Có lỗi xảy ra!', severity: 'error' });
        }
      } catch (error) {
        console.error('Error:', error);
        setAlert({ open: true, message: 'Có lỗi xảy ra!', severity: 'error' });
      }
    }
  };
  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel sx={{
          color: '#706966',
          fontSize: '16px',
          '&.Mui-focused': { color: '#ed6c02' },
        }}>Chọn chuyến đi</InputLabel>
        <Select
          color="warning"
          value={selectedTripId}
          onChange={(e) => setSelectedTripId(e.target.value)}
          label="Chọn chuyến đi"
        >
          {busTripsList.map((trip) => (
            <MenuItem key={trip._id} value={trip._id}>
              {trip.TripsName} - {getRouteInfo(trip.routeId)} - (
                {moment(trip.departureTime, "DD/MM/YYYY, HH:mm").tz("Asia/Ho_Chi_Minh").format("HH:mm")} - 
              {moment(trip.endTime, "DD/MM/YYYY, HH:mm").tz("Asia/Ho_Chi_Minh").format("HH:mm")}  
              )          
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {schedule.map((stop, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            label="Thời gian đến"
            variant="outlined"
            size="small"
            color="warning"
            type="time"
            sx={{ width: '150px' }}
            value={stop.time}
            onChange={(e) => handleChange(index, 'time', e.target.value)}
            InputProps={{
              sx: {
                fontSize: '13px',
                backgroundColor: '#fef3f0',
                '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 0 0 2px rgb(255, 224, 212)' },
              },
            }}
            InputLabelProps={{ shrink: true, sx: { fontSize: '13px' } }}
          />
          <TextField
            label="Tên địa điểm"
            variant="outlined"
            size="small"
            color="warning"
            sx={{ width: '250px' }}
            value={stop.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
            InputProps={{
              sx: {
                fontSize: '13px',
                backgroundColor: '#fef3f0',
                '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 0 0 2px rgb(255, 224, 212)' },
              },
            }}
            InputLabelProps={{ sx: { fontSize: '13px' } }}
          />
          <TextField
            label="Địa chỉ"
            variant="outlined"
            size="small"
            color="warning"
            sx={{ width: '500px' }}
            value={stop.address}
            onChange={(e) => handleChange(index, 'address', e.target.value)}
            InputProps={{
              sx: {
                fontSize: '13px',
                backgroundColor: '#fef3f0',
                '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 0 0 2px rgb(255, 224, 212)' },
              },
            }}
            InputLabelProps={{ sx: { fontSize: '13px' } }}
          />
          <Button variant="contained" color="error" onClick={() => removeStop(index)}>
            Xóa
          </Button>
        </Box>
      ))}

     <Box sx={{display:'flex', alignItems:'center',}}>
     <Button variant="contained" color="primary" onClick={addStop}
        sx={{marginTop:'10px'}}>
        Thêm điểm dừng
      </Button>
      <Button variant="contained" color="success" onClick={handleSubmit} sx={{ ml: 2,marginTop:'10px' }}>
        Lưu lịch trình
      </Button>
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
      <Typography sx={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Danh Sách lịch trình chuyến xe</Typography>
      <TableContainer component={Paper} sx={{ border: '1px solid #e5e5e5', marginTop: '10px', maxHeight: '400px', overflowY: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
        <TableCell sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>STT</TableCell> 
        <TableCell sx={{ minWidth: 5, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Tên chuyến</TableCell>
        <TableCell sx={{ minWidth: 50, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Tuyến xe</TableCell>
        <TableCell sx={{ minWidth: 10, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Thời gian khởi hành</TableCell>
        <TableCell sx={{ minWidth: 10, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Thời gian đến</TableCell>
        <TableCell sx={{ minWidth: 250 , textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Lịch trình</TableCell>
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
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{tripsItem.departureTime}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{tripsItem.endTime}</TableCell>
              <TableCell sx={{ fontSize: '13px',  }}>
                {tripsItem.schedule && tripsItem.schedule.length > 0 ? (
                    <Box>
                    {tripsItem.schedule.slice(0, isExpanded ? tripsItem.schedule.length : 1).map((scheduleItem, idx) => (
                        <TableRow key={idx}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                            {scheduleItem.time}
                            </Typography>
                            <Typography sx={{ fontSize: '13px', marginLeft: '20px' }}>
                            {scheduleItem.name}
                            </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '10px', color: '#768aa4' }}>
                            {scheduleItem.address}
                        </Typography>
                        <Divider />
                        </TableRow>
                    ))}
                    <Button
                        onClick={handleToggle}
                        sx={{ fontSize: '10px', color: '#888b8e',textTransform: 'none' , margin:0, padding:0}}
                    >
                        {isExpanded ? 'Thu gọn' : '. . . Xem thêm'}
                    </Button>
                    </Box>
                ) : (
                    <span>Chưa tạo lịch trình</span>
                )}
                </TableCell>
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

Schedule.propTypes = {
  userInfo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Schedule;
