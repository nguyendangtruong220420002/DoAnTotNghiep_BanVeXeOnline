/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Tab, Tabs, Button, Menu, MenuItem, } from '@mui/material'
import logo from '../../../public/images/logohome (2).png';
import shed from '../../../public/images/bus(3).png';
import user from '../../../public/images/user.png';
import '../HomePage/css/HomePage.css';
import PropTypes from 'prop-types';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Login from '../AboutPage/Login'
import Information from '../../../src/pages/AboutPage/Information';
import Divider from '@mui/material/Divider';
import loguot from '../../../public/images/log-out.png'
import history from '../../../public/images/history.png'
import information from '../../../public/images/information.png'
import profile from '../../../public/images/profile.png'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import RvHookupOutlinedIcon from '@mui/icons-material/RvHookupOutlined';
import EditRoadOutlinedIcon from '@mui/icons-material/EditRoadOutlined';
import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import AddBus from '../../../src/pages/Business/addBus';
import BusRoute from '../../../src/pages/Business/busRoute';
import Trips from '../../../src/pages/Business/Trips';
import Schedule from '../../../src/pages/Business/schedule';
import TicketManagement from '../../../src/pages/Business/TicketManagement';
import { useNavigate } from 'react-router-dom';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import Revenue from './Revenue';



const Business = () => {
  const [value, setValue] = useState("1");
  const [openLogin, setOpenLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [showMenuTuyenXe, setShowMenuTuyenXe] = useState(false);
  const [showMenuChuyenXe, setShowMenuChuyenXe] = useState(false);
  const [showMenuXe, setShowMenuXe] = useState(false);
  const [showMenuVeXe, setShowMenuVeXe] = useState(false);
  const [showMenuDoanhThu, setShowMenuDoanhThu] = useState(false);
  const [selectedTab, setSelectedTab] = useState('');
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
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
    navigate('/');
    handleCloseMenu();
    window.location.reload();
  };

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);

    if (tabName === 'tuyenXe') {
      setShowMenuTuyenXe((prev) => !prev);
    } else if (tabName === 'chuyenXe') {
      setShowMenuChuyenXe((prev) => !prev);
    } else if (tabName === 'xe') {
      setShowMenuXe((prev) => !prev);

    } else if (tabName === 'veXe') {
      setShowMenuVeXe((prev) => !prev);
    } else if (tabName === 'doanhThu') {
      setShowMenuDoanhThu((prev) => !prev);

    } else if (tabName === 'home') {
      setShowMenuTuyenXe(false);
      setShowMenuChuyenXe(false);
      setShowMenuXe(false);
    }
  };

  const handleMenuItemClick = (menuItem) => {
    if (menuItem === 'themTuyenXe') {
      setValue("3");
      setSelectedTab('tuyenXe');
    } else if (menuItem === 'danhSachTuyenXe') {
      setValue("4");
      setSelectedTab('tuyenXe');
    } else if (menuItem === 'danhSachChuyenXe') {
      setValue("6");
      setSelectedTab('chuyenXe');
    } else if (menuItem === 'themChuyenXe') {
      setValue("7");
      setSelectedTab('chuyenXe');
    }
    else if (menuItem === 'xe') {
      setValue("8");
      setSelectedTab('xe');
    }
    else if (menuItem === 'loaixe') {
      setValue("9");
      setSelectedTab('loaixe');
    }
    else if (menuItem === 'veXe') {
      setValue("10");
      setSelectedTab('veXe');
    }
    else if (menuItem === 'doanhThu') {
      setValue("11");
      setSelectedTab('doanhThu');
    }
    setSelectedSubMenu(menuItem);
  };
  const isTuyenXeActive = selectedTab === 'tuyenXe' || value === '3' || value === '4';
  const isChuyenXeActive = selectedTab === 'chuyenXe' || value === '6' || value === '7';
  const isXeActive = selectedTab === 'xe' || value === '8' || value === '9';
  const isVeXeActive = selectedTab === 'veXe' || value === '10';
  const isDoanhThuActive = selectedTab === 'doanhThu' || value === '11';
  const handleInfoClick = () => {
    setValue("5");
    handleCloseMenu();
  };
  const handleHistoryClick = () => {
    setValue("5");
    handleCloseMenu();
  };


  const handleChange = (event, newValue) => {
    setValue(newValue);

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
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '82%', position: 'absolute', left: '10px', zIndex: 1, marginTop: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', height: '50px', marginLeft: '260px', }}>
        {userInfo ? (
          <Box sx={{ display: 'flex', alignItems: 'center', }}>
            <Box
              component="img"
              src={userInfo.img || profile}
              sx={{ width: 40, height: 40, borderRadius: '50%' }}
            />
            <Button onClick={handleClickMenu}>
              <Typography className="button8" sx={{ position: 'relative', marginTop: '2px', }}>Nhà xe :</Typography>
              <Typography className="button10" sx={{ position: 'relative', marginTop: '3px' }}>{userInfo ? userInfo.fullName : 'Chưa có thông tin'}</Typography>
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
                <Typography className='button4' sx={{ marginLeft: '8px' }}> Thông tin cá nhân</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleHistoryClick} >
                <Box
                  component="img"
                  src={history}
                  sx={{ width: '30px', height: '30px' }}
                />
                <Typography className='button2' sx={{ marginLeft: '11px' }}> Lịnh sử mua vé</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Box
                  component="img"
                  src={loguot}
                  sx={{ width: '30px', height: '30px' }}
                />
                <Typography className='button2' sx={{ marginLeft: '11px' }}> Đăng xuất </Typography>
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
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '300px', borderLeft: '1px solid #737373', padding: '10px', borderRadius: '1px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <TabContext value={value} >
            <TabList onChange={handleChange} orientation="vertical" className='tab2' sx={{ marginTop: '10px' }} >
              <Typography sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Box component="img" src={logo} alt="" sx={{ width: '100px', height: '50px', marginTop: '12px', }} ></Box>
                <Box component='img' src={shed} sx={{ width: '70px', height: '70px' }}></Box>
              </Typography>

              <Tab label={<Box sx={{ position: 'relative', marginTop: '5px', marginLeft: '3px' }}>Trang Chủ</Box>}
                value="1"
                className='button9'
                iconPosition="start"
                sx={{ display: 'flex', justifyContent: 'left', minHeight: 0, borderBottom: '1px solid #f0eded', paddingBottom: '20px' }}
                icon={<HomeOutlinedIcon></HomeOutlinedIcon>}
                onClick={() => handleTabClick('home')}>
              </Tab>

              <Typography sx={{ marginLeft: "20px", fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', fontSize: '14px', marginTop: '20px' }}>CHUNG </Typography>
              <Tab
                label={
                  <Box sx={{ display: 'flex', marginTop: '3px', marginLeft: '3px' }}>
                    <div style={{ marginTop: '4px' }}>Quản lý Tuyến xe &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    {showMenuTuyenXe ? <ExpandMoreOutlinedIcon sx={{ width: '23px' }} /> : <KeyboardArrowUpOutlinedIcon sx={{ width: '23px' }} />}
                  </Box>
                }
                className={isTuyenXeActive ? "button11 active" : "button11"}
                iconPosition="start"
                onClick={() => handleTabClick('tuyenXe')}
                sx={{ display: 'flex', justifyContent: 'left', minHeight: 0 }}
                icon={<RvHookupOutlinedIcon sx={{ marginLeft: '10px' }} />}
              />
              {showMenuTuyenXe && (
                <>

                  <Tab
                    label="Thông tin Tuyến xe"
                    className={`button12 ${selectedSubMenu === 'themTuyenXe' ? 'active' : ''}`}
                    onClick={() => handleMenuItemClick('themTuyenXe')}
                    sx={{ minHeight: 0, marginRight: '5px' }}
                    iconPosition="start"
                    icon={<PlaylistAddOutlinedIcon sx={{ width: '20px' }}></PlaylistAddOutlinedIcon>}
                  />
                </>
              )}

              <Tab
                label={
                  <Box sx={{ position: 'relative', marginTop: '3px', marginLeft: '3px', display: 'flex' }}>
                    <div style={{ marginTop: '4px' }}>Quản lý Chuyến xe &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    {showMenuChuyenXe ? <ExpandMoreOutlinedIcon sx={{ width: '23px' }} /> : <KeyboardArrowUpOutlinedIcon sx={{ width: '23px' }} />}
                  </Box>
                }
                className={isChuyenXeActive ? "button11 active" : "button11"}
                iconPosition="start"
                onClick={() => handleTabClick('chuyenXe')}
                sx={{
                  display: 'flex',
                  justifyContent: 'left',
                  minHeight: 0,
                }}
                icon={<EditRoadOutlinedIcon sx={{ marginLeft: '10px' }} />}
              />

              {showMenuChuyenXe && (
                <>
                  <Tab
                    label="Thông tin chuyến xe"
                    className={`button12 ${selectedSubMenu === 'themChuyenXe' ? 'active' : ''}`}
                    onClick={() => handleMenuItemClick('themChuyenXe')}
                    sx={{ minHeight: 0, }}
                    iconPosition="start"
                    icon={<PlaylistAddOutlinedIcon sx={{ width: '20px' }} />}
                  />
                  <Tab
                    label="Lịch trình cho chuyến xe"
                    className={`button12 ${selectedSubMenu === 'danhSachChuyenXe' ? 'active' : ''}`}
                    onClick={() => handleMenuItemClick('danhSachChuyenXe')}
                    sx={{ minHeight: 0, marginLeft: '25px' }}
                    iconPosition="start"
                    icon={<FormatListBulletedOutlinedIcon sx={{ width: '20px' }} />}
                  />
                </>
              )}

              <Tab
                label={
                  <Box sx={{ position: 'relative', marginTop: '3px', marginLeft: '3px', display: 'flex' }}>
                    <div style={{ marginTop: '4px' }}>Quản lý Xe &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    {showMenuXe ? <ExpandMoreOutlinedIcon sx={{ width: '23px' }} /> : <KeyboardArrowUpOutlinedIcon sx={{ width: '23px' }} />}
                  </Box>
                }
                className={isXeActive ? "button11 active" : "button11"}
                iconPosition="start"
                onClick={() => handleTabClick('xe')}
                sx={{
                  display: 'flex',
                  justifyContent: 'left',
                  minHeight: 0,
                  marginTop: '5px',
                  backgroundColor: selectedTab === 'xe' ? 'red' : 'transparent',
                }}
                icon={<DirectionsBusFilledOutlinedIcon sx={{ marginLeft: '10px' }} />}
              />
              {showMenuXe && (
                <>
                  <Tab
                    label="Thông tin xe&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                    className={`button12 ${selectedSubMenu === 'xe' ? 'active' : ''}`}
                    onClick={() => handleMenuItemClick('xe')}
                    sx={{ minHeight: 0, marginLeft: '20px' }}
                    iconPosition="start"
                    icon={<FormatListBulletedOutlinedIcon sx={{ width: '20px' }} />}
                  />
                </>
              )}
              <Tab
                label={
                  <Box sx={{ display: 'flex', marginTop: '3px', marginLeft: '3px' }}>
                    <div style={{ marginTop: '4px' }}>Quản lý Vé xe&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    {showMenuVeXe ? <ExpandMoreOutlinedIcon sx={{ width: '23px' }} /> : <KeyboardArrowUpOutlinedIcon sx={{ width: '23px' }} />}
                  </Box>
                }
                className={isVeXeActive ? "button11 active" : "button11"}
                iconPosition="start"
                onClick={() => handleTabClick('veXe')}
                sx={{ display: 'flex', justifyContent: 'left', minHeight: 0 }}
                icon={<TuneRoundedIcon sx={{ marginLeft: '10px' }} />}
              />
              {showMenuVeXe && (
                <>
                  <Tab
                    label="Thông tin Vé xe&nbsp;"
                    className={`button12 ${selectedSubMenu === 'veXe' ? 'active' : ''}`}
                    onClick={() => handleMenuItemClick('veXe')}
                    sx={{ minHeight: 0, marginRight: '5px' }}
                    iconPosition="start"
                    icon={<ConfirmationNumberRoundedIcon sx={{ width: '20px' }}></ConfirmationNumberRoundedIcon>}
                  />
                </>
              )}
              <Tab
                label={
                  <Box sx={{ display: 'flex', marginTop: '3px', marginLeft: '3px' }}>
                    <div style={{ marginTop: '4px' }}>Quản lý Doan Thu&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    {setShowMenuDoanhThu ? <ExpandMoreOutlinedIcon sx={{ width: '23px' }} /> : <KeyboardArrowUpOutlinedIcon sx={{ width: '23px' }} />}
                  </Box>
                }
                className={isDoanhThuActive ? "button11 active" : "button11"}
                iconPosition="start"
                onClick={() => handleTabClick('doanhThu')}
                sx={{ display: 'flex', justifyContent: 'left', minHeight: 0 }}
                icon={<TuneRoundedIcon sx={{ marginLeft: '10px' }} />}
              />
              {showMenuDoanhThu && (
                <>
                  <Tab
                    label="Thông tin Tuyến xe&nbsp;"
                    className={`button12 ${selectedSubMenu === 'doanhThu' ? 'active' : ''}`}
                    onClick={() => handleMenuItemClick('doanhThu')}
                    sx={{ minHeight: 0, marginRight: '5px' }}
                    iconPosition="start"
                    icon={<AssessmentOutlinedIcon sx={{ width: '20px' }}></AssessmentOutlinedIcon>}
                  />
                </>
              )}
            </TabList>

          </TabContext>
        </Box>
        <Box sx={{ position: 'relative', height: 'auto', width: '100%', marginTop: '60px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
          <Box >
            <TabContext value={value} >
              <TabPanel value="1" sx={{
                padding: 0,
                margin: 0,
                boxSizing: 'border-box',
              }}>
              </TabPanel >
              <TabPanel value="2">
                <Typography></Typography>
                <Button onClick={handleOpenModal}>Mở modal</Button>
              </TabPanel>
              <TabPanel value="3">
                <BusRoute userInfo={userInfo} setUserInfo={setUserInfo}></BusRoute>
              </TabPanel>
              <TabPanel value="4">
              </TabPanel>
              <TabPanel value="5">
                <Information onLogout={handleLogout} userInfo={userInfo} setUserInfo={setUserInfo} />
              </TabPanel>
              <TabPanel value="6">
                <Schedule userInfo={userInfo} setUserInfo={setUserInfo}></Schedule>
              </TabPanel>
              <TabPanel value="7">
                <Trips userInfo={userInfo} setUserInfo={setUserInfo}></Trips>
              </TabPanel>
              <TabPanel value="8">
                <AddBus userInfo={userInfo} setUserInfo={setUserInfo} ></AddBus>
              </TabPanel>
              <TabPanel value="9">
                <Typography>Quản lý </Typography>
              </TabPanel>
              <TabPanel value="10">
                <TicketManagement userInfo={userInfo} setUserInfo={setUserInfo} ></TicketManagement>
              </TabPanel>
              <TabPanel value="11">
                <Revenue userInfo={userInfo} setUserInfo={setUserInfo} > </Revenue>
              </TabPanel>

            </TabContext>
          </Box>
        </Box>
      </Box>
      <Login open={openLogin} handleClose={handleCloseLogin} setUserInfo={setUserInfo} />
    </Box>
  );
};
Information.propTypes = {
  onLogout: PropTypes.func.isRequired,
  userInfo: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
};
export default Business;