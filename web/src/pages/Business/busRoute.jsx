/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box, TextField, TablePagination , Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,IconButton,Autocomplete  } from "@mui/material";
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import axios from "axios";


const RouteForm = ({ userInfo, }) => {
  const [route, setRoute] = useState({
    routeName: '',
    departure: '',
    destination: '',
    from:'',
    to:'',
    distance:'',
    totalFare: '',
  });
  console.log("route",route);
  const API_URL = import.meta.env.VITE_API_URL;
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromProvince, setFromProvince] = useState(null);
  const [toProvince, setToProvince] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [editingBusRouteId, setEditingBusRouteId] = useState(null);
  const [busRouteList, setBusRouteList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  useEffect(() => {
    const fetchProvincesAndDistricts = async () => {
        setLoading(true);

        // try {
        //     const provincesResponse = await axios.get("https://open.oapi.vn/location/provinces?size=63");
        //     if (provincesResponse.data && Array.isArray(provincesResponse.data.data)) {
        //         const provincesData = provincesResponse.data.data;
        //         const cleanedProvinces = provincesData.map((province) => ({
        //             ...province,
        //             name: province.name.replace(/^(Tỉnh|Thành phố) /, ""),
        //         }));

        //         const allDistricts = [];
        //         const pageSize = 100;
        //         let page = 1;

        //         while (true) {
        //             try {
        //                 const districtResponse = await axios.get(`https://open.oapi.vn/location/districts?page=${page}&size=${pageSize}`);
        //                 if (districtResponse.data.code === 'success') {
        //                     const districtsData = districtResponse.data.data.map((district) => {
        //                         const province = provincesData.find(prov => prov.id === district.provinceId);
        //                         return {
        //                             ...district,
        //                             provinceName: province ? province.name.replace(/^(Tỉnh|Thành phố) /, "") : '',
        //                             label: `${district.name.replace(/^(Huyện|Quận) /, "")} - ${province ? province.name.replace(/^(Tỉnh|Thành phố) /, "") : ''}`,
        //                         };
        //                     });

        //                     allDistricts.push(...districtsData);
        //                     if (districtsData.length < pageSize) break;
        //                     page++;
        //                 } else {
        //                     break;
        //                 }
        //             } catch (error) {
        //                 if (error.response && error.response.status === 429) {
        //                     await new Promise(resolve => setTimeout(resolve, 1000)); 
        //                 } else {
        //                     break; 
        //                 }
        //             }
        //         }

            //     setProvinces(cleanedProvinces);
            //     setDistricts(allDistricts);
            // }
            try {
              const response = await axios.get('https://provinces.open-api.vn/api/p/');
              const provinces = response.data;
              const cleanedProvinces = provinces.map((province) => ({
                        ...province,
                           name: province.name.replace(/^(Tỉnh|Thành phố) /, ""), 
                       }));
              console.log("Số lượng tỉnh/thành phố:", provinces.length); 
              console.log("Danh sách tỉnh/thành phố:", provinces);
              setProvinces(cleanedProvinces);
    
              setLoading(false);

            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    fetchProvincesAndDistricts();
  }, []);

  const handleSwap = () => {
    const temp = fromProvince;
    setFromProvince(toProvince);
    setToProvince(temp);
  };

  const groupOptions = (options) => {
    return options.reduce((acc, item) => {
      const category = item.provinceName ? "Quận/Huyện" : "Tỉnh/Thành phố";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  };
  const options = [
    ...provinces.map((province) => ({
      ...province,
      label: `${province.name}`,
    })),
    ...districts,
  ];
  const groupedOptions = groupOptions(options);

  useEffect(() => {
    setRoute((prevRoute) => ({
      ...prevRoute,
      departure: fromProvince ? fromProvince.label : '',
      destination: toProvince ? toProvince.label : '',
    }));
  }, [fromProvince, toProvince]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoute((prevRoute) => ({
      ...prevRoute,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const BusRoute = { ...route, userId: userInfo._id };
    try {
      let response;
      if (editingBusRouteId) {
        response = await fetch(`${API_URL}/api/busRoutes/update/${editingBusRouteId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(BusRoute),
        });
      } else {
        response = await fetch(`${API_URL}/api/busRoutes/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(BusRoute),
        });
      }
  
      if (response.ok) {
        await fetchBusList(); 
        setRoute({  routeName: '',departure: '',destination: '',distance:'',totalFare: '', from:'', to:''});
        setEditingBusRouteId(null); 
        setAlert({ open: true, message: editingBusRouteId ? 'Cập nhật tuyến xe thành công!' : 'Thêm tuyến xe thành công!', severity: 'success' });
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
  }, [userInfo]);
  const onDelete = async (busRouteItem) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tuyến xe này không?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_URL}/api/busRoutes/delete/${busRouteItem._id}`, {
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
  const onEdit = (busRouteItem) => {
    setRoute({
      routeName:busRouteItem.routeName,
      departure:busRouteItem.departure,
      destination:busRouteItem.destination,
      from:busRouteItem.from,
      to:busRouteItem.to,
      distance:busRouteItem.distance,
      totalFare:busRouteItem.totalFare,
      
    });
    setEditingBusRouteId(busRouteItem._id);
    setFromProvince({ label: busRouteItem.departure, value: busRouteItem.departure }); 
    setToProvince({ label: busRouteItem.destination, value: busRouteItem.destination });  
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
          <Typography sx={{textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)',  }}>Thêm Tuyến Xe</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection:'column',
          margin:'10px',
          gap:2, 
        }}
      >
        <Box  sx={{
          display: "flex",
          gap:3, 
          marginTop:'10px'
        }}>
        <TextField
        label="Tên Tuyến"
        size="small"
        variant="outlined"
        name="routeName"
        sx={{width:'250px'}}
        value={route.routeName}
        onChange={handleChange}
        required
        color="warning"
        InputProps={{
          sx: { fontSize: '13px', backgroundColor: '#fef3f0', '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 0 0 2px rgb(255, 224, 212)' } }
        }}
        InputLabelProps={{ sx: { fontSize: '13px' } }}
      />
      <TextField
        color="warning"
        label="Vị trí khởi hàng"
        variant="outlined"
        size="small"
        name="from"
        sx={{width:'200px'}}
        placeholder="BX.Miền Đông ..."
        value={route.from}
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
        label="Vị trí đến"
        variant="outlined"
        size="small"
        name="to"
        sx={{width:'200px'}}
        placeholder="BX.Cà Mau"
        value={route.to}
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
        label="Khoảng cách"
        variant="outlined"
        size="small"
        sx={{width:'150px'}}
        name="distance"
        placeholder="Ước tính khoảng cách"
        value={route.distance} 
        onChange={handleChange}
        type="number" 
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
        label="Tổng Giá Vé"
        variant="outlined"
        name="totalFare"
        type="number"
        size="small"
        sx={{ width:'200px'}}
        value={route.totalFare}
        onChange={handleChange}
        required
        color="warning"
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
        </Box>
      <Box sx={{  display: "flex" }}>
        <Autocomplete
         options={Object.values(groupedOptions).flatMap(group => group)}
          groupBy={(option) => option.provinceName ? "Quận/Huyện" : "Tỉnh/Thành phố"}
          getOptionLabel={(option) => option.label}
          value={fromProvince}
          onChange={(event, newValue) => setFromProvince(newValue)}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Điểm Đi"
              color="warning"
              fullWidth
              placeholder="Chọn Tỉnh thành"
              sx={{ width: "200px" }}
              InputProps={{
                ...params.InputProps,
                sx: { fontSize: "13px", backgroundColor: '#fef3f0',
                  '&.Mui-focused': {
                    backgroundColor: 'white', 
                    boxShadow: ' 0 0 0 2px rgb(255, 224, 212)'
                  },
                  } 
              }}
              InputLabelProps={{ sx: { fontSize: "13px" } }}
            />
          )}
        />

        <Button
          onClick={handleSwap}
          variant="outlined"
          sx={{ height: "30px", width: "20px", border: "none", borderRadius: "50%", padding: 0 }}
        >
          <SwapHorizOutlinedIcon sx={{ color: "rgb(240, 82, 34)" }} />
        </Button>

        <Autocomplete
          options={Object.values(groupedOptions).flatMap(group => group)}
          groupBy={(option) => option.provinceName ? "Quận/Huyện" : "Tỉnh/Thành phố"}
          getOptionLabel={(option) => option.label}
          value={toProvince}
          onChange={(event, newValue) => setToProvince(newValue)}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Điểm Đến"
              fullWidth
              color="warning"
              placeholder="Chọn Tỉnh thành"
              sx={{ width: "200px" }}
              InputProps={{
                ...params.InputProps,
                sx: { fontSize: "13px", backgroundColor: '#fef3f0',
                  '&.Mui-focused': {
                    backgroundColor: 'white', 
                    boxShadow: ' 0 0 0 2px rgb(255, 224, 212)'
                  },
                  } 
               
              }}
              InputLabelProps={{ sx: {fontSize: "13px" } }}
            />
          )}
        />
        
      </Box>
        <Box sx={{display:"flex",gap:2, alignContent:'center', marginLeft:'20px'}}>
        <Button type="submit"  variant="contained" color="primary"sx={{
                 borderRadius:'50px', width:'70px',height:'40px',fontSize:'13px',backgroundColor: '#4CAF50',color: 'white', 
                      '&:hover': {backgroundColor: '#576757', },}}> 
                      <SaveAsOutlinedIcon sx={{ width:'25px'}}></SaveAsOutlinedIcon>
        </Button >
          <Stack sx={{ width: '400px',}}>
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
            <TableCell sx={{ minWidth: 150, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Tên tuyến xe</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Điểm đến</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Điểm đi</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Vị trí khởi hàng</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Vị trí kết thúc</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Khoảng cách(Km)</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Giá vé (VND)</TableCell>
            <TableCell sx={{ minWidth: 100, textAlign: 'center', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Thao Tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {busRouteList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((busRouteItem, index) => (
            <TableRow key={index}>
               <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{page * rowsPerPage + index + 1}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{busRouteItem.routeName}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{busRouteItem.departure}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{busRouteItem.destination}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{busRouteItem.from}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{busRouteItem.to}</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{busRouteItem.distance} km</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>{busRouteItem.totalFare} VND</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: '13px' }}>
                <IconButton 
                  sx={{
                    color: '#f4b807',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                    borderRadius: '50px',
                    height: '30px',
                    '&:hover': { color: '#313731' }
                  }}
                  onClick={() => onEdit(busRouteItem)}
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
                  onClick={() => onDelete(busRouteItem)}
                >
                  <DeleteForeverOutlinedIcon sx={{ width: '25px' }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={7} sx={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', position: 'sticky', bottom: 0, backgroundColor: 'white' }}>
              Tổng số tuyến xe: {busRouteList.length}
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
RouteForm.propTypes = {
  userInfo: PropTypes.shape({ 
    _id: PropTypes.string.isRequired,
  }).isRequired, 
  setUserInfo: PropTypes.func.isRequired,
};
export default RouteForm;
