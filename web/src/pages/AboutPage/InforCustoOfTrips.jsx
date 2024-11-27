/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React ,  { useState, useEffect } from 'react';
import {Box, AppBar, Toolbar ,Typography, Button, Menu, MenuItem, TextField, Select, FormControl ,InputLabel} from '@mui/material'
import logo from '../../../public/images/logohome (2).png';
import arrow from '../../../public/images/arrow.png';
import user from '../../../public/images/user.png';
import '../HomePage/css/HomePage.css';
import {TabContext,TabList, TabPanel} from '@mui/lab';
import Login from '../AboutPage/Login'
import Information from '../../../src/pages/AboutPage/Information';
import ConfirmInfo from '../../pages/AboutPage/ConfirmInfo'; 
import Divider from '@mui/material/Divider';
import loguot from '../../../public/images/log-out.png'
import history from '../../../public/images/history.png'
import information from '../../../public/images/information.png'
import profile from '../../../public/images/profile.png'
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useLocation } from 'react-router-dom';
import moment from "moment-timezone";
import axios from "axios";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


const InforCustoOfTrips = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [alert, setAlert] = useState({
    open: false,
    severity: 'success', 
    message: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const InforCusto = location.state?.userInfo;
  const from = location.state?.from;
  const schedule = location.state?.schedule;
  const to = location.state?.to;
  const totalAmount = location.state?.totalAmount;  
  const SeatCode = location.state?.SeatCode;  
  const SeatCodeSelect = location.state?.SeatCodeSelect;  
  
  const departure = location.state?.departure; 
  const departureDate = location.state?.departureDate; 
  const departureTime = location.state?.departureTime; 
  const destination = location.state?.destination; 
  const endTime = location.state?.endTime;
  const selectedSeats = location.state?.selectedSeats;
  const tripId = location.state?.tripId;
  const totalAmountAll = location.state?.totalAmountAll;
  const [selectedDeparture, setSelectedDeparture] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [value, setValue] = useState("1");
  const [openLogin, setOpenLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [formDataCustoOfTrips, setFormDataCustoOfTrips] = useState({
    fullName: InforCusto?.fullName || '',
    phoneNumber: InforCusto?.phoneNumber || '',
    email: InforCusto?.email || '',
});
const [Timehouse, setTimehouse] = useState(null);

useEffect(() => {
  if (departureTime) {
    const formattedTime = moment(departureTime, "DD/MM/YYYY, HH:mm").tz("Asia/Ho_Chi_Minh").format("HH:mm");
    setTimehouse(formattedTime); 
  }
}, [departureTime]);

{selectedSeats.length > 0 ? new Intl.NumberFormat('vi-VN', {style: 'currency',currency: 'VND',}).format(selectedSeats.length * totalAmount) : ""} 
const handleChangeDeparture = (event) => {
  setSelectedDeparture(event.target.value); 
};
const handleChangeDestination = (event) => {
  setSelectedDestination(event.target.value); 
};

const selectedDepartureName =
    schedule.find((stop) => stop._id === selectedDeparture)?.name || from;
  const selectedDestinationName =
    schedule.find((stop) => stop._id === selectedDestination)?.name || to;


    const handleCreateBooking = async () => {
      if (!selectedSeats || selectedSeats.length === 0) {
        alert("Bạn chưa chọn ghế.");
        return;
      }
      const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^0\d{9}$/; 
        return phoneRegex.test(phoneNumber);
      };
      if (!validatePhoneNumber(formDataCustoOfTrips.phoneNumber)) {
        setAlert({
          open: true,
          severity: 'error',
          message: 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.',
        });
        return; 
      }
    
      const formattedDepartureDate = departureDate.replace("Th ", "").trim();
      const parts = formattedDepartureDate.split(", ");
      const dayMonthYear = parts[1];
      const formattedDepartureTime = moment(dayMonthYear, "D/MM/YYYY")
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    
      const bookingDataForPayment = {
        tripId,
        userId: InforCusto._id,
        seatId: SeatCode,
        totalFare: totalAmountAll,
        selectedDepartureName: selectedDepartureName,
        selectedDestinationName: selectedDestinationName,
        Timehouse: Timehouse,
        departureDate: departureDate,
        passengerInfo: {
          fullName: formDataCustoOfTrips.fullName,
          phoneNumber: formDataCustoOfTrips.phoneNumber,
          email: formDataCustoOfTrips.email,
        },
      };
      const isDataValid = Object.values(bookingDataForPayment).every(value => {
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).every(subValue => {
            return typeof subValue === 'string' ? subValue.trim() !== '' : subValue !== undefined && subValue !== null;
          });
        }
        return typeof value === 'string' ? value.trim() !== '' : value !== undefined && value !== null;
      });
    
      if (!isDataValid) {
        setAlert({
          open: true,
          severity: 'error',
          message: 'Vui lòng điền đầy đủ thông tin.',
        });
        return;
      }  
      try {
        const createBookingResponse = await axios.post(`${API_URL}/api/bookingRoutes/add`, bookingDataForPayment);
        const bookingData = {
          tripId,
          bookingDate:formattedDepartureTime,
          seats:SeatCodeSelect,
          userId:userInfo._id,
          selectedDepartureName:selectedDepartureName,
          selectedDestinationName:selectedDestinationName,
          Timehouse:Timehouse,
          departureDate:departureDate,
        };
    
       // console.log("bookingData", bookingData);     
     await axios.post(`${API_URL}/api/tripsRoutes/book-seats`, bookingData);
          const bookingId = createBookingResponse.data._id;
          const bookingID = createBookingResponse.data.BookingID;
          //console.log("bookingId",bookingId)
        setTimeout(() => {
          navigate('/payment', { state: { bookingId,bookingID,userInfo ,from, schedule ,to, endTime, selectedSeats,
            totalAmount,SeatCode,departure,destination,tripId ,totalAmountAll,departureDate,departureTime,SeatCodeSelect,formDataCustoOfTrips } });
        }, 2000);
    
      } catch (error) {
        console.error("Lỗi khi thanh toán:", error);
        setAlert({
          open: true,
          severity: 'error',
          message: error.response?.data || 'Đặt vé thất bại. Vui lòng thử lại.',
        });
      }
    };
    



// Phần trước của context
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

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataCustoOfTrips((prev) => ({ ...prev, [name]: value }));
};
  const handleCloseLogin = () => {
    setOpenLogin(false);
  };
  const [openModal, setOpenModal] = useState(false);
 // Hàm để mở modal
 const handleOpenModal = () => {
  setOpenModal(true);
};
// Hàm để đóng modal
const handleCloseModal = () => {
  setOpenModal(false);
};

  return (
    <Box sx={{ position: 'relative', }}>
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
                    {userInfo ? (
                     <Box sx={{ display: 'flex', alignItems: 'center', width: '200px' , marginTop:'15px' }}>
                       
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
                      <MenuItem onClick={handleHistoryClick}>
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
                      <MenuItem  onClick={() => setValue("1")}>
                       <Box
                          component="img"
                          src={arrow}
                          sx={{ width: '30px', height: '30px' }} 
                        /> 
                        <Typography className='button2' sx={{marginLeft:'11px'}}> Quay lại  </Typography>
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
{/* đến đây của context là hết */}
      <Box sx={{ position: 'relative', height: 'auto' }}> 
        <Box>
          <TabContext value={value}>
            <TabPanel value="1" sx={{
               padding:0,
               margin:0,
               boxSizing:'border-box',
            }}>
                <Box sx={{width:'100%' , height:'5px', backgroundColor:'rgb(240, 82, 34)'}}></Box>
                <Box sx={{width:'100%', height:'auto', backgroundColor:'#f2f2f2'}}>
                <Box sx={{ width:'1000px', height:'auto', alignItems:'center', margin: 'auto' ,   }}>  
                <Box>
                  <Button
                    startIcon={<ArrowBackIosNewRoundedIcon sx={{width:'15px' , color:'#888888'}} />} 
                    onClick={() => navigate(-1)}  
                    variant="outlined"                            
                    sx={{border:'none',textTransform: "none", fontSize: "13.5px",color:'#0456ca',lineHeight:'20px', padding:"15px 7px",textShadow:'1px 1px 2px rgba(255, 255, 255, 0.2)'
                    }}>Quay lại
                  </Button>
                  </Box>
                <Box sx={{display:'flex' , justifyContent:'space-between' }} >
                  <Box sx={{display:'flex',flexDirection:'column',}} >
                    <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd", borderRadius:'10px', width:'620px',backgroundColor:'rgb(255, 255, 255)'}}> 
                        <Typography className='button35' sx={{marginLeft:'18px', marginTop:'20px' }} >Thông tin liên hệ  <span style={{color:'red'}}>*</span></Typography>
                            <TextField 
                              className='select1'
                              label="Tên người đi"
                              variant="outlined"
                              fullWidth
                              required 
                              name="fullName"
                              value={formDataCustoOfTrips.fullName}
                              onChange={handleChange}/>
                            <TextField
                              label="Số điện thoại"
                              className='select1'         
                              variant="outlined"
                              fullWidth
                              required
                              type="tel"
                              name="phoneNumber"
                              value={formDataCustoOfTrips.phoneNumber}
                              onChange={handleChange}/>
                            <TextField
                              label="Email"
                              className='select1'
                              variant="outlined"
                              fullWidth
                              required
                              type="email"
                              name="email"
                              value={formDataCustoOfTrips.email}
                              onChange={handleChange}/>
                        <Box  className='select1' sx={{border: "1px solid #43b975", borderRadius:'10px', display:'flex', backgroundColor:'#eefbf4', alignItems:'center', justifyContent:'center' ,padding:'8px 0px'}}>
                          <VerifiedUserIcon sx={{width:'17px', color:'#27ae60', margin:'10px'}}></VerifiedUserIcon>  
                          <Typography className='button36' sx={{fontSize:'14px'}}>Số điện thoại và email được sử dụng để gửi thông tin đơn hàng và liên hệ khi cần thiết.</Typography>   
                          </Box>
                        </Box>
                    <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd", borderRadius:'10px',marginTop:'15px', width:'620px',backgroundColor:'rgb(255, 255, 255)', marginBottom:'20px'}}> 
                        <Typography className='button35'  sx={{marginLeft:'18px', marginTop:'20px'}} >Thông tin đón trả  <InfoOutlinedIcon sx={{color:'#bd3106'}}></InfoOutlinedIcon></Typography>
                     
                        <Box sx={{ display:'flex',justifyContent:'space-between', padding:'0px 30px '}}> 
                        <FormControl >
                        <Typography className='button37' >Điểm đón</Typography>
                        <Select
                        sx={{
                          borderRadius: "8px",
                          height: "40px",
                          width: "270px",
                          border: "1px solid #ddd",
                          fontSize: "15.5px",
                          fontWeight: "bold",
                          "& .MuiSelect-select": {
                            padding: "0px",
                          },
                        }}
                        className="select"
                        value={selectedDeparture || from}
                        onChange={handleChangeDeparture}
                        MenuProps={{ disableScrollLock: true }}
                      >
                        <MenuItem  value={from}>
                          <Box>
                            <Typography className="button26">{from}</Typography>
                          </Box>
                        </MenuItem>
                        {schedule.map((stop) => (
                          <MenuItem value={stop._id} key={stop._id} >
                            <Box>
                                <Typography className="button26">{stop.name}</Typography>                           
                            </Box>
                          </MenuItem>
                        ))}
                        <MenuItem value={to} >
                        <Box>
                            <Typography className="button26">{to}</Typography>
                          </Box>
                        </MenuItem>
                      </Select>

                        <Typography sx={{width:'270px',fontSize:'14.5px', marginTop:'15px', marginBottom:'20px'}} className='button36'>Quý khách vui lòng có mặt tại Bến xe/Văn Phòng Trước 30 phút để kiểm tra thông tin trước khi lên xe.</Typography>
                      </FormControl>
                      <Box sx={{ width: '1px',height: 'auto',backgroundColor: '#dfdfdf',}}></Box>
                      <FormControl>
                        <Typography className='button37'>Điểm trả</Typography>
                        <Select
                        sx={{
                          borderRadius: "8px",
                          height: "40px",
                          width: "270px",
                          border: "1px solid #ddd",
                          fontSize: "15.5px",
                          fontWeight: "bold",
                          "& .MuiSelect-select": {
                            padding: "0px",
                          },
                        }}
                        className="select"
                        value={selectedDestination || to }
                        onChange={handleChangeDestination}
                        MenuProps={{ disableScrollLock: true }}
                      >
                        <MenuItem value={from} >
                          <Box>
                            <Typography className="button26">{from}</Typography>
                          </Box>
                        </MenuItem>
                        {schedule.map((stop) => (
                          <MenuItem value={stop._id} key={stop._id}>
                            <Box>
                                <Typography className="button26">{stop.name}</Typography>                           
                            </Box>
                          </MenuItem>
                        ))}
                        <MenuItem  value={to}>
                        <Box>
                            <Typography className="button26">{to}</Typography>
                          </Box>
                        </MenuItem>
                      </Select>
                      </FormControl>
                           </Box>
                    </Box>
                  </Box>
                    <Box>
                    <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd",borderRadius:'10px', width:'350px',backgroundColor:'rgb(255, 255, 255)'}}> 
                        <Box sx={{display:'flex', justifyContent:'space-between',alignItems:'center'}}> 
                          <Typography className='button35' sx={{marginLeft:'18px', marginTop:'20px' }} >Tạm tính <span style={{color:'red'}}>*</span></Typography>     
                          <Typography className='button35-5' sx={{ marginTop:'20px', marginRight:'20px' }} > {selectedSeats.length > 0 ? new Intl.NumberFormat('vi-VN', {style: 'currency',currency: 'VND',}).format(selectedSeats.length * totalAmount) : ""}   </Typography>   
                        </Box>
                        <Box sx={{display:'flex', marginRight:'20px',justifyContent:'space-between', marginBottom:'20px'}}> 
                          <Typography className='button38' sx={{marginLeft:'20px', }}>Giá vé</Typography>  
                          <Box sx={{display:'flex',flexDirection:'column', justifyContent:'space-between',alignItems:'center'}}>
                              <Box sx={{display:'flex', justifyContent:'flex-end' }}>
                                <Typography className='button38-1'> {selectedSeats.length > 0 ? new Intl.NumberFormat('vi-VN', {style: 'currency',currency: 'VND',}).format(selectedSeats.length * totalAmount) : ""}   </Typography>
                                <Typography className='button38-1'> &nbsp;x {selectedSeats.length === 0 ? "" : `${selectedSeats.length}`}</Typography>
                              </Box>  
                          <Typography className='button38-2'> Mã ghế/giường:  {SeatCode}</Typography>
                          </Box>
                         
                        </Box>                      
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd",borderRadius:'10px', width:'350px',backgroundColor:'rgb(255, 255, 255)' ,marginTop:'15px'}}>                   
                        <Typography className='button35' sx={{marginLeft:'18px', marginTop:'20px' }} >Thông tin chuyến đi  <span style={{color:'red'}}>*</span></Typography>  
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px', }}>
                                <Typography className='button38-3' sx={{color:'#647280',fontSize:'15px'}}> Tuyến xe</Typography>
                                <Typography className='button38-3' sx={{fontSize:'15px',color:"#2b8276"}}> {departure} - {destination} </Typography>
                            </Box> 
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px'}}>
                                <Typography className='button38-3' sx={{color:'#647280',fontSize:'15px'}}> Điểm đón</Typography>
                                <Typography className='button38-3' sx={{fontSize:'13px',}}> {selectedDepartureName}  </Typography>
                            </Box> 
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px'}}>
                                <Typography className='button38-3' sx={{color:'#647280',fontSize:'15px'}}> điểm trả</Typography>
                                <Typography className='button38-3' sx={{fontSize:'13px',}}> {selectedDestinationName } </Typography>
                            </Box> 
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px',}}>
                                <Typography className='button38-3' sx={{color:'#647280',fontSize:'15px'}}> Ngày xuất bến</Typography>
                                <Typography className='button38-3' sx={{fontSize:'15px',color:"#2b8276"}}> {departureDate}</Typography>
                            </Box>  
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px',}}>
                                <Typography className='button38-3' sx={{color:'#647280',fontSize:'15px'}}> Giờ xuất bến</Typography>
                                <Typography className='button38-3' sx={{fontSize:'15px',color:"#2b8276"}}>  {Timehouse}</Typography>
                            </Box>  
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px'}}>
                                <Typography className='button38-3' sx={{color:'#647280',fontSize:'15px'}}> Số lượng vé</Typography>
                                <Typography className='button38-3' sx={{fontSize:'15px'}} > {selectedSeats.length === 0 ? "" : `${selectedSeats.length} Vé`} </Typography>
                            </Box> 
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px', marginBottom:'10px'}}>
                                <Typography className='button38-3' sx={{color:'#647280',fontSize:'15px'}}> Số vé</Typography>
                                <Typography className='button38-3'sx={{fontSize:'15px',}}> {SeatCode},</Typography>
                            </Box>
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px', marginBottom:'20px'}}>
                                <Typography className='button38-3' sx={{color:'#647280',fontSize:'15px'}}> Tổng tiền lượt đi</Typography>
                                <Typography className='button38-3' sx={{fontSize:'18px',color:"#c23003"}}> {selectedSeats.length > 0 ? new Intl.NumberFormat('vi-VN', {style: 'currency',currency: 'VND',}).format(selectedSeats.length * totalAmount) : ""} </Typography>
                            </Box>        
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{width:'100%', backgroundColor:'white'}}>
                   <Box sx={{display:'flex', alignItems:'center', margin: 'auto', width:'1000px', height:'120px', justifyContent:'space-between'}}>
                          <Box sx={{display:'flex', flexDirection:"column"}}>
                              <Stack sx={{ width: '500px', margin: 'auto',position: "absolute",
                              bottom: "300px", 
                              left: "80%",
                              transform: "translateX(-50%)",
                              zIndex: 10,}}>
                              {alert.open && (
                                <Alert 
                                variant="filled" 
                                  severity={alert.severity} 
                                  onClose={() => setAlert((prev) => ({ ...prev, open: false }))} 
                                >
                                  {alert.message}
                                </Alert>
                              )}
                            </Stack>
                          <Button
                          onClick={handleCreateBooking}
                           sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd", borderRadius:'10px', width:'620px',backgroundColor:'#e66961', height:'50px'}}>
                              <Typography sx={{color:'white', textTransform:'none', textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', marginTop:'5px'}}>Thanh Toán</Typography>
                          </Button>
                              <Typography className='button36' sx={{fontSize:'14.5px',textAlign:'center', marginTop:'10px'}}>Bằng việc nhấn nút Tiếp tục, bạn đồng ý với Chính sách bảo mật thanh toán và Quy chế</Typography>
                          </Box>
                    <Typography className='button36' sx={{width:'350px',backgroundColor:'rgb(255, 255, 255)',fontSize:'14px'}}>
                      Bạn sẽ sớm nhận được biển số xe, số điện thoại tài xế và dễ dàng thay đổi điểm đón trả sau khi đặt.</Typography>
                   </Box>
              
                    </Box>
                </Box>
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
  phoneNumber="0123456789" 

/>
    </Box>
  );
};

export default InforCustoOfTrips;           
