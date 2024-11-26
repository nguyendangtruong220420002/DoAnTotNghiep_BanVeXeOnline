/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
  AppBar, Toolbar ,Menu,MenuItem
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
import Content from '../HomePage/content';
import {TabContext,TabList, TabPanel} from '@mui/lab';
import Login from '../AboutPage/Login';
import Information from '../../../src/pages/AboutPage/Information';
import ConfirmInfo from '../../pages/AboutPage/ConfirmInfo'; 
import loguot from '../../../public/images/log-out.png'
import history from '../../../public/images/history.png'
import information from '../../../public/images/information.png'
import profile from '../../../public/images/profile.png'
import { useNavigate } from 'react-router-dom';
const ShowTrips = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("1");
  const [openLogin, setOpenLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setValue("1");
    handleCloseMenu(); 
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
  const location = useLocation();
  const { dataOfShowTrips } = location.state || {};
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const [trips, setTrips] = useState([]);
  const [tabIndex1, setTabIndex1] = useState(0);
  const [selectedBox, setSelectedBox] = useState(null);
  const [tripType, setTripType] = useState(dataOfShowTrips.tripType);
  const [openTabs, setOpenTabs] = useState({});
  
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
    console.log("dataOfShowTrips:", dataOfShowTrips);
    if (dataOfShowTrips) {
      fetchTrips();
      setTimeout(() => {setLoading(false)}, 5000);
    }
  }, [dataOfShowTrips, tripType]);
  const fetchTrips = async () => {
    try {
      console.log("Fetching trips with params:", {
        departure: dataOfShowTrips.departure,
        destination: dataOfShowTrips.destination,
        departureDate: dataOfShowTrips.departureDate,
        returnDate:
          tripType === "Khứ hồi" ? dataOfShowTrips.returnDate : undefined,
        tripType: tripType,
        userId: dataOfShowTrips.userId,
      });
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/tripsRoutes/search`, {
        params: {
          departure: dataOfShowTrips.departure,
          destination: dataOfShowTrips.destination,
          departureDate: dataOfShowTrips.departureDate,
          returnDate:
            tripType === "Khứ hồi" ? dataOfShowTrips.returnDate : undefined,
          tripType: tripType,
          userId: dataOfShowTrips.userId,
        },
      });
      console.log("Fetched trips data from API:", response.data);
      setTrips(response.data);
    } catch (error) {
      if (error.response) {
        console.error("Error fetching trips:", error.response.data);
        console.error("Status code:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    } finally {
      setLoading(false); 
    }
  };
  const handleTabChange1 = (event, newValue) => {
    setTabIndex1(newValue);
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
    navigate('/');
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
            
            <Tab label={<Box sx={{ position: 'relative', marginTop: '5px' }}>Mã Giảm Giá</Box>}  value="2" className='button2'  iconPosition="start"  
            icon={<Box component='img'  src={sale} sx={{ width:'23px', height:'23px', }}></Box>}>  
           
            </Tab>

          <Tab label={<Box sx={{ position: 'relative', marginTop: '5px' }}>Vé Của Tôi</Box>}  value="3" className='button2'  iconPosition="start"  
            icon={<Box component='img'  src={ticket} sx={{ width:'23px', height:'23px', }}></Box>}>  
            </Tab>

            <Tab label={<Box sx={{ position: 'relative', marginTop: '5px' }}>Cần Trợ Giúp</Box>}  value="4" className='button2'  iconPosition="start"  
            icon={<Box component='img'  src={helpdesk} sx={{width:'23px', height:'23px', }}></Box>}>  
            
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
            </TabPanel>
            <TabPanel value="2">
              <Typography>Mã Giảm giá</Typography>
              <Button onClick={handleOpenModal}>Mở modal</Button>
            </TabPanel>
            <TabPanel value="3">
              <Typography>Vé Của Tôi</Typography>
            </TabPanel>
            <TabPanel value="4">
              <Typography>Cần Trợ Giúp</Typography>
            </TabPanel>
            <TabPanel value="5"> 
              <Information  onLogout={handleLogout} userInfo={userInfo} setUserInfo={setUserInfo} /> 
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
      <Login open={openLogin} handleClose={handleCloseLogin} setUserInfo={setUserInfo} />
      <ConfirmInfo
        open={openModal} 
        handleClose={handleCloseModal}
        onSubmit={handleSubmitInfo}
        phoneNumber="0123456789" />
    </Box>
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
              <Typography className="button14">Giá </Typography>
              <Typography className="button14">Xếp hạng</Typography>
              <Typography className="button14">Thời gian</Typography>
              <Typography className="button14">Thời gian khởi hành</Typography>
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
            sx={{width: "1200px", height: "auto", display: "flex", margin: "auto", marginTop: "15px",}}>
            <Box sx={{ display: "flex", flexDirection:"column" }}>
              <Box
                sx={{width: "320px",height: "500px",alignItems: "",border: "1px solid #ececec",backgroundColor: "#ffffff",borderRadius: "8px",marginLeft: "23px",boxShadow: "",}}>
                <Typography> Bộ Lọc</Typography>
              </Box>
            </Box>

            <Box
              sx={{width: "100%",maxHeight: "800px",overflowY: "auto",scrollbarWidth: "none","&::-webkit-scrollbar": { display: "none" }}}>
              {dataOfShowTrips.tripType === "Khứ hồi" ? (
                <Box>
                  <Tabs value={tabIndex1} onChange={handleTabChange1} centered>
                    <Tab label={`Chuyến đi (${departureDateLabel})`}/>
                    <Tab label={`Chuyến về (${returnDateLabel})`} />
                  </Tabs>
                  {tabIndex1 === 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6">Thông tin chuyến đi:</Typography>
                      {trips.map((trip) => (
                        <Box key={trip._id}></Box>
                      ))}
                    </Box>
                  )}
                  {tabIndex1 === 1 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6">Thông tin chuyến về:</Typography>
                      {trips.map((trip) => (
                        <Box key={trip._id}>
                          <Typography>
                            {trip.departure} đến {trip.destination}
                          </Typography>
                          <Typography>
                            Quay lại:{" "}
                            {new Date(trip.returnDate).toLocaleString()}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box>
                  {trips.map((trip) => (
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
                                  .tz("Asia/Ho_Chi_Minh")
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
                                    Nội dung cho tab Chính Sách
                                  </Typography>
                                </Box>
                              )}
                              {openTabs[trip._id] === "4" && (
                                <Box>
                                  <Typography>
                                    Nội dung cho tab Trung Chuyển
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ height: "10px" }}></Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
ShowTrips.propTypes = {
  userInfo: PropTypes.func.isRequired,
  dataOfShowTrips: PropTypes.shape({
    departure: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    departureDate: PropTypes.string.isRequired,
    returnDate: PropTypes.string.isRequired,
    tripType: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
  }).isRequired,
};
export default ShowTrips;