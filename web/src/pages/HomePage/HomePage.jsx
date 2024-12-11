/* eslint-disable no-unused-vars */
import React ,  { useState, useEffect } from 'react';
import {Box, AppBar, Toolbar ,Typography, Tab , Button, Menu, MenuItem, Avatar,Link} from '@mui/material'
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
import Sale from '../../pages/AboutPage/Sale'; 
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
import loginer from '../../../public/images/4860253.jpg'
import iuh from '../../../public/images/iuh.png'

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

            <Tab label={<Box sx={{ position: 'relative', marginTop: '5px' }}>Về Chúng Tôi</Box>}  value="4" className='button2'  iconPosition="start"  
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
      <Box sx={{backgroundColor:"#ff1100", marginTop:'80px'}}><Typography sx={{textAlign:'center', color:'white', fontSize:'14px'}}> © 2024|Bản quyền thuộc về Nguyễn Đang Trường_20062481 & Phạm Sỹ Thái_20047921
|
Giảng Viên quản lý : Thầy Đặng Văn Thuận</Typography></Box>
      <Login open={openLogin} handleClose={handleCloseLogin} setUserInfo={setUserInfo} />
      
    </Box>
  );
};

export default HomePage;