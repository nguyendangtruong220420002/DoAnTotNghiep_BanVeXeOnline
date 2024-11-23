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
import Content from '../HomePage/content';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';




const InforCustoOfTrips = () => {
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
 
  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setValue("1");
    handleCloseMenu(); 
  };
  // Mở menu
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Đóng menu
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
                      <MenuItem onClick={handleHistoryClick} >
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
      <Box sx={{ position: 'relative', height: 'auto' }}> 
        <Box
        >
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
                                
                    sx={{
                      border:'none',
                      textTransform: "none", 
                      fontSize: "13.5px",      
                      color:'#0456ca',
                      lineHeight:'20px', 
                     padding:"15px 7px",
                      textShadow:'1px 1px 2px rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    Quay lại
                  </Button>
                  </Box>
                <Box sx={{display:'flex' , justifyContent:'space-between' }} >
                  <Box sx={{display:'flex',flexDirection:'column',}} >
                    <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd", borderRadius:'10px', width:'620px',backgroundColor:'rgb(255, 255, 255)'}}> 
                        <Typography className='button35' sx={{marginLeft:'18px', marginTop:'20px' }} >Thông tin liên hệ  <span style={{color:'red'}}>*</span></Typography>
                     
                        <TextField 
                          className='select1'
                          label="Tên người đi "
                          variant="outlined"
                          fullWidth
                          required 
                        />
                        
                        
                        <TextField
                          label="Số điện thoại"
                          className='select1' 
                          
                          variant="outlined"
                          fullWidth
                          required
                          type="tel"
                        />
                        <TextField
                          label="Email"
                          className='select1'
                          variant="outlined"
                          fullWidth
                          required
                          type="email"
                        />
                        <Box  className='select1' sx={{border: "1px solid #43b975", borderRadius:'10px', display:'flex', backgroundColor:'#eefbf4', alignItems:'center', justifyContent:'center' ,padding:'8px 0px'}}>
                          <VerifiedUserIcon sx={{width:'17px', color:'#27ae60', margin:'10px'}}></VerifiedUserIcon>  
                          <Typography className='button36' sx={{fontSize:'14px'}}>Số điện thoại và email được sử dụng để gửi thông tin đơn hàng và liên hệ khi cần thiết.</Typography>   
                          </Box>

                    </Box>

                    <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd", borderRadius:'10px',marginTop:'15px', width:'620px',backgroundColor:'rgb(255, 255, 255)'}}> 
                        <Typography className='button35'  sx={{marginLeft:'18px', marginTop:'20px'}} >Thông tin đón trả  <InfoOutlinedIcon sx={{color:'#bd3106'}}></InfoOutlinedIcon></Typography>
                     
                        <Box sx={{ display:'flex',justifyContent:'space-between', padding:'0px 30px '}}> 
                         
                        <FormControl >
                        <Typography className='button37' >Điểm đón</Typography>
                        <Select sx={{
                                borderRadius: '8px',
                                height: '40px',
                                width:'270px',
                                border: "1px solid #ddd",
                                fontSize: '15.5px',
                                fontWeight: "bold",
                                "& .MuiSelect-select": {
                                  padding: '0px',
                                },
                              }}className="select"
                              MenuProps={{ disableScrollLock: true }}
                        >
                          <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                        </Select>
                        <Typography sx={{width:'270px',fontSize:'14.5px', marginTop:'15px'}} className='button36'>Quý khách vui lòng có mặt tại Bến xe/Văn Phòng *********** để được trung chuyển hoặc kiểm tra thông tin trước khi lên xe.</Typography>
                      </FormControl>

                      <Box sx={{ width: '1px',height: 'auto',backgroundColor: '#dfdfdf',}}></Box>

                      <FormControl >
                        <Typography className='button37' >Điểm trả</Typography>
                        <Select sx={{
                                borderRadius: '8px',
                                height: '40px',
                                width:'270px',
                                border: "1px solid #ddd",
                                fontSize: '15.5px',
                                fontWeight: "bold",
                                "& .MuiSelect-select": {
                                  padding: '0px',
                                },
                              }}className="select"
                              MenuProps={{ disableScrollLock: true }}
                        >
                          <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                        </Select>
                      </FormControl>
                           </Box>

                    </Box>

                  </Box>
                    <Box>
                    <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd",borderRadius:'10px', width:'350px',backgroundColor:'rgb(255, 255, 255)'}}>                   
                        <Typography className='button35' sx={{marginLeft:'18px', marginTop:'20px' }} >Tạm tính  <span style={{color:'red'}}>*</span></Typography>              
                    </Box>

                    <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd",borderRadius:'10px', width:'350px',backgroundColor:'rgb(255, 255, 255)' ,marginTop:'15px'}}>                   
                        <Typography className='button35' sx={{marginLeft:'18px', marginTop:'20px' }} >Thông tin chuyến đi  <span style={{color:'red'}}>*</span></Typography>              
                    </Box>
                    </Box>
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