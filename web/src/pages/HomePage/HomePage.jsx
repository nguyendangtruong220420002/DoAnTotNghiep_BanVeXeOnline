/* eslint-disable no-unused-vars */
import React ,  { useState } from 'react';
import {Box, AppBar, Toolbar ,Typography, Tab , Button} from '@mui/material'
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

import ConfirmInfo from '../../pages/AboutPage/ConfirmInfo'; 




const HomePage = () => {
  const [value, setValue] = useState("1");
  const [openLogin, setOpenLogin] = useState(false);
  


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

const handleSubmitInfo = (userInfo) => {
  console.log('Submitted Info:', userInfo);
  // Thêm logic xử lý sau khi nhận được thông tin từ modal (nếu cần)
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

            <Button 
                    onClick={() => setOpenLogin(true)}
                    sx={{ display: 'flex', alignItems: 'center',width:'200px',  }}
                  >
                    <Box component='img' src={user} sx={{ width: '20px', height: '20px' }} />
                    <Typography className='button3' sx={{ position: 'relative', marginTop: '3px' }}> Đăng Nhập/Đăng Ký</Typography>
                   
                  </Button>
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
              <Content />
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
          </TabContext>
        </Box>
      </Box>
      <Login open={openLogin} handleClose={handleCloseLogin} />
      <ConfirmInfo
  open={openModal} 
  handleClose={handleCloseModal}
  onSubmit={handleSubmitInfo}
  phoneNumber="0123456789" // Thêm thông tin số điện thoại hoặc bất kỳ dữ liệu nào khác
/>
    </Box>
  );
};

export default HomePage;