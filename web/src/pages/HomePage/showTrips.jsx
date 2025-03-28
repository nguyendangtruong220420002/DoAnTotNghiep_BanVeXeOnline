/* eslint-disable no-unused-vars */
import React, { useEffect, useState,useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
  AppBar, Toolbar, Menu, MenuItem,InputLabel,Select,FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Link
} from "@mui/material";
import WhereToVoteTwoToneIcon from "@mui/icons-material/WhereToVoteTwoTone";
import DirectionsBusTwoToneIcon from "@mui/icons-material/DirectionsBusTwoTone";
import TrendingFlatTwoToneIcon from "@mui/icons-material/TrendingFlatTwoTone";
import PropTypes from "prop-types";
import axios from "axios";
import moment from "moment-timezone";
import PinDropRoundedIcon from "@mui/icons-material/PinDropRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RadioButtonCheckedTwoToneIcon from "@mui/icons-material/RadioButtonCheckedTwoTone";
import SeatSelection from "../AboutPage/SeatSelection";
import { useLocation } from "react-router-dom";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import SearchTrips from '../HomePage/SearchTrips';
import logo from '../../../public/images/logohome (2).png';
import ticket from '../../../public/images/ticket.png';
import shed from '../../../public/images/bus(3).png';
import sale from '../../../public/images/sale.png';
import user from '../../../public/images/user.png';
import helpdesk from '../../../public/images/setting.png';
import '../HomePage/css/HomePage.css';
import {TabContext,TabList, TabPanel} from '@mui/lab';
import Login from '../AboutPage/Login';
import Information from '../../../src/pages/AboutPage/Information';
import ConfirmInfo from '../../pages/AboutPage/ConfirmInfo';
import loguot from '../../../public/images/log-out.png'
import history from '../../../public/images/history.png'
import information from '../../../public/images/information.png'
import profile from '../../../public/images/profile.png'
import Nosearchrch from '../../../public/images/Nosearchrch.png'
import { useNavigate } from 'react-router-dom';
import RoundTrip from '../AboutPage/RoundTrip';
import Ticket from '../AboutPage/Ticket'
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import FmdGoodTwoToneIcon from '@mui/icons-material/FmdGoodTwoTone';
import LocalPhoneTwoToneIcon from '@mui/icons-material/LocalPhoneTwoTone';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import Sale from '../../pages/AboutPage/Sale'; 
import loginer from '../../../public/images/4860253.jpg'
import iuh from '../../../public/images/iuh.png'

const ShowTrips = (socket) => {
  const navigate = useNavigate();

  const prevDataRef = useRef();
  const [value, setValue] = useState("1");
  const [openLogin, setOpenLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [tabIndex1, setTabIndex1] = useState(0); 
  const { dataOfShowTrips ,SeatCode:SeatCodeTrips,totalAmountAll:totalAmountAllTrips ,tabIndex1:initialTabIndex1 } = location.state || {}  
  const [selectedBox, setSelectedBox] = useState(null);
  const [tripType, setTripType] = useState(dataOfShowTrips ? dataOfShowTrips.tripType : '');
  const [openTabs, setOpenTabs] = useState({});
  const [tabSeatch, settabSeatch] = useState(0);
   const [departureDate, setdepartureDate] = useState(dataOfShowTrips.departureDate);
  const [trips, setTrips] = useState({
    RouteTrips: [],
    TripsOne: [],
  });
  //console.log(" bên tìm chuyến gửi dataOfShowTrips:", dataOfShowTrips);
  useEffect(() => {
    if (initialTabIndex1 !== undefined) {
      setTabIndex1(initialTabIndex1);
    }
  }, [initialTabIndex1]);
  useEffect(() => {
    if (location.state?.tabIndex1 !== undefined) {
      setTabIndex1(location.state.tabIndex1);
      // 2 chiều
    }
  }, [location.state]);
  // console.log("tabIndex1",tabIndex1);
  useEffect(() => {
    // console.log('Reset trạng thái khi vào ShowTrips');
   // một chiều
  }, [location.state]);
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    console.log(localStorage.getItem('userInfo'));
    setUserInfo(null);
    setValue("1");
    handleCloseMenu();
    navigate('/');
    window.location.reload();
  };
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const openMenu = Boolean(anchorEl);
  const handleInfoClick = () => {
    setValue("5");
    handleCloseMenu();
  };
  const handleHistoryClick = () => {
    setValue("5");
    handleCloseMenu();
  };
  const handleSubmitInfo = (userInfo) => {
    console.log('Submitted Info:', userInfo);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === '1') {
      window.location.reload();
    }
  };
  const handleCloseLogin = () => {
    setOpenLogin(false);
  };
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
 
  
  const formatDate = (date) => {
    if (!date) return "Không xác định";
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString("vi-VN", options);
  };
  const departureDateLabel = formatDate(dataOfShowTrips.departureDate);
  const returnDateLabel = formatDate(dataOfShowTrips.returnDate);
  useEffect(() => {
    if (dataOfShowTrips) {
      const params = {
        departure: dataOfShowTrips.departure || '',
        destination: dataOfShowTrips.destination || '',
        departureDate: dataOfShowTrips.departureDate || '',
        returnDate: tripType === "Khứ hồi" ? dataOfShowTrips.returnDate : '',
        tripType:dataOfShowTrips.tripType || '',  
        userId: userInfo ? userInfo._id : undefined,
      };
      if (dataOfShowTrips.tripType === 'Một chiều') {
        delete params.returnDate; 
      }
     // console.log("Request Params:", params); 
      fetchTrips(params);  
      setTimeout(() => setLoading(false), 8000);
    }
  }, [dataOfShowTrips, tripType, userInfo]); 

  const fetchTrips = async (params) => {
    try {
      // setTrips([]);
      setTrips({ RouteTrips: [], TripsOne: [] })
      setLoading(true);  
      const response = await axios.get(`${API_URL}/api/tripsRoutes/search`, { params });
      setTrips({
        RouteTrips: response.data.RouteTrips || [],
        TripsOne: response.data.TripsOne || []  ,
      });
      // console.log("Trips from API:", response.data);  
    } catch (error) {
      if (error.response) {
        console.error("Lỗi tìm chuyến:", error.response.data);
        console.error("Status code:", error.response.status);
      } else if (error.request) {
        console.error("Không nhận được phản hồi:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    } finally {
      setLoading(false); 
    }
  };

  const handleBoxClick = (tripId) => {
    const selected = trips.find((trip) => trip._id === tripId);
    setSelectedBox((prevSelectedBox) => {
      if (!prevSelectedBox || prevSelectedBox._id !== tripId) {
        return selected;
      }
      return prevSelectedBox;
    });
  };
  const handleToggleTab = (tripId, tab) => {
    setOpenTabs((prevState) => ({
      ...prevState,
      [tripId]: prevState[tripId] === tab ? null : tab,
    }));
  };
  const handleSearchHome = () => {
    navigate('/showTrips',{ state: { dataOfShowTrips, userInfo } });
    window.location.reload(); 
  };
  const [sortConfig, setSortConfig] = useState({
    key: null,
    ascending: true,
  });
  const handleSort = (key) => {
    const isAscending = sortConfig.key === key ? !sortConfig.ascending : true;
    setSortConfig({
      key,
      ascending: isAscending,
    });
    const sortedRouteTrips = [...trips.RouteTrips].sort((a, b) => {
      if (a[key] < b[key]) return isAscending ? -1 : 1;
      if (a[key] > b[key]) return isAscending ? 1 : -1;
      return 0;
    });
    const sortedTripsOne = [...trips.TripsOne].sort((a, b) => {
      if (a[key] < b[key]) return isAscending ? -1 : 1;
      if (a[key] > b[key]) return isAscending ? 1 : -1;
      return 0;
    });
    setTrips({
      RouteTrips: sortedRouteTrips,
      TripsOne: sortedTripsOne,
    });
  };
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(""); 
  const handleTimeFilterChange = (event) => {
    setSelectedTimeFilter(event.target.value);
  };

  const filterTripsByTime = (trip) => {
    if (!selectedTimeFilter) return true;

    const hour = moment(trip.departureTime, "DD/MM/YYYY, HH:mm")
      .tz("Asia/Ho_Chi_Minh")
      .hour();

    if (selectedTimeFilter === "morning") {
      return hour >= 0 && hour < 6; 
    }
    else if (selectedTimeFilter === "lateMorning") {
      return hour >= 6 && hour < 12; 
    } else if (selectedTimeFilter === "afternoon") {
      return hour >= 12 && hour < 18;
    } else if (selectedTimeFilter === "evening") {
      return hour >= 18 && hour < 24; 
    }
    return true; 
  };
  const [selectedBusType, setSelectedBusType] = useState('');
  const filterTripsByBusType = (trip) => {
    return selectedBusType === '' || trip.busId.busType === selectedBusType;
  };
  const clearFilters = () => {
    setSelectedTimeFilter('');
    setSelectedBusType('');
  };
  const isFutureTrip = (departureTime) => {
    const DateDefault = new Date(); 
    const tripTime = new Date(departureTime); 
    const currentDate = `${DateDefault.getDate()}-${DateDefault.getMonth() + 1}-${DateDefault.getFullYear()}`;
    const tripDateFormatted = `${departureDate.getDate()}-${departureDate.getMonth() + 1}-${departureDate.getFullYear()}`;
    if (currentDate === tripDateFormatted) {
        const currentHour = DateDefault.getHours();
        const currentMinute = DateDefault.getMinutes();
        const tripHour = tripTime.getHours();
        const tripMinute = tripTime.getMinutes();
        if (tripHour > currentHour || (tripHour === currentHour && tripMinute > currentMinute)) {
            return true; 
        }
        return false; 
    }    
    return true;
};
  
  return (
    <Box>
       <Box sx={{ position: 'relative' }}>
      <AppBar  sx={{ backgroundColor: '#e7e7e7',
          position: 'unset',  }} >
      <Toolbar sx={{height:'70px',boxShadow: '2px 2px 6px rgba(47, 46, 46, 0.5)', zIndex:1 }} >
        <Box sx={{ flexGrow: 1, display: 'flex',justifyContent:'space-between' }} className='menu1'>
          <Box>
          <Typography >
              <Box component="img" src={logo} alt="" sx={{width:'300px', height:'70px', marginTop:'3px'}} ></Box>
              </Typography>
          
          </Box>
          <Box>
          <TabContext value={value} >
          <TabList onChange={handleChange} centered className='menu2'>
        
          <Button
          className='button'
          onClick={() => {
            handleSearchHome()
          }}
          sx={{
            width: '320px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center', 
            textTransform: 'none', 
          }}
        >
          <Box component="img" src={shed} sx={{ width: '30px', height: '30px', marginLeft: '10px' }} />
          <Box sx={{ marginTop: '5px' }}>Trang Chủ</Box>  
        </Button>
        {/* <Tab  label={<Box  sx={{ position: 'relative', marginTop: '5px',  }}>Trang Chủ</Box>}  value="1" className='button'  iconPosition="start"  sx={{width:'320px', display:'flex', justifyContent:'left'}}
            icon={<Box component='img'  src={shed} sx={{ width:'30px', height:'30px',  }}></Box> }>  
            </Tab> */}
            
            <Tab label={<Box sx={{ position: 'relative', marginTop: '5px' }}>Mã Giảm Giá</Box>}  value="2" className='button2'  iconPosition="start"  
            icon={<Box component='img'  src={sale} sx={{ width:'23px', height:'23px', }}></Box>}>  
           
            </Tab>
                    <Tab label={<Box sx={{ position: 'relative', marginTop: '5px' }}>Vé Của Tôi</Box>} value="3" className='button2' iconPosition="start"
                      icon={<Box component='img' src={ticket} sx={{ width: '23px', height: '23px', }}></Box>}>
                    </Tab>
                    <Tab label={<Box sx={{ position: 'relative', marginTop: '5px' }}>Về Chúng Tôi</Box>} value="4" className='button2' iconPosition="start"
                      icon={<Box component='img' src={helpdesk} sx={{ width: '23px', height: '23px', }}></Box>}>
                    </Tab>
                    {userInfo ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '200px' }}>

                        <Box
                          component="img"
                          src={userInfo.img||profile}
                          sx={{ width: 30, height: 30 ,borderRadius:'50%'}}
                        /> 
                     <Button onClick={handleClickMenu}>
                       <Typography className="button5" sx={{ position: 'relative', marginTop: '3px',}}>{userInfo ? userInfo.fullName : 'Chưa có thông tin'}</Typography>
                     </Button>
                    
                     <Menu
                       anchorEl={anchorEl}
                       open={openMenu}
                       onClose={handleCloseMenu}
                       disableScrollLock={true}
                       id="account-menu"
                       slotProps={{
                        paper: {
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&::before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                     >
                      <MenuItem onClick={handleInfoClick} >
                      <Box
                          component="img"
                          src={information}
                          sx={{ width: '32px', height: '32px' }} 
                        /> 
                          <Typography className='button4' sx={{marginLeft:'8px'}}> Thông tin cá nhân</Typography>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleHistoryClick}  >
                      <Box
                          component="img"
                          src={history}
                          sx={{ width: '30px', height: '30px' }} 
                        /> 
                            <Typography className='button2' sx={{marginLeft:'11px'}}> Lịnh sử mua vé</Typography>
                      </MenuItem>
                       <MenuItem onClick={handleLogout}>
                       <Box
                          component="img"
                          src={loguot}
                          sx={{ width: '30px', height: '30px' }} 
                        /> 
                        <Typography className='button2' sx={{marginLeft:'11px'}}> Đăng xuất </Typography>
                      </MenuItem>
                      
                     </Menu>
                   </Box>
                  ) : (
                    <Button
                    
                      onClick={() => setOpenLogin(true)}
                      sx={{ display: 'flex', alignItems: 'center', width: '200px' }}
                    >
                      <Box component="img" src={user} sx={{ width: '20px', height: '20px' }} />
                      <Typography className="button3" sx={{ position: 'relative', marginTop: '3px' }}>
                        Đăng Nhập/Đăng Ký
                      </Typography>
                    </Button>
                  )}
          </TabList>
        </TabContext>
          </Box>
        </Box>
      </Toolbar>
      </AppBar>
      <Box sx={{ position: 'relative', height: 'auto' }}> 
        <Box>
          <TabContext value={value}>
            <TabPanel value="1" sx={{
               padding:0,
               margin:0,
               boxSizing:'border-box',
            }}>
              <Box><SearchTrips userInfo={userInfo}></SearchTrips></Box>
               {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          height="100vh">
          <AirportShuttleIcon style={{ fontSize: 50, marginBottom: 20 }} />
          <LinearProgress style={{ width: "80%" }} />        
        </Box>
      ) : trips.length === 0 ?(
        <Box sx={{
          width: "100%",
          height: "auto",
          display: "flex",
          flexDirection:'column',
          margin: "auto",
          justifyContent: "center",
          alignItems: "center",        
          borderRadius: "8px",
          marginTop: "20px",
        }}> <Typography className="button38-6">Không tìm thấy chuyến xe này </Typography>
        <Box component='img'  src={Nosearchrch} sx={{width:'35%', height:'35%',  objectFit: 'contain', objectPosition: 'center',}}></Box>
        </Box>
           ) : (
        <Box>        
          <Box
            sx={{
              width: "1200px",
              height: "70px",
              display: "flex",
              alignItems: "center",
              margin: "auto",
              border: "1px solid #ececec",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
            }}>
            <Box
              sx={{
                width: "60%",
                display: "flex",
                alignItems: "center",
                margin: "auto",
                justifyContent: "space-around",
                marginLeft: "20px",
              }}>
              <Typography className="button13">Sắp xếp theo:</Typography>
              <Typography className="button14"  onClick={() => handleSort("totalFareAndPrice")}>
              Giá {sortConfig.key === "totalFareAndPrice" && (sortConfig.ascending ? "↑" : "↓")}</Typography>
              <Typography className="button14"  onClick={() => handleSort("rating")}>
              Xếp hạng {sortConfig.key === "rating" && (sortConfig.ascending ? "↑" : "↓")}</Typography>
              <Typography className="button14"    onClick={() => handleSort("departureTime")}>
              Thời gian khởi hành {sortConfig.key === "departureTime" && (sortConfig.ascending ? "↑" : "↓")}
              </Typography>
              <Typography className="button14" onClick={() => handleSort("endTime")}>
              Thời gian kết thúc {sortConfig.key === "endTime" && (sortConfig.ascending ? "↑" : "↓")}</Typography>             
            </Box>
            <Box
              sx={{
                width: "40%",
                display: "flex",
                alignItems: "center",
                margin: "auto",
              }}>
              <Typography sx={{ fontSize: "20px", color: "#808080" }}>
                |
              </Typography>
              <DirectionsBusTwoToneIcon
                sx={{ color: "#2b2b2b", fontSize: "25px" }}
              ></DirectionsBusTwoToneIcon>
              <Box>
                <Typography className="button16">
                  {dataOfShowTrips.departure}{" "}
                  <TrendingFlatTwoToneIcon></TrendingFlatTwoToneIcon>{" "}
                  {dataOfShowTrips.destination}
                </Typography>
                <Typography className="button15">
                  Hiện thị {trips.length} tuyến xe trên tuyến đường này
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{ width: "1200px", height: "auto", display: "flex", margin: "auto", marginTop: "15px", }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box
                sx={{ width: "320px", height: "530px", border: "1px solid #ececec", backgroundColor: "#ffffff", borderRadius: "8px", marginLeft: "23px", }}>           
                <Box sx={{display:'flex', justifyContent:'space-between'}} >
                <Typography className="button52" sx={{marginLeft:'18px', marginTop:'20px', marginBottom:'10px'}}> Bộ Lọc</Typography>
                <Button onClick={clearFilters}><DeleteSweepRoundedIcon sx={{width:'50px', height:'30px', color:'#e60c0f'}}></DeleteSweepRoundedIcon></Button>
                </Box>
                <Divider sx={{width:'90%', margin: "auto",marginBottom:'10px'}}></Divider>
                <Box sx={{ border: "0.1px solid #fffefe",backgroundColor: "#f4f4f4",borderRadius: "8px",width:'90%',isplay: "flex", margin: "auto", flexDirection:'column', }}>
                <Typography className="button52" sx={{marginLeft:'20px', marginTop:'20px'}}> Thời Gian Khởi Hàng</Typography>
                  <FormControl component="fieldset">
                  <RadioGroup
                    value={selectedTimeFilter}
                    onChange={handleTimeFilterChange}>
                  <FormControlLabel value="morning" control={<Radio sx={{'&.Mui-checked': {color: '#dc635b'},fontSize: '14px',transform: 'scale(0.8)',marginLeft:'35px'}} />} label="Sáng (00:00 - 06:00)" sx={{ '& .MuiFormControlLabel-label': { fontSize: '14.5px', display: 'inline' } }} />
                  <FormControlLabel value="lateMorning" control={<Radio sx={{'&.Mui-checked': {color: '#dc635b'},fontSize: '14px',transform: 'scale(0.8)',marginLeft:'35px'}} />} label="Sáng (06:00 - 12:00)" sx={{ '& .MuiFormControlLabel-label': { fontSize: '14.5px', display: 'inline' } }} />
                  <FormControlLabel value="afternoon" control={<Radio sx={{'&.Mui-checked': {color: '#dc635b'},fontSize: '14px',transform: 'scale(0.8)',marginLeft:'35px'}} />} label="Chiều (12:00 - 18:00)" sx={{ '& .MuiFormControlLabel-label': { fontSize: '14.5x', display: 'inline' } }} />
                  <FormControlLabel value="evening" control={<Radio sx={{'&.Mui-checked': {color: '#dc635b'},fontSize: '14px',transform: 'scale(0.8)',marginLeft:'35px'}} />} label="Tối (18:00 - 00:00)" sx={{ '& .MuiFormControlLabel-label': { fontSize: '14.5px', display: 'inline' } }} />
                  </RadioGroup>
                </FormControl>
                </Box>
                  <br></br>
                <Box sx={{ border: "0.1px solid #fffefe",backgroundColor: "#f4f4f4",borderRadius: "8px",width:'90%',isplay: "flex", margin: "auto", flexDirection:'column', }}>
                <Typography className="button52" sx={{marginLeft:'20px', marginTop:'20px'}}> Loại xe</Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                     value={selectedBusType}
                    onChange={(e) => setSelectedBusType(e.target.value)}>            
              <FormControlLabel 
                value="Giường nằm cao cấp(40G)" control={<Radio sx={{'&.Mui-checked': {color: '#dc635b', fontSize: '15px'}, fontSize: '14px', transform: 'scale(0.8)', marginLeft: '35px'}} />} label="Giường nằm cao cấp(40G)" 
                sx={{'& .MuiFormControlLabel-label': { fontSize: '14.5px', display: 'inline' }}}
              />
              <FormControlLabel 
                value="Khách sạc đi động(34G)" 
                control={<Radio sx={{'&.Mui-checked': {color: '#dc635b', fontSize: '15px'}, fontSize: '14px', transform: 'scale(0.8)', marginLeft: '35px'}} />} 
                label="Khách sạc đi động(34G)" 
                sx={{'& .MuiFormControlLabel-label': { fontSize: '14.5px', display: 'inline' }}}
              />
              <FormControlLabel 
                value="Limousine(20G)" 
                control={<Radio sx={{'&.Mui-checked': {color: '#dc635b', fontSize: '15px'}, fontSize: '14px', transform: 'scale(0.8)', marginLeft: '35px'}} />} 
                label="Limousine(20G)" 
                sx={{'& .MuiFormControlLabel-label': { fontSize: '14.5px', display: 'inline' }}}
              />
              <FormControlLabel 
                value="Giường đôi (16G)" 
                control={<Radio sx={{'&.Mui-checked': {color: '#dc635b', fontSize: '15px'}, fontSize: '14px', transform: 'scale(0.8)', marginLeft: '35px'}} />} 
                label="Giường đôi (16G)" 
                sx={{'& .MuiFormControlLabel-label': { fontSize: '14.5px', display: 'inline' }, marginBottom:'10px'}}
              />
              </RadioGroup>
              </FormControl>
                </Box>
                <br></br>
              </Box>
            </Box>

            <Box
              sx={{ width: "100%", maxHeight: "1000px", overflowY: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
              {dataOfShowTrips.tripType === "Khứ hồi" ? (
                <Box>
                  <Tabs value={tabIndex1} 
                  centered
                  sx={{ width: "788px", borderBottom: 4,marginBottom:'15px',borderRadius: '10px', border: '2px solid #e5e7eb', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' ,marginLeft:'20px',}}
                  onChange={(e, newValue) => setTabIndex1(newValue)}
                  >
                      <Tab className="button30-1" label={`Chuyến đi (${departureDateLabel})`} style={{ textAlign: 'center' }} />
                      <Tab  className="button30-1" label={`Chuyến về (${returnDateLabel})`} style={{ textAlign: 'center' }} />
                  </Tabs>
                  {tabIndex1 === 0 && ( 
                    // chuyến đi
                    <Box>
                    {trips.TripsOne
                      .filter((trip) => filterTripsByTime(trip))
                      .filter((trip) => filterTripsByBusType(trip, selectedBusType))
                      .filter((trip) => isFutureTrip(trip.departureTime))
                    .map((trip) => {
                        const BusName = trip.userId.fullName
                        return (
                      <Box
                        key={trip._id}
                        onClick={() => handleBoxClick(trip._id)}
                        sx={{
                          width: "780px",
                          backgroundColor: "#ffffff",
                          marginLeft: "25px",
                          marginTop: "20px",
                          height: "auto",
                          borderRadius: "10px",
                          boxShadow:
                            selectedBox?._id === trip._id
                              ? "0 4px 4px rgba(239, 82, 34, .3), 0 -3px 8px rgba(239, 82, 34, .3), inset 0 0 0 1px rgb(240, 82, 34)"
                              : "0 3px 6px rgba(0, 0, 0, .16), 0 3px 6px rgba(0, 0, 0, .2)",
                          transition: "all 0.3s ease",
                        }}>
                        <Box sx={{ display: "flex" }}>
                          <Box sx={{ margin: "20px", width: "250px" }}>
                            <Typography className="button17">
                              {trip.userId.fullName}
                            </Typography>
                            <Typography className="button19">
                              {trip.busId.busType}                          
                            </Typography>
                            <Box sx={{ display: "flex", marginLeft: "10px" }}>
                              <AddCircleRoundedIcon
                                sx={{color: "#202020",fontSize: "16px",marginTop: "3px",marginLeft: "4px",}}>
                              </AddCircleRoundedIcon>
                              <Typography
                                className="button22"
                                sx={{ marginLeft: "20px" }}>chỗ trống
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", marginTop: "20px" }}>
                            <Box>
                              {trip.departureTime && (
                                <Typography className="button18">
                                  
                                  {moment(trip.departureTime, "DD/MM/YYYY, HH:mm")
                                    .tz("Asia/Ho_Chi_Minh",)
                                    .format("HH:mm")}
                                </Typography>
                              )}
                              <Typography
                                className="button21"
                                sx={{ width: "auto" }}>
                                {trip.routeId.from}
                              </Typography>
                            </Box>
                            <MyLocationRoundedIcon
                              sx={{
                                color: "#00613d",
                                fontSize: "21px",
                                marginTop: "10px",
                                marginLeft: "4px",
                              }}
                            />
                            {trip.departureTime && trip.endTime && (
                              <Box
                                sx={{ display: "flex", marginTop: "12px" }}
                                className="button19">
                                --------------------
                                <Typography className="button20">
                                  {(() => {
                                    const departure = moment(
                                      trip.departureTime,
                                      "DD/MM/YYYY, HH:mm"
                                    );
                                    const end = moment(
                                      trip.endTime,
                                      "DD/MM/YYYY, HH:mm"
                                    );
                                    if (departure.isValid() && end.isValid()) {
                                      const duration = moment.duration(
                                        end.diff(departure)
                                      );
                                      const hours = duration.hours();
                                      const minutes = duration.minutes();
                                      return ` ${hours}h${minutes}'`;
                                    }
                                  })()}
                                </Typography>
                                --------------------
                              </Box>
                            )}
                            <PinDropRoundedIcon
                              sx={{
                                color: "#f2754e",
                                fontSize: "25px",
                                marginTop: "10px",
                                marginRight: "4px",
                              }}
                            />
                            <Box>
                              {trip.endTime && (
                                <Typography className="button23">
                                  {moment(trip.endTime, "DD/MM/YYYY, HH:mm")
                                    .tz("Asia/Ho_Chi_Minh")
                                    .format("HH:mm")}
                                </Typography>
                              )}
                              <Typography
                                className="button21"
                                sx={{ width: "auto" }}
                              >
                                {trip.routeId.to}{" "}
                              </Typography>
                              <Typography
                                sx={{ marginTop: "15px ", marginLeft: "5px" }}
                                className="button24"
                              >
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(trip.totalFareAndPrice)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ marginLeft: "20px", marginRight: "20px" }}>
                          <Divider></Divider>
                          <Box sx={{ display: "flex" }}>
                            <Box sx={{ width: "100%", display: "flex" }}>
                              <Box sx={{ width: "100%" }}>
                                <Box>
                                  <Button
                                    onClick={() => handleToggleTab(trip._id, "1")}
                                    sx={{textTransform: "none",fontSize: "15px",width: "100px",textAlign: "center",
                                      color:
                                        openTabs[trip._id] === "1"
                                          ? "#dc635b"
                                          : "#0c0c0c",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                    }}>Chọn ghế
                                  </Button>
                                  <Button
                                    onClick={() => handleToggleTab(trip._id, "2")}
                                    sx={{
                                      textTransform: "none",fontSize: "15px",width: "100px",textAlign: "center",
                                      color:
                                        openTabs[trip._id] === "2"
                                          ? "#dc635b"
                                          : "#0a0a0a",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                    }}>
                                    {" "}
                                    Lịch trình
                                  </Button>
                                  <Button
                                    onClick={() => handleToggleTab(trip._id, "3")}
                                    sx={{
                                      textTransform: "none",
                                      fontSize: "15px",
                                      width: "100px",
                                      textAlign: "center",
                                      color:
                                        openTabs[trip._id] === "3"
                                          ? "#dc635b"
                                          : "#070707",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                    }}>
                                    Chính sách
                                  </Button>
                                  <Button
                                    onClick={() => handleToggleTab(trip._id, "4")}
                                    sx={{
                                      textTransform: "none",
                                      fontSize: "15px",
                                      width: "130px",
                                      textAlign: "center",
                                      color:
                                        openTabs[trip._id] === "4"
                                          ? "#dc635b"
                                          : "#000000",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                    }}>
                                    Trung chuyển
                                  </Button>
                                  <Button
                                    sx={{
                                      backgroundColor:
                                        selectedBox?._id === trip._id
                                          ? "rgb(220,99,91)"
                                          : "rgb(180, 155, 153)",
                                      color:
                                        selectedBox?._id === trip._id
                                          ? "white"
                                          : "rgb(106, 44, 44)",
                                      borderRadius: "50px",
                                      width: "125px",
                                      height: "35px",
                                      textTransform: "none",
                                      textAlign: "center",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.1)",
                                      fontSize: "13.5px",
                                      marginTop: "5px",
                                      marginLeft: "170px",
                                    }}
                                    onClick={() => handleToggleTab(trip._id, "1")}
                                  >
                                    Chọn chuyến
                                  </Button>
                                </Box>
                                {openTabs[trip._id] === "1" && (
                                  <Box>                                   
                                    <SeatSelection
                                      tripId={trip._id}
                                      userInfo={userInfo}
                                      totalAmount={trip.totalFareAndPrice}
                                      departureDate={departureDateLabel}
                                      departureTime={trip.departureTime}
                                      endTime={trip.endTime}
                                      from={trip.routeId.from}
                                      to={trip.routeId.to}
                                      schedule={trip.schedule}
                                      departure={trip.routeId.departure}
                                      destination={trip.routeId.destination}
                                      business={trip.userId.fullName}
                                      dataOfShowTrips={dataOfShowTrips}
                                      BusName={BusName}
                                      socket={socket}

                                      //lien quan voi khu hoi
                                      SeatCodeTrips={SeatCodeTrips}
                                      totalAmountAllTrips={totalAmountAllTrips}
                                    ></SeatSelection>
                                  </Box>
                                )}
                                {openTabs[trip._id] === "2" && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      marginLeft: "30px",
                                      marginTop: "10px",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <Box>
                                      <Box
                                        sx={{display: "flex",alignItems: "center",}}>
                                         
                                        <Typography className="button28">
                                          {moment(
                                            trip.departureTime,
                                            "DD/MM/YYYY, HH:mm"
                                          )
                                            .tz("Asia/Ho_Chi_Minh")
                                            .format("HH:mm")}{" "}
                                        </Typography>
                                        <RadioButtonCheckedTwoToneIcon
                                          sx={{
                                            marginLeft: "30px",
                                            width: "20px",
                                            color: "#00613d",
                                          }}
                                        ></RadioButtonCheckedTwoToneIcon>
                                        <Typography
                                          className="button26"
                                          sx={{
                                            marginLeft: "30px",
                                            width: "200px",
                                          }}
                                        >
                                          {trip.routeId.from}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          height: "25px",
                                          width: "1.5px",
                                          marginLeft: "76px",
                                          borderLeft: "1px dotted #b0aeae",
                                        }}
                                      ></Box>
                                      {trip.schedule.map((stop, index) => (
                                        <Box
                                          key={stop._id}
                                          sx={{
                                            display: "flex",
                                          
                                          }}
                                        >
                                          <Typography className="button28" sx={{marginTop:'2px'}} >
                                            {stop.time}{" "}
                                          </Typography>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "column",
                                            }}
                                          >
                                            <Box>
                                              <RadioButtonCheckedTwoToneIcon
                                                sx={{
                                                  marginLeft: "30px",
                                                  width: "20px",
                                                  color: "#7e7f7f",
                                                }}
                                              ></RadioButtonCheckedTwoToneIcon>
                                            </Box>
                                            <Box
                                              sx={{
                                                height: "25px",
                                                width: "1.5px",
                                                marginLeft: "40px",
                                                borderLeft: "1px dotted #b0aeae",
                                              }}
                                            ></Box>
                                          </Box>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "column",
                                              marginLeft: "30px",
                                            }}
                                          >
                                            <Typography className="button26">
                                              {stop.name}
                                            </Typography>
                                            <Typography className="button27">
                                              {stop.address}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      ))}
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Typography className="button28">
                                          {moment(
                                            trip.endTime,
                                            "DD/MM/YYYY, HH:mm"
                                          )
                                            .tz("Asia/Ho_Chi_Minh")
                                            .format("HH:mm")}{" "}
                                        </Typography>
                                        <WhereToVoteTwoToneIcon
                                          sx={{
                                            marginLeft: "30px",
                                            color: "#f2754e",
                                            width: "20px",
                                          }}
                                        ></WhereToVoteTwoToneIcon>
                                        <Typography
                                          className="button26"
                                          sx={{
                                            marginLeft: "30px",
                                            width: "200px",
                                          }}
                                        >
                                          {trip.routeId.to}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                )}
                                {openTabs[trip._id] === "3" && (
                                  <Box>
  
                                    <Typography>
                                    <h4>Chính sách huỷ vé</h4>
                                    <Typography style={{marginLeft:'20px', textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', fontSize:'16px', lineHeight:'21px', color:'#1D1C1D'}}>
                                    - Chỉ được chuyển đổi vé 1 lần duy nhất<br></br>
                                    - Chi phí hủy vé từ 10% – 30% giá vé tùy thuộc thời gian hủy vé so với 
                                    - giờ khởi hành ghi trên vé và số lượng vé cá nhân/tập thể áp dụng theo các quy định hiện hành.<br></br>
                                    - Quý khách khi có nhu cầu muốn thay đổi hoặc hủy vé đã thanh toán, 
                                      cần liên hệ với Trung tâm tổng đài 0326923816 hoặc quầy vé chậm nhất trước 24h so với giờ xe khởi hành được ghi trên vé, trên email hoặc tin nhắn để được hướng dẫn thêm.
                              </Typography>
                                    </Typography>
                                  </Box>
                                )}
                                {openTabs[trip._id] === "4" && (
                                  <Box>
                                  <Typography>
                                   <h4> &nbsp;&nbsp;&nbsp;Đón/ trả tận nơi:</h4> 
                                   <Typography style={{marginLeft:'20px', textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', fontSize:'16px', lineHeight:'21px', color:'#1D1C1D'}}>  
                                    - Thời gian nhận khách : <i>Trước 4 tiếng.</i>  <br></br>
                                  - Thời gian xe đón : <i>Chuẩn bị trước 2 -3 tiếng, do mật độ giao thông trong thành phố và sẽ kết hợp đón nhiều điểm khác nhau nên thời gian đón cụ thể tài xế sẽ liên hệ hẹn giờ.</i><br></br>
                                  - Hẻm nhỏ xe không quay đầu được : <i>Xe trung chuyển sẽ đón Khách đầu hẻm/ đầu đường.</i><br></br>
                                  - Khu vực có biển cấm dừng đỗ xe không đón được : <i>Xe trung chuyển sẽ đón tại vị trí gần nhất có thể.</i><br></br>
                                  - Hành lý :<i> Hành lý nhỏ gọn dưới 20 kg, không vận chuyển kèm động vật , thú cưng, không mang đồ có mùi, đồ chảy nước trên xe.</i></Typography>
                                  
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Box>
                          <Box sx={{ height: "10px" }}></Box>
                        </Box>
                      </Box>
                        );
                      })}
                  </Box> 
                   //hết chuyến đi
                  )}
                  
                   {tabIndex1 === 1 && (
                    //chuyến về
                    <Box>
                        {trips.RouteTrips && trips.RouteTrips.length > 0 ? (
                    trips.RouteTrips.filter(filterTripsByTime)
                    .filter((trip) => filterTripsByBusType(trip, selectedBusType))
                    .map((trip) => {
                       const BusName2 = trip.userId.fullName
                       return (
                      <Box
                        key={trip._id}
                        onClick={() => handleBoxClick(trip._id)}
                        sx={{
                          width: "780px",
                          backgroundColor: "#ffffff",
                          marginLeft: "25px",
                          marginTop: "20px",
                          height: "auto",
                          borderRadius: "10px",
                          boxShadow:
                            selectedBox?._id === trip._id
                              ? "0 4px 4px rgba(239, 82, 34, .3), 0 -3px 8px rgba(239, 82, 34, .3), inset 0 0 0 1px rgb(240, 82, 34)"
                              : "0 3px 6px rgba(0, 0, 0, .16), 0 3px 6px rgba(0, 0, 0, .2)",
                          transition: "all 0.3s ease",
                        }}>
                        <Box sx={{ display: "flex" }}>
                          <Box sx={{ margin: "20px", width: "250px" }}>
                            <Typography className="button17">
                              {trip.userId.fullName}
                            </Typography>
                            <Typography className="button19">
                              {trip.busId.busType}
                            
                            </Typography>
                            <Box sx={{ display: "flex", marginLeft: "10px" }}>
                              <AddCircleRoundedIcon
                                sx={{color: "#202020",fontSize: "16px",marginTop: "3px",marginLeft: "4px",}}>
                              </AddCircleRoundedIcon>
                              <Typography
                                className="button22"
                                sx={{ marginLeft: "20px" }}>chỗ trống
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", marginTop: "20px" }}>
                            <Box>
                              {trip.departureTime && (
                                <Typography className="button18">
                                  
                                  {moment(trip.departureTime, "DD/MM/YYYY, HH:mm")
                                    .tz("Asia/Ho_Chi_Minh",)
                                    .format("HH:mm")}
                                </Typography>
                              )}
                              <Typography
                                className="button21"
                                sx={{ width: "auto" }}>
                                {trip.routeId.from}
                              </Typography>
                            </Box>
                            <MyLocationRoundedIcon
                              sx={{
                                color: "#00613d",
                                fontSize: "21px",
                                marginTop: "10px",
                                marginLeft: "4px",
                              }}
                            />
                            {trip.departureTime && trip.endTime && (
                              <Box
                                sx={{ display: "flex", marginTop: "12px" }}
                                className="button19">
                                --------------------
                                <Typography className="button20">
                                  {(() => {
                                    const departure = moment(
                                      trip.departureTime,
                                      "DD/MM/YYYY, HH:mm"
                                    );
                                    const end = moment(
                                      trip.endTime,
                                      "DD/MM/YYYY, HH:mm"
                                    );
                                    if (departure.isValid() && end.isValid()) {
                                      const duration = moment.duration(
                                        end.diff(departure)
                                      );
                                      const hours = duration.hours();
                                      const minutes = duration.minutes();
                                      return ` ${hours}h${minutes}'`;
                                    }
                                  })()}
                                </Typography>
                                --------------------
                              </Box>
                            )}
                            <PinDropRoundedIcon
                              sx={{
                                color: "#f2754e",
                                fontSize: "25px",
                                marginTop: "10px",
                                marginRight: "4px",
                              }}
                            />
                            <Box>
                              {trip.endTime && (
                                <Typography className="button23">
                                  {moment(trip.endTime, "DD/MM/YYYY, HH:mm")
                                    .tz("Asia/Ho_Chi_Minh")
                                    .format("HH:mm")}
                                </Typography>
                              )}
                              <Typography
                                className="button21"
                                sx={{ width: "auto" }}
                              >
                                {trip.routeId.to}{" "}
                              </Typography>
                              <Typography
                                sx={{ marginTop: "15px ", marginLeft: "5px" }}
                                className="button24"
                              >
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(trip.totalFareAndPrice)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ marginLeft: "20px", marginRight: "20px" }}>
                          <Divider></Divider>
                          <Box sx={{ display: "flex" }}>
                            <Box sx={{ width: "100%", display: "flex" }}>
                              <Box sx={{ width: "100%" }}>
                                <Box>
                                  <Button
                                    onClick={() => handleToggleTab(trip._id, "1")}
                                    sx={{textTransform: "none",fontSize: "15px",width: "100px",textAlign: "center",
                                      color:
                                        openTabs[trip._id] === "1"
                                          ? "#dc635b"
                                          : "#0c0c0c",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                    }}>Chọn ghế
                                  </Button>
                                  <Button
                                    onClick={() => handleToggleTab(trip._id, "2")}
                                    sx={{
                                      textTransform: "none",fontSize: "15px",width: "100px",textAlign: "center",
                                      color:
                                        openTabs[trip._id] === "2"
                                          ? "#dc635b"
                                          : "#0a0a0a",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                    }}>
                                    {" "}
                                    Lịch trình
                                  </Button>
                                  <Button
                                    onClick={() => handleToggleTab(trip._id, "3")}
                                    sx={{
                                      textTransform: "none",
                                      fontSize: "15px",
                                      width: "100px",
                                      textAlign: "center",
                                      color:
                                        openTabs[trip._id] === "3"
                                          ? "#dc635b"
                                          : "#070707",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                    }}>
                                    Chính sách
                                  </Button>
                                  <Button
                                    onClick={() => handleToggleTab(trip._id, "4")}
                                    sx={{
                                      textTransform: "none",
                                      fontSize: "15px",
                                      width: "130px",
                                      textAlign: "center",
                                      color:
                                        openTabs[trip._id] === "4"
                                          ? "#dc635b"
                                          : "#000000",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                    }}>
                                    Trung chuyển
                                  </Button>
                                  <Button
                                    sx={{
                                      backgroundColor:
                                        selectedBox?._id === trip._id
                                          ? "rgb(220,99,91)"
                                          : "rgb(180, 155, 153)",
                                      color:
                                        selectedBox?._id === trip._id
                                          ? "white"
                                          : "rgb(106, 44, 44)",
                                      borderRadius: "50px",
                                      width: "125px",
                                      height: "35px",
                                      textTransform: "none",
                                      textAlign: "center",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.1)",
                                      fontSize: "13.5px",
                                      marginTop: "5px",
                                      marginLeft: "170px",
                                    }}
                                    onClick={() => handleToggleTab(trip._id, "1")}
                                  >
                                    Chọn chuyến
                                  </Button>
                                </Box>
  
                                {openTabs[trip._id] === "1" && (
                                  <Box>
                                    <RoundTrip
                                      tripId={trip._id}
                                      userInfo={userInfo}
                                      totalAmount={trip.totalFareAndPrice}
                                      departureDate={departureDateLabel}
                                      departureTime={trip.departureTime}
                                      endTime={trip.endTime}
                                      from={trip.routeId.from}
                                      to={trip.routeId.to}
                                      schedule={trip.schedule}
                                      departure={trip.routeId.departure}
                                      destination={trip.routeId.destination}
                                      business={trip.userId.fullName}
                                      dataOfShowTrips={dataOfShowTrips}
                                      returnDateLab={returnDateLabel}
                                      BusName2={BusName2}
                                      socket={socket}
                                      //khu hoi 
                                    ></RoundTrip>
                                  </Box>
                                )}
                                {openTabs[trip._id] === "2" && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      marginLeft: "30px",
                                      marginTop: "10px",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <Box>
                                      <Box
                                        sx={{display: "flex",alignItems: "center",}}>
                                         
                                        <Typography className="button28">
                                          {moment(
                                            trip.departureTime,
                                            "DD/MM/YYYY, HH:mm"
                                          )
                                            .tz("Asia/Ho_Chi_Minh")
                                            .format("HH:mm")}{" "}
                                        </Typography>
                                        <RadioButtonCheckedTwoToneIcon
                                          sx={{
                                            marginLeft: "30px",
                                            width: "20px",
                                            color: "#00613d",
                                          }}
                                        ></RadioButtonCheckedTwoToneIcon>
                                        <Typography
                                          className="button26"
                                          sx={{
                                            marginLeft: "30px",
                                            width: "200px",
                                          }}
                                        >
                                          {trip.routeId.from}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          height: "25px",
                                          width: "1.5px",
                                          marginLeft: "76px",
                                          borderLeft: "1px dotted #b0aeae",
                                        }}
                                      ></Box>
                                      {trip.schedule.map((stop, index) => (
                                        <Box
                                          key={stop._id}
                                          sx={{
                                            display: "flex",
                                          
                                          }}
                                        >
                                          <Typography className="button28" sx={{marginTop:'2px'}} >
                                            {stop.time}{" "}
                                          </Typography>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "column",
                                            }}
                                          >
                                            <Box>
                                              <RadioButtonCheckedTwoToneIcon
                                                sx={{
                                                  marginLeft: "30px",
                                                  width: "20px",
                                                  color: "#7e7f7f",
                                                }}
                                              ></RadioButtonCheckedTwoToneIcon>
                                            </Box>
                                            <Box
                                              sx={{
                                                height: "25px",
                                                width: "1.5px",
                                                marginLeft: "40px",
                                                borderLeft: "1px dotted #b0aeae",
                                              }}
                                            ></Box>
                                          </Box>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "column",
                                              marginLeft: "30px",
                                            }}
                                          >
                                            <Typography className="button26">
                                              {stop.name}
                                            </Typography>
                                            <Typography className="button27">
                                              {stop.address}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      ))}
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Typography className="button28">
                                          {moment(
                                            trip.endTime,
                                            "DD/MM/YYYY, HH:mm"
                                          )
                                            .tz("Asia/Ho_Chi_Minh")
                                            .format("HH:mm")}{" "}
                                        </Typography>
                                        <WhereToVoteTwoToneIcon
                                          sx={{
                                            marginLeft: "30px",
                                            color: "#f2754e",
                                            width: "20px",
                                          }}
                                        ></WhereToVoteTwoToneIcon>
                                        <Typography
                                          className="button26"
                                          sx={{
                                            marginLeft: "30px",
                                            width: "200px",
                                          }}
                                        >
                                          {trip.routeId.to}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                )}
                                {openTabs[trip._id] === "3" && (
                                  <Box>
  
                                    <Typography>
                                    <h4>Chính sách huỷ vé</h4>
                                    <Typography style={{marginLeft:'20px', textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', fontSize:'16px', lineHeight:'21px', color:'#1D1C1D'}}>
                                    - Chỉ được chuyển đổi vé 1 lần duy nhất<br></br>
                                    - Chi phí hủy vé từ 10% – 30% giá vé tùy thuộc thời gian hủy vé so với 
                                    - giờ khởi hành ghi trên vé và số lượng vé cá nhân/tập thể áp dụng theo các quy định hiện hành.<br></br>
                                    - Quý khách khi có nhu cầu muốn thay đổi hoặc hủy vé đã thanh toán, 
                                      cần liên hệ với Trung tâm tổng đài 0326923816 hoặc quầy vé chậm nhất trước 24h so với giờ xe khởi hành được ghi trên vé, trên email hoặc tin nhắn để được hướng dẫn thêm.
                              </Typography>
                                    </Typography>
                                  </Box>
                                )}
                                {openTabs[trip._id] === "4" && (
                                  <Box>
                                  <Typography>
                                   <h4> &nbsp;&nbsp;&nbsp;Đón/ trả tận nơi:</h4> 
                                   <Typography style={{marginLeft:'20px', textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', fontSize:'16px', lineHeight:'21px', color:'#1D1C1D'}}>  
                                    - Thời gian nhận khách : <i>Trước 4 tiếng.</i>  <br></br>
                                  - Thời gian xe đón : <i>Chuẩn bị trước 2 -3 tiếng, do mật độ giao thông trong thành phố và sẽ kết hợp đón nhiều điểm khác nhau nên thời gian đón cụ thể tài xế sẽ liên hệ hẹn giờ.</i><br></br>
                                  - Hẻm nhỏ xe không quay đầu được : <i>Xe trung chuyển sẽ đón Khách đầu hẻm/ đầu đường.</i><br></br>
                                  - Khu vực có biển cấm dừng đỗ xe không đón được : <i>Xe trung chuyển sẽ đón tại vị trí gần nhất có thể.</i><br></br>
                                  - Hành lý :<i> Hành lý nhỏ gọn dưới 20 kg, không vận chuyển kèm động vật , thú cưng, không mang đồ có mùi, đồ chảy nước trên xe.</i></Typography>
                                  
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Box>
                          <Box sx={{ height: "10px" }}></Box>
                        </Box>
                      </Box>
                      );
                    })
                  ) : (
                    <Typography sx={{display:'flex', flexDirection:'column', margin:'auto', alignContent:'center', alignItems:'center'}}>
                      <Typography className="button38-6">Không tìm thấy chuyến xe về . . .</Typography>
                      <Box component='img'  src={Nosearchrch} sx={{width:'35%', height:'35%',  objectFit: 'contain', objectPosition: 'center',marginTop:'15px'}}></Box>
                    </Typography>
                      )}
                  </Box> 
                   // hết khứ hồi
                  )}
                </Box>
              ) : (
                <Box>
                  {trips.TripsOne && trips.TripsOne.length > 0 ? (
                  trips.TripsOne.filter(filterTripsByTime)
                  .filter((trip) => filterTripsByBusType(trip, selectedBusType))
                  .filter((trip) => isFutureTrip(trip.departureTime))
                  .map((trip) => {
                      const BusName = trip.userId.fullName
                      
                    return (
                    <Box
                      key={trip._id}
                      onClick={() => handleBoxClick(trip._id)}
                      sx={{
                        width: "780px",
                        backgroundColor: "#ffffff",
                        marginLeft: "25px",
                        marginTop: "20px",
                        height: "auto",
                        borderRadius: "10px",
                        boxShadow:
                          selectedBox?._id === trip._id
                            ? "0 4px 4px rgba(239, 82, 34, .3), 0 -3px 8px rgba(239, 82, 34, .3), inset 0 0 0 1px rgb(240, 82, 34)"
                            : "0 3px 6px rgba(0, 0, 0, .16), 0 3px 6px rgba(0, 0, 0, .2)",
                        transition: "all 0.3s ease",
                      }}>
                      <Box sx={{ display: "flex" }}>
                        <Box sx={{ margin: "20px", width: "250px" }}>
                          <Typography className="button17">
                            {trip.userId.fullName}
                          </Typography>
                          <Typography className="button19">
                            {trip.busId.busType}
                          
                          </Typography>
                          <Box sx={{ display: "flex", marginLeft: "10px" }}>
                            <AddCircleRoundedIcon
                              sx={{color: "#202020",fontSize: "16px",marginTop: "3px",marginLeft: "4px",}}>
                            </AddCircleRoundedIcon>
                            <Typography
                              className="button22"
                              sx={{ marginLeft: "20px" }}>chỗ trống
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", marginTop: "20px" }}>
                          <Box>
                            {trip.departureTime && (
                              <Typography className="button18">
                                
                                {moment(trip.departureTime, "DD/MM/YYYY, HH:mm")
                                  .tz("Asia/Ho_Chi_Minh",)
                                  .format("HH:mm")}
                              </Typography>
                            )}
                            
                            <Typography
                              className="button21"
                              sx={{ width: "auto" }}>
                              {trip.routeId.from}
                            </Typography>
                          </Box>
                          <MyLocationRoundedIcon
                            sx={{
                              color: "#00613d",
                              fontSize: "21px",
                              marginTop: "10px",
                              marginLeft: "4px",
                            }}
                          />
                          {trip.departureTime && trip.endTime && (
                            <Box
                              sx={{ display: "flex", marginTop: "12px" }}
                              className="button19">
                              --------------------
                              <Typography className="button20">
                                {(() => {
                                  const departure = moment(
                                    trip.departureTime,
                                    "DD/MM/YYYY, HH:mm"
                                  );
                                  const end = moment(
                                    trip.endTime,
                                    "DD/MM/YYYY, HH:mm"
                                  );
                                  if (departure.isValid() && end.isValid()) {
                                    const duration = moment.duration(
                                      end.diff(departure)
                                    );
                                    const hours = duration.hours();
                                    const minutes = duration.minutes();
                                    return ` ${hours}h${minutes}'`;
                                  }
                                })()}
                              </Typography>
                              --------------------
                            </Box>
                          )}
                          <PinDropRoundedIcon
                            sx={{
                              color: "#f2754e",
                              fontSize: "25px",
                              marginTop: "10px",
                              marginRight: "4px",
                            }}
                          />
                          <Box>
                            {trip.endTime && (
                              <Typography className="button23">
                                {moment(trip.endTime, "DD/MM/YYYY, HH:mm")
                                  .tz("Asia/Ho_Chi_Minh")
                                  .format("HH:mm")}
                              </Typography>
                            )}
                            <Typography
                              className="button21"
                              sx={{ width: "auto" }}
                            >
                              {trip.routeId.to}{" "}
                            </Typography>
                            <Typography
                              sx={{ marginTop: "15px ", marginLeft: "5px" }}
                              className="button24"
                            >
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(trip.totalFareAndPrice)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ marginLeft: "20px", marginRight: "20px" }}>
                        <Divider></Divider>
                        <Box sx={{ display: "flex" }}>
                          <Box sx={{ width: "100%", display: "flex" }}>
                            <Box sx={{ width: "100%" }}>
                              <Box>
                                <Button
                                  onClick={() => handleToggleTab(trip._id, "1")}
                                  sx={{textTransform: "none",fontSize: "15px",width: "100px",textAlign: "center",
                                    color:
                                      openTabs[trip._id] === "1"
                                        ? "#dc635b"
                                        : "#0c0c0c",
                                    textShadow:
                                      "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                  }}>Chọn ghế
                                </Button>
                                <Button
                                  onClick={() => handleToggleTab(trip._id, "2")}
                                  sx={{
                                    textTransform: "none",fontSize: "15px",width: "100px",textAlign: "center",
                                    color:
                                      openTabs[trip._id] === "2"
                                        ? "#dc635b"
                                        : "#0a0a0a",
                                    textShadow:
                                      "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                  }}>
                                  {" "}
                                  Lịch trình
                                </Button>
                                <Button
                                  onClick={() => handleToggleTab(trip._id, "3")}
                                  sx={{
                                    textTransform: "none",
                                    fontSize: "15px",
                                    width: "100px",
                                    textAlign: "center",
                                    color:
                                      openTabs[trip._id] === "3"
                                        ? "#dc635b"
                                        : "#070707",
                                    textShadow:
                                      "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                  }}>
                                  Chính sách
                                </Button>
                                <Button
                                  onClick={() => handleToggleTab(trip._id, "4")}
                                  sx={{
                                    textTransform: "none",
                                    fontSize: "15px",
                                    width: "130px",
                                    textAlign: "center",
                                    color:
                                      openTabs[trip._id] === "4"
                                        ? "#dc635b"
                                        : "#000000",
                                    textShadow:
                                      "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                  }}>
                                  Trung chuyển
                                </Button>
                                <Button
                                  sx={{
                                    backgroundColor:
                                      selectedBox?._id === trip._id
                                        ? "rgb(220,99,91)"
                                        : "rgb(180, 155, 153)",
                                    color:
                                      selectedBox?._id === trip._id
                                        ? "white"
                                        : "rgb(106, 44, 44)",
                                    borderRadius: "50px",
                                    width: "125px",
                                    height: "35px",
                                    textTransform: "none",
                                    textAlign: "center",
                                    textShadow:
                                      "1px 1px 2px rgba(0, 0, 0, 0.1)",
                                    fontSize: "13.5px",
                                    marginTop: "5px",
                                    marginLeft: "170px",
                                  }}
                                  onClick={() => handleToggleTab(trip._id, "1")}
                                >
                                  Chọn chuyến
                                </Button>
                              </Box>

                              {openTabs[trip._id] === "1" && (
                                <Box>
                                  
                                  <SeatSelection
                                    tripId={trip._id}
                                    userInfo={userInfo}
                                    totalAmount={trip.totalFareAndPrice}
                                    departureDate={departureDateLabel}
                                    departureTime={trip.departureTime}
                                    endTime={trip.endTime}
                                    from={trip.routeId.from}
                                    to={trip.routeId.to}
                                    schedule={trip.schedule}
                                    departure={trip.routeId.departure}
                                    destination={trip.routeId.destination}
                                    business={trip.userId.fullName}
                                    dataOfShowTrips={dataOfShowTrips}
                                    SeatCodeTrips={SeatCodeTrips}
                                    totalAmountAllTrips={totalAmountAllTrips}
                                    BusName={BusName}
                                    socket={socket}
                                  ></SeatSelection>
                                </Box>
                              )}
                              {openTabs[trip._id] === "2" && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    marginLeft: "30px",
                                    marginTop: "10px",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box>
                                    <Box
                                      sx={{display: "flex",alignItems: "center",}}>
                                       
                                      <Typography className="button28">
                                        {moment(
                                          trip.departureTime,
                                          "DD/MM/YYYY, HH:mm"
                                        )
                                          .tz("Asia/Ho_Chi_Minh")
                                          .format("HH:mm")}{" "}
                                      </Typography>
                                      <RadioButtonCheckedTwoToneIcon
                                        sx={{
                                          marginLeft: "30px",
                                          width: "20px",
                                          color: "#00613d",
                                        }}
                                      ></RadioButtonCheckedTwoToneIcon>
                                      <Typography
                                        className="button26"
                                        sx={{
                                          marginLeft: "30px",
                                          width: "200px",
                                        }}
                                      >
                                        {trip.routeId.from}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        height: "25px",
                                        width: "1.5px",
                                        marginLeft: "76px",
                                        borderLeft: "1px dotted #b0aeae",
                                      }}
                                    ></Box>
                                    {trip.schedule.map((stop, index) => (
                                      <Box
                                        key={stop._id}
                                        sx={{
                                          display: "flex",
                                        
                                        }}
                                      >
                                        <Typography className="button28" sx={{marginTop:'2px'}} >
                                          {stop.time}{" "}
                                        </Typography>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <Box>
                                            <RadioButtonCheckedTwoToneIcon
                                              sx={{
                                                marginLeft: "30px",
                                                width: "20px",
                                                color: "#7e7f7f",
                                              }}
                                            ></RadioButtonCheckedTwoToneIcon>
                                          </Box>
                                          <Box
                                            sx={{
                                              height: "25px",
                                              width: "1.5px",
                                              marginLeft: "40px",
                                              borderLeft: "1px dotted #b0aeae",
                                            }}
                                          ></Box>
                                        </Box>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            marginLeft: "30px",
                                          }}
                                        >
                                          <Typography className="button26">
                                            {stop.name}
                                          </Typography>
                                          <Typography className="button27">
                                            {stop.address}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    ))}
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography className="button28">
                                        {moment(
                                          trip.endTime,
                                          "DD/MM/YYYY, HH:mm"
                                        )
                                          .tz("Asia/Ho_Chi_Minh")
                                          .format("HH:mm")}{" "}
                                      </Typography>
                                      <WhereToVoteTwoToneIcon
                                        sx={{
                                          marginLeft: "30px",
                                          color: "#f2754e",
                                          width: "20px",
                                        }}
                                      ></WhereToVoteTwoToneIcon>
                                      <Typography
                                        className="button26"
                                        sx={{
                                          marginLeft: "30px",
                                          width: "200px",
                                        }}
                                      >
                                        {trip.routeId.to}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              )}
                              {openTabs[trip._id] === "3" && (
                                <Box>

                                  <Typography>
                                  <h4>Chính sách huỷ vé</h4>
                                  <Typography style={{marginLeft:'20px', textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', fontSize:'16px', lineHeight:'21px', color:'#1D1C1D'}}>
                                  - Chỉ được chuyển đổi vé 1 lần duy nhất<br></br>
                                  - Chi phí hủy vé từ 10% – 30% giá vé tùy thuộc thời gian hủy vé so với 
                                  - giờ khởi hành ghi trên vé và số lượng vé cá nhân/tập thể áp dụng theo các quy định hiện hành.<br></br>
                                  - Quý khách khi có nhu cầu muốn thay đổi hoặc hủy vé đã thanh toán, 
                                    cần liên hệ với Trung tâm tổng đài 0326923816 hoặc quầy vé chậm nhất trước 24h so với giờ xe khởi hành được ghi trên vé, trên email hoặc tin nhắn để được hướng dẫn thêm.
                            </Typography>
                                  </Typography>
                                </Box>
                              )}
                              {openTabs[trip._id] === "4" && (
                                <Box>
                                <Typography>
                                 <h4> &nbsp;&nbsp;&nbsp;Đón/ trả tận nơi:</h4> 
                                 <Typography style={{marginLeft:'20px', textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', fontSize:'16px', lineHeight:'21px', color:'#1D1C1D'}}>  
                                  - Thời gian nhận khách : <i>Trước 4 tiếng.</i>  <br></br>
                                - Thời gian xe đón : <i>Chuẩn bị trước 2 -3 tiếng, do mật độ giao thông trong thành phố và sẽ kết hợp đón nhiều điểm khác nhau nên thời gian đón cụ thể tài xế sẽ liên hệ hẹn giờ.</i><br></br>
                                - Hẻm nhỏ xe không quay đầu được : <i>Xe trung chuyển sẽ đón Khách đầu hẻm/ đầu đường.</i><br></br>
                                - Khu vực có biển cấm dừng đỗ xe không đón được : <i>Xe trung chuyển sẽ đón tại vị trí gần nhất có thể.</i><br></br>
                                - Hành lý :<i> Hành lý nhỏ gọn dưới 20 kg, không vận chuyển kèm động vật , thú cưng, không mang đồ có mùi, đồ chảy nước trên xe.</i></Typography>
                                
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ height: "10px" }}></Box>
                      </Box>
                    </Box>
                    );
                  })
                ) : (
                  <Typography sx={{display:'flex', flexDirection:'column', margin:'auto', alignContent:'center', alignItems:'center'}}>
                  <Typography className="button38-6">Không tìm thấy chuyến xe đi . . . </Typography>
                  <Box component='img'  src={Nosearchrch} sx={{width:'35%', height:'35%',  objectFit: 'contain', objectPosition: 'center',marginTop:'15px'}}></Box>
                </Typography>
                )} 
              </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
            </TabPanel>
            <TabPanel value="2">
            <Sale></Sale>
            </TabPanel>
            <TabPanel value="3">
            {userInfo ? (
                <Ticket userInfo={userInfo} onLogout={handleLogout} setUserInfo={setUserInfo} />
              ) : (
                <Box>
                    <Button               
                onClick={() => setOpenLogin(true)}
                sx={{ display: 'flex', alignItems: 'center', width: '200px' ,margin:'auto', backgroundColor:'#dc635b',  }}
              >
                <Typography  sx={{ position: 'relative', marginTop: '3px',color:'white'  }}>
                  Đăng Nhập
                </Typography>
              </Button> 
              <Box component="img" src={loginer} sx={{ width: '500px', height: '400px', ml:60}} />
                </Box>
              )}
            </TabPanel>
            <TabPanel 
            value="4"
            >
              <Box sx={{ borderRadius: "10px",
            border: "1px solid #e5e5e5",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            margin:'auto',
            width: "50%",
            }}>
               <Box component="img" src={iuh} sx={{ width: '700px', height: '400px', position: 'absolute',zIndex: 1, opacity: 0.15,}}>
                 
               </Box>
              <Box sx={{ padding: 3, position: 'relative',zIndex: 2}}>
      <Typography variant="h6" gutterBottom sx={{  textAlign: 'center',fontWeight: 'bold', textTransform:"uppercase",mb:2 }}>Đồ Án Tốt Nghiệp Năm 2024</Typography>
      <Box sx={{ marginBottom: 1.5 , display:'flex', ml:2}}>
      <Typography variant="body1" sx={{ fontWeight: 400,color:'#676966', fontSize:'16px', mr:1,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.1)' }}>Tên đề tài:</Typography>
      <Typography variant="body1" sx={{ fontWeight: 400,color:'#000000', fontSize:'17px',textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)' }}>VeXeOnline</Typography>
      </Box>

      <Box sx={{ marginBottom: 1.5, display:'flex',ml:2 }}>
      <Typography variant="body1" sx={{ fontWeight: 400,color:'#676966', fontSize:'16px', mr:1,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.1)' }}>Thông tin nhóm :</Typography>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#000000', fontSize:'17px',textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)' }}>91 khóa K16-DHKTPM16TT Khoa-CNTT</Typography>
      </Box>

      <Box sx={{ marginBottom: 1.5, display:'flex' ,ml:2}}>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#676966', fontSize:'16px', mr:1,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.1)' }}>Tên sinh viên:</Typography>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#000000', fontSize:'17px',textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Nguyễn Đang Trường (20062481) - Phạm Sỹ Thái (20049721)</Typography>
      </Box>

      <Box sx={{ marginBottom: 1.5 ,display:'flex' ,ml:2}}>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#676966', fontSize:'16px', mr:1,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.1)' }}>Giảng viên phụ trách:</Typography>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#000000', fontSize:'17px',textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)' }}>TS. Đặng Văn Thuận</Typography>
      </Box>

      <Box sx={{ marginBottom: 1.5, display:'flex' ,ml:2}}>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#676966', fontSize:'16px', mr:1,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.1)' }}>Trường:</Typography>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#000000', fontSize:'17px',textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Đại học Công Nghiệp Tp.Hồ Chí Minh</Typography>
      </Box>

      <Box sx={{ marginBottom: 1.5, display:'flex',ml:2}}>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#676966', fontSize:'16px', mr:1,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.1)' }}>Địa chỉ:</Typography>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#000000', fontSize:'17px',textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)' }}>12 Nguyễn Văn Bảo, F4, Q.Gò Vấp, Tp.Hồ Chí Minh</Typography>
      </Box>

      <Box sx={{ marginBottom: 1.5, display:'flex' ,ml:2}}>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#676966', fontSize:'16px', mr:1,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.1)' }}>Website:</Typography>
        <Link href="https://doantotnghiep-banvexeonline.onrender.com" target="_blank" sx={{ color: '#1976d2', textDecoration: 'none' ,mt:0.4 }}>
          https://doantotnghiep-banvexeonline.onrender.com
        </Link>
      </Box>

      <Box sx={{ marginBottom: 1.5, display:'flex' ,ml:2}}>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#676966', fontSize:'16px', mr:1,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.1)' }}>Số điện thoại:</Typography>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#000000', fontSize:'17px',textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)' }}>0326923816 - 0911513279</Typography>
      </Box>

      <Box sx={{ marginBottom: 1.5, display:'flex',ml:2 }}>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#676966', fontSize:'16px', mr:1,textShadow:'1px 1px 2px rgba(0, 0, 0, 0.1)' }} >Email:</Typography>
        <Typography variant="body1" sx={{ fontWeight: 400,color:'#000000', fontSize:'17px',textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)' }}>nguyendangtruong22042002@gmail.com - phamsythai644@gmail.com</Typography>
      </Box>
              </Box>
            </Box>

            </TabPanel>
            <TabPanel value="5"> 
              <Information  onLogout={handleLogout} userInfo={userInfo} setUserInfo={setUserInfo} /> 
            </TabPanel>
          </TabContext>
        </Box>
       
        <Box sx={{backgroundColor:"#fff7f5"}}>
          <Box sx={{ display:'flex', justifyContent:'space-around', width:'75%', marginLeft: '170px', marginTop:'50px' , marginBottom:'20p' }}>
            <Box sx={{ display:'flex', flexDirection:'column',marginTop:'30px'}}>
              <Box component="img" src={logo} alt="" sx={{width:'300px', height:'70px', marginTop:'3px'}} ></Box>
              <Typography className="button56">Website Bán Vé Xe Online là trang web  <br></br> đáng tin cậy để bạn tìm kiếm những vé xé <br></br>  chất lượng nhất!</Typography>
              <Box sx={{display:'flex',}}>
                    <FmdGoodTwoToneIcon sx={{color:'#dc635b', width:'15px', height:'20px', marginRight:'5px'}}></FmdGoodTwoToneIcon>
                    <Typography className="button55">12 Nguyễn Văn Bảo, F4, Q.Gò Vấp, Tp.Hồ Chí Minh</Typography>
              </Box>
              <Box sx={{display:'flex'}}>
                    <LocalPhoneTwoToneIcon sx={{color:'#dc635b',width:'15px', height:'20px',marginRight:'5px'}}></LocalPhoneTwoToneIcon>
                    <Typography className="button55" >0326923816</Typography>
              </Box>
              <Box sx={{display:'flex'}}>
                    <InventoryTwoToneIcon sx={{color:'#dc635b',width:'15px', height:'20px',marginRight:'5px'}}></InventoryTwoToneIcon>
                    <Typography className="button55">nguyendangtruong22042002@gmail.com </Typography>
              </Box>
            </Box>          
            <Box sx={{ display:'flex', flexDirection:'column',marginTop:'30px'}}>
              <Typography className="button53">Thông tin chung</Typography>
              <a href="#" className="button54">Điều Khoảng & Điều kiện</a>
              <a href="#" className="button54">Chính Sách Bảo Mật</a>
              <a href="#" className="button54">Liên Hệ Về Hợp Tác </a>
              <a href="#" className="button54">Nhà Xe Limosine</a>
              <a href="#" className="button54">Quy Chế</a>
            </Box>
            <Box sx={{ display:'flex', flexDirection:'column',marginTop:'30px'}}>
              <Typography className="button53">Hổ Trợ  </Typography>
              <a href="#" className="button54">Điều Khoảng Sử Dụng</a>
              <a href="#" className="button54">Câu Hỏi Thường Gặp</a>
              <a href="#" className="button54">Hợp Tác Với Doanh Nghiệp</a>
              <a href="#" className="button54">Ví Điện Tử</a>
            </Box>
            <Box sx={{ display:'flex', flexDirection:'column',marginTop:'30px'}}>
              <Typography className="button53">Liên hệ </Typography>
              <Typography className="button53-1">Thứ 2 - Chủ Nhật</Typography>
              <Typography className="button53-2">0326923816 - 0911513297</Typography>
              <Typography className="button53-3">08:00 - 22:00</Typography>             
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{backgroundColor:"#ff1100"}}><Typography sx={{textAlign:'center', color:'white', fontSize:'14px'}}> © 2024|Bản quyền thuộc về Nguyễn Đang Trường_20062481 & Phạm Sỹ Thái_20047921
|
Giảng Viên quản lý : Thầy Đặng Văn Thuận</Typography>
      </Box>
     
      <Login open={openLogin} handleClose={handleCloseLogin} setUserInfo={setUserInfo} />
    </Box>
        
     
    </Box>
  );
};
ShowTrips.propTypes = {
  userInfo: PropTypes.func,
    dataOfShowTrips: PropTypes.shape({
    departure: PropTypes.string,
    destination: PropTypes.string,
    departureDate: PropTypes.string,
    returnDate: PropTypes.string,
    tripType: PropTypes.string,
    userId: PropTypes,
  }),
  socket: PropTypes.object
};
export default ShowTrips;