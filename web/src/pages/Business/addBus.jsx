/* eslint-disable no-unused-vars */
import React, { useState,useEffect } from "react";
import { Box, TextField, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,IconButton  } from "@mui/material";
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

const AddBus = ({ userInfo, }) => {
  const [bus, setBus] = useState({
    busName: "",
    busType: "",
    cartSeat:"",
    licensePlate: "",
    Price:'',
    status :'',
  });
  //console.log("Bus",bus)
  const API_URL = import.meta.env.VITE_API_URL;
  //console.log("api", API_URL);
  const [busList, setBusList] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [editingBusId, setEditingBusId] = useState(null);
  const busTypes = [
    "Ghế(16G)",
    "Ghế(24G)",
    "Ghế(30G)",
    "Giường nằm cao cấp(40G)",
    "Khách sạc đi động(34G)",
    "Limousine(20G)",
    "Giường đôi (16G)"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBus((prevBus) => ({
      ...prevBus,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const busData = { ...bus, userId: userInfo._id };
  
    try {
      let response;
      if (editingBusId) {
        response = await fetch(`${API_URL}/api/buses/update/${editingBusId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(busData),
        });
      } else {
        response = await fetch(`${API_URL}/api/buses/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(busData),
        });
      }
  
      if (response.ok) {
        await fetchBusList(); 
        setBus({ busName: "", busType: "",cartSeat:"", licensePlate: "",Price:"" });
        setEditingBusId(null); 
        setAlert({ open: true, message: editingBusId ? 'Cập nhật xe buýt thành công!' : 'Thêm xe buýt thành công!', severity: 'success' });
      } else {
        const errorData = await response.json();
        setAlert({ open: true, message: errorData.error || 'Có lỗi xảy ra!', severity: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ open: true, message: 'Có lỗi xảy ra!', severity: 'error' });
    }
  };

  const fetchBusList = async () => {
    //console.log("User ID being fetched:", userInfo._id); 
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
  const onEdit = (busItem) => {
    setBus({
      busName: busItem.busName,
      busType: busItem.busType,
      cartSeat:busItem.cartSeat,
      licensePlate: busItem.licensePlate,
      Price:busItem.Price,
      
    });
    setEditingBusId(busItem._id);
  };
  
  
  const onDelete = async (busItem) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa xe này không?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_URL}/api/buses/delete/${busItem._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          await fetchBusList(); 
          setAlert({ open: true, message: 'Xóa xe buýt thành công!', severity: 'success' });
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
  useEffect(() => {
    if (userInfo && userInfo._id) { 
      fetchBusList();
    }
  }, [userInfo]); 

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box sx={{ width: "1200px",}}>
      <Box sx={{
          borderRadius: '10px',
          border: '1px solid #e5e5e5',
          padding: '10px', 
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}>
          <Typography sx={{textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', }}>Thêm Xe</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          margin:'10px',
          gap:2, 
          alignItems:'center',
          justifyContent:'center'
         
        }}
      >
        <TextField
          label="Tên xe"
          variant="outlined"
          name="busName"
          color="warning"
          value={bus.busName}
          onChange={handleChange}
          required
          size="small"
          InputProps={{
            sx: {
              fontSize: '13px',
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
          select
          label="Loại xe"
          variant="outlined"
          name="busType"
          value={bus.busType}
          onChange={handleChange}
          required
          size="small"
          color="warning"
          InputProps={{
            sx: {
              fontSize: '13px',
              backgroundColor: '#fef3f0', 
              width:'210px',
              height:'36px',
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
        >
          <MenuItem value="">
            <em style={{ fontSize: '14px'}}>Chọn loại xe</em>
          </MenuItem>
          {busTypes.map((type, index) => (
            <MenuItem key={index} value={type} sx={{ fontSize:'12px' }}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Số Chỗ"
          variant="outlined"
          name="cartSeat"
          value={bus.cartSeat}
          onChange={handleChange} 
          size="small"
          sx={{width:'100px', marginLeft:'20px'}}
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
            inputProps: {
              type: 'number', 
              min: 1, 
              max : 50,
            },
          }}
          InputLabelProps={{
            sx: {
              fontSize: '13px',
            },
          }}
        />
        <TextField
          label="Biển số xe"
          variant="outlined"
          placeholder="Ví dụ: 59A-xx.xxx"
          name="licensePlate"
          value={bus.licensePlate}
          onChange={handleChange} 
          size="small"
          sx={{width:'150px'}}
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
          label="Giá xe"
          variant="outlined"
          name="Price"
          value={bus.Price}
          onChange={handleChange} 
          size="small"
          sx={{width:'150px'}}
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
        <Button type="submit"  variant="contained" color="primary"sx={{
                 borderRadius:'50px', width:'70px',height:'40px',fontSize:'13px',backgroundColor: '#4CAF50',color: 'white', 
                      '&:hover': {backgroundColor: '#576757', },}}> 
                      <SaveAsOutlinedIcon sx={{ width:'25px'}}></SaveAsOutlinedIcon>
        </Button >
          <Stack sx={{ width: '300px',}}>
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
      <Box sx={{ borderRadius: '10px',
          border: '1px solid #e5e5e5',
          padding: '10px', 
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          marginTop:'20px'}}>
      <Typography sx={{textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)'}}>Danh Sách Xe</Typography>
      <TableContainer component={Paper} sx={{border: '1px solid #e5e5e5', marginTop:'10px', maxHeight: '400px', overflowY: 'auto' ,}}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 100, textAlign: 'center' ,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)'}}>Tên xe</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center',textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Loại xe</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center' ,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)'}}>Số chỗ</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center' ,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)'}}>Biển số xe</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center' ,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)'}}>Giá thêm</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center' ,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)'}}>Trạng thái</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center',textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Thao Tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{}}>
          {busList.map((busItem, index) => (
            <TableRow key={index}>
              <TableCell sx={{ textAlign: 'center',fontSize: '13px' }}>{busItem.busName}</TableCell>
              <TableCell sx={{ textAlign: 'center' , fontSize: '13px'}}>{busItem.busType}</TableCell>
              <TableCell sx={{ textAlign: 'center' , fontSize: '13px'}}>{busItem.cartSeat}</TableCell>
              <TableCell sx={{ textAlign: 'center' ,fontSize: '13px'}}>{busItem.licensePlate}</TableCell>
              <TableCell sx={{ textAlign: 'center' ,fontSize: '13px'}}>{busItem.Price}</TableCell>
              <TableCell sx={{ textAlign: 'center' ,fontSize: '13px'}}>{busItem.status}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>
              
              <IconButton 
              sx={{
                color: '#f4b807',
                textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', 
                borderRadius: '50px', 
                height: '30px', 
                '&:hover': { color: '#313731' } 
              }}
               onClick={() => onEdit(busItem)} 
            >
              <ReportProblemOutlinedIcon sx={{ width: '25px' }} />
            </IconButton>
            <IconButton 
              sx={{
                color: '#F44336',
                textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', 
                borderRadius: '50px', 
                height: '30px', 
                '&:hover': { color: '#313731' } 
              }}
              onClick={() => onDelete(busItem)} 
            >
              <DeleteForeverOutlinedIcon sx={{ width: '25px' }} />
            </IconButton>
             
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
      </Box>
    </Box>
  );
};
AddBus.propTypes = {
  userInfo: PropTypes.shape({ 
    _id: PropTypes.string.isRequired,
  }).isRequired, 
  setUserInfo: PropTypes.func.isRequired,
};

export default AddBus;
