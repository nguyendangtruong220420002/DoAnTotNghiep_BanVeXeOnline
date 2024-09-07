/* eslint-disable no-unused-vars */
import React ,  { useState } from 'react';
import {Box, AppBar, Toolbar ,Typography, Tab , Stack} from '@mui/material'
import logo from '../../../public/images/logo1.png';
import home_banner from '../../../public/images/home_banner.png'
import '../HomePage/css/HomePage.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SystemSecurityUpdateOutlinedIcon from '@mui/icons-material/SystemSecurityUpdateOutlined';
import Content from '../HomePage/content';
import {TabContext,TabList, TabPanel} from '@mui/lab';

const HomePage = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box>
      <img src={home_banner} alt="" className='home_banner' />
      <AppBar  sx={{ backgroundColor: 'transparent', boxShadow: 'none' }} >
      <Toolbar >
        <Box sx={{ flexGrow: 1, display: 'flex',justifyContent:'space-between' ,}} className='menu1'>
          <Typography variant="h6" component="div" sx={{display:'flex', height:'33px',justifyContent:'center', alignItems:'center' ,marginTop:'15px',}} className='font1'>
            <Box sx={{ width:'29px', height:'29px' , backgroundColor:'white' ,borderRadius:'14px', textAlign:"center" , marginRight:'5px'}}>
              <SystemSecurityUpdateOutlinedIcon sx={{ color:'rgb(0, 171, 105)', fontSize:"x-large", marginTop:'3px'  }}/></Box>
            Tải ứng dụng
          </Typography>
          <Typography variant="h6" component="div" sx={{  }}className='font'>
            <img src={logo} alt=""  className='logo'/>
          </Typography>
          <Typography variant="h6" component="div" sx={{ borderRadius:'20px', backgroundColor: 'white',
             color:'black', height:'33px' , width:'175px', display:'flex', justifyContent:'center', alignItems:'center', marginTop:'15px' }} className='font'>
            <AccountCircleIcon sx={{ color:'rgb(118, 127, 145)', marginRight:'10px', }}/>
            Đăng nhập/Đăng ký
          </Typography>
        </Box>
      </Toolbar>
      <TabContext value={value} >
          <TabList onChange={handleChange} centered className='menu2'  >
            <Tab label="TRANG CHỦ" value="1" className='button'  />
            <Tab label="LỊCH TRÌNH" value="2" className='button' />
            <Tab label="TRA CỨU VÉ" value="3" className='button' />
            <Tab label="ĐƠN HÀNG CỦA TÔI" value="4" className='button' />
            <Tab label="LIÊN HỆ" value="5" className='button' />
            <Tab label="VỀ CHÚNG TÔI" value="6" className='button' />
          </TabList>
        </TabContext>
      </AppBar>
       <AppBar
        sx={{
          backgroundColor:'white',
          boxShadow: 'none',
          position: 'sticky', // Đảm bảo nó dính đầu trang khi cuộn 
        }}
      >
        <Toolbar sx={{
            display: 'flex',
            flexDirection:'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%', // Chiều rộng 100% của AppBar
            height: 'auto', // Chiều cao của AppBar
            
          }} >      
          <Box sx={{ paddingTop: 2 , display:'flex', flexDirection:'column', justifyContent:'center', marginRight:'70px'}}>
        <TabContext value={value}>
    
          <TabPanel value="1" >
            <Content /> {/* Nội dung của Trang Chủ */}
          </TabPanel>
          <TabPanel value="2">
            <Typography sx={{color:'black'}}>Lịch Trình</Typography>
          </TabPanel>
          <TabPanel value="3">
            <Typography>Tra Cứu Vé</Typography>
          </TabPanel>
          <TabPanel value="4">
            <Typography>Đơn Hàng Của Tôi</Typography>
          </TabPanel>
          <TabPanel value="5">
            <Typography>Liên Hệ</Typography>
          </TabPanel>
          <TabPanel value="6">
            <Typography>Về Chúng Tôi</Typography>
          </TabPanel>
        </TabContext>
      </Box>

        </Toolbar>
      </AppBar> 

      
    </Box>
  );
};

export default HomePage;