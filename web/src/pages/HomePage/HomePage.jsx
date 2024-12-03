/* eslint-disable no-unused-vars */
import React ,  { useState, useEffect } from 'react';
import {Box, AppBar, Toolbar ,Typography, Tab , Button, Menu, MenuItem, Avatar} from '@mui/material'
import logo from '../../../public/images/logohome (2).png';
import ticket from '../../../public/images/ticket.png';
import shed from '../../../public/images/bus(3).png';
import sale from '../../../public/images/sale.png';
import user from '../../../public/images/user.png';
import helpdesk from '../../../public/images/setting.png';
import '../HomePage/css/HomePage.css';
import Content from '../HomePage/content';
import {TabContext,TabList, TabPanel} from '@mui/lab';
import Login from '../AboutPage/Login'

import Ticket from '../AboutPage/Ticket'
import Information from '../../../src/pages/AboutPage/Information';
import ConfirmInfo from '../../pages/AboutPage/ConfirmInfo'; 
import Divider from '@mui/material/Divider';
import loguot from '../../../public/images/log-out.png'
import history from '../../../public/images/history.png'
import information from '../../../public/images/information.png'
import profile from '../../../public/images/profile.png'
import credit_card from '../../../public/images/credit-card.png'
import tickets from '../../../public/images/tickets.png'
import money from '../../../public/images/money.png'
import customer_service from '../../../public/images/customer-service.png'
import pass from '../../../public/images/pass.png'
import payment_method from '../../../public/images/payment-method.png'

import { useNavigate } from 'react-router-dom';



const HomePage = () => {
  const [value, setValue] = useState("1");
  const [openLogin, setOpenLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

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
    setValue("3"); 
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

  return (
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
        
          <Tab  label={<Box  sx={{ position: 'relative', marginTop: '5px',  }}>Trang Chủ</Box>}  value="1" className='button'  iconPosition="start"  sx={{width:'320px', display:'flex', justifyContent:'left'}}
            icon={<Box component='img'  src={shed} sx={{ width:'30px', height:'30px',  }}></Box> }>  
            </Tab>

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
                      <MenuItem onClick={handleInfoClick} MenuProps={{disableScrollLock: true, }}>
                      <Box
                          component="img"
                          src={information}
                          sx={{ width: '32px', height: '32px' }} 
                        /> 
                          <Typography className='button4' sx={{marginLeft:'8px'}}  MenuProps={{disableScrollLock: true, }}> Thông tin cá nhân</Typography>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleHistoryClick} MenuProps={{disableScrollLock: true, }}>
                      <Box
                          component="img"
                          src={history}
                          sx={{ width: '30px', height: '30px' }} 
                        /> 
                            <Typography className='button2' sx={{marginLeft:'11px'}}> Lịnh sử mua vé</Typography>
                      </MenuItem>
                       <MenuItem onClick={handleLogout}  MenuProps={{disableScrollLock: true, }}>
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
        <Box
        >
          <TabContext value={value}>
            <TabPanel value="1" sx={{
               padding:0,
               margin:0,
               boxSizing:'border-box',
            }}>       
              <Content userInfo={userInfo}  setValue={setValue}  />
             
            </TabPanel>
            <TabPanel value="2">
              <Typography>Mã Giảm giá</Typography>
              <Button onClick={handleOpenModal}>Mở modal</Button>
            </TabPanel>
            <TabPanel value="3">
             <Ticket  userInfo={userInfo}> onLogout={handleLogout} setUserInfo={setUserInfo} </Ticket>
            </TabPanel>
            <TabPanel value="4">
              <Typography>Cần Trợ Giúp</Typography>
            </TabPanel>
            <TabPanel value="5"> 
              <Information  onLogout={handleLogout} userInfo={userInfo} setUserInfo={setUserInfo} /> 
            </TabPanel>
          </TabContext>
        </Box>
         <Box sx={{display:'flex' ,flexDirection:'column',width:'60%',justifyContent:'space-between', margin:'auto', mt:8}}>
              <Box sx={{display:'flex', marginBottom:'45px'}}>
                  <Box sx={{display:'flex',}}><Box component="img" src={tickets} alt="" sx={{width:'55px', height:'55px', marginTop:'10px' , marginRight:'15px'}} ></Box>
                         <Box sx={{display:'flex',flexDirection:'column' ,width:'400px',}}>
                            <Typography className='button50'> Nhận vé xe</Typography>
                            <Typography className='button51'>Với tính năng dự đoán và lựa chọn chuyến xe thay thế, bạn sẽ tăng cơ hội nhận được vé xe xác nhận.</Typography>
                          </Box>
                    </Box>
                    <Box sx={{display:'flex',marginLeft:'50px'}}><Box component="img" src={credit_card} alt="" sx={{width:'55px', height:'55px', marginTop:'10px' , marginRight:'15px'}} ></Box>
                         <Box sx={{display:'flex',flexDirection:'column' ,width:'400px'}}>
                            <Typography className='button50'> Hủy miễn phí vé xe</Typography>
                            <Typography className='button51'>Nhận lại toàn bộ tiền hoàn lại khi mua vé tàu bằng cách chọn tính năng hủy miễn phí của chúng tôi.</Typography>
                          </Box>
                    </Box>
                    
              </Box>
              <Box sx={{display:'flex', marginBottom:'45px'}}>
                  <Box sx={{display:'flex'}}><Box component="img" src={money} alt="" sx={{width:'50px', height:'50px', marginTop:'10px' , marginRight:'15px'}} ></Box>
                         <Box sx={{display:'flex',flexDirection:'column' ,width:'400px',}}>
                            <Typography className='button50'> Hoàn tiền và hủy ngay lập tức</Typography>
                            <Typography className='button51'>Nhận tiền hoàn lại ngay lập tức và đặt vé xe tiếp theo một cách dễ dàng..</Typography>
                          </Box>
                    </Box>
                    <Box sx={{display:'flex',marginLeft:'50px'}}><Box component="img" src={payment_method} alt="" sx={{width:'55px', height:'55px', marginTop:'10px' , marginRight:'15px'}} ></Box>
                         <Box sx={{display:'flex',flexDirection:'column' ,width:'400px'}}>
                            <Typography className='button50'>Thanh toán an toàn được kích hoạt</Typography>
                            <Typography className='button51'>Thanh toán trên Ví Điện tử được bảo mật cao. Dễ dàng và nhiều phương thức thanh toán khác có sẵn..</Typography>
                          </Box>
                    </Box>
                    
              </Box>
              <Box sx={{display:'flex', marginBottom:'45px'}}>
                  <Box sx={{display:'flex'}}><Box component="img" src={customer_service} alt="" sx={{width:'55px', height:'55px', marginTop:'10px' , marginRight:'15px'}} ></Box>
                         <Box sx={{display:'flex',flexDirection:'column' ,width:'400px',}}>
                            <Typography className='button50'> Hỗ trợ đặt vé xe và yêu cầu</Typography>
                            <Typography className='button51'>Hỗ trợ khách hàng 24/7, mọi thắc mắc liên quan đến xe và đặt vé, vui lòng gọi số 0326923816.</Typography>
                          </Box>
                    </Box>
                    <Box sx={{display:'flex',marginLeft:'50px', }}><Box component="img" src={pass} alt="" sx={{width:'55px', height:'55px', marginTop:'10px' , marginRight:'15px'}} ></Box>
                         <Box sx={{display:'flex',flexDirection:'column' ,width:'400px', mt:1}}>
                            <Typography className='button50'> Theo dõi tình trạng tàu trực tiếp</Typography>
                            <Typography className='button51'>Trạng thái vé xe và thông báo về vé xe của bạn.</Typography>
                          </Box>
                    </Box>
                    
              </Box>
              
         </Box>
      </Box>
      
      <Login open={openLogin} handleClose={handleCloseLogin} setUserInfo={setUserInfo} />
      
    </Box>
  );
};

export default HomePage;