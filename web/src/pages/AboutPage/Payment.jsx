/* eslint-disable no-unused-vars */
import React ,  { useState, useEffect } from 'react';
import {Box, AppBar, Toolbar ,Typography, Button, Menu, MenuItem, TextField, Select, FormControl ,InputLabel,FormLabel,RadioGroup,FormControlLabel,Radio} from '@mui/material'
import logo from '../../../public/images/logohome (2).png';

import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useLocation } from 'react-router-dom';
import moment from "moment-timezone";
import axios from 'axios';



const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const InforCusto = location.state?.userInfo;
  const formDataCustoOfTrips = location.state?.formDataCustoOfTrips;
  const departureTime = location.state?.departureTime;
  const from = location.state?.from;
  const schedule = location.state?.schedule;
  const to = location.state?.to;
  const totalAmount = location.state?.totalAmount;  
  const SeatCode = location.state?.SeatCode;  
  const departure = location.state?.departure; 
  const destination = location.state?.destination; 
  const endTime = location.state?.endTime;
  const selectedSeats = location.state?.selectedSeats;
  const totalAmountAll = location.state?.totalAmountAll;
  const bookingId = location.state?.bookingId;
  const bookingID = location.state?.bookingID;
  
  

  const [paymentMethod, setPaymentMethod] = useState('Ví Zalopay');
  const API_URL = import.meta.env.VITE_API_URL;
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentTransactionId, setPaymentTransactionId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
 
  const initialTime = 5 * 60; 
  const [timeLeft, setTimeLeft] = useState(initialTime);
  useEffect(() => {
    if (timeLeft === 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }

    try {
      // Gửi yêu cầu thanh toán tới server
      const response = await axios.post(`${API_URL}/api/addPaymentRoute/add`, {
        bookingId,
        bookingID,
        paymentMethod,
        totalAmountAll,
        SeatCode,
      });

      // Kiểm tra kết quả trả về từ server
      if (response.data.checkoutUrl) {
        // Chuyển hướng người dùng đến URL thanh toán của PayOS
        window.location.href = response.data.checkoutUrl;
      } else {
        setPaymentStatus('Thanh toán thất bại');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Đã có lỗi xảy ra khi thanh toán.');
    }
  };
  

  return (
    <Box sx={{ position: 'relative', }}>
      <AppBar  sx={{ backgroundColor: '#e7e7e7',
          position: 'unset',  }} >
      <Toolbar sx={{height:'70px',boxShadow: '2px 2px 6px rgba(47, 46, 46, 0.5)', zIndex:1 }} >
        <Box sx={{ flexGrow: 1, display: 'flex',justifyContent:'space-between' }} className='menu1'>
       
              <Box component="img" src={logo} alt="" sx={{width:'300px', height:'70px', marginTop:'3px'}} ></Box>
              <Box sx={{height:'70px', marginTop:'12px',display: 'flex', paddingRight:'500px', alignContent:'center', justifyContent:'center'}}> 
                <Typography className='button39' sx={{ margin:'10px'}}>Thời gian thanh toán còn lại </Typography> <Typography  className='button49'>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</Typography>
              </Box>
        </Box>
      </Toolbar>
      </AppBar>
      <Box sx={{ position: 'relative', height: 'auto' }}> 
        <Box>
        <Box sx={{width:'100%', height:'auto', backgroundColor:'#f2f2f2'}}>
                <Box sx={{ width:'1000px', height:'auto', alignItems:'center', margin: 'auto' ,   }}>  
               
                <Box sx={{display:'flex' , justifyContent:'space-between' }} >
                  <Box sx={{display:'flex',flexDirection:'column',  marginTop:'20px'}} >
                    <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd", borderRadius:'10px', width:'620px',backgroundColor:'rgb(255, 255, 255)'}}> 
                        <Typography className='button35' sx={{marginLeft:'18px', marginTop:'20px' }} >Phương thức thanh toán <span style={{color:'red'}}>*</span></Typography>
                       
                        <FormControl sx={{ marginLeft: '18px', marginTop: '10px' }} component="fieldset">
                    
                        <RadioGroup
        value={paymentMethod}
        onChange={handlePaymentMethodChange} // Gọi handlePaymentMethodChange khi chọn phương thức
      >
        <FormControlLabel
          value="Chuyen khoan"
          control={<Radio />}
          label="Chuyển khoản"
        />
        <FormControlLabel
          value="Tien ma"
          control={<Radio />}
          label="Tiền mặt"
        />
      </RadioGroup>

      <button onClick={handlePayment}>Thanh toán</button>
                    </FormControl>     
                    </Box>
                   
                  </Box>
                    <Box>
                    <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd",borderRadius:'10px', width:'350px',backgroundColor:'rgb(255, 255, 255)',marginTop:'20px'}}> 
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
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Tuyến xe</Typography>
                                <Typography className='button38-3' sx={{fontSize:'15px',color:"#2b8276"}}> {departure} - {destination} </Typography>
                            </Box> 
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px'}}>
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Đón/trả</Typography>
                                <Typography className='button38-3' sx={{fontSize:'13px',}}> {from} - {to} </Typography>
                            </Box> 
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px'}}>
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Số lượng vé</Typography>
                                <Typography className='button38-3' sx={{fontSize:'15px',color:"#2b8276"}} > {selectedSeats.length === 0 ? "" : `${selectedSeats.length} Vé`} </Typography>
                            </Box> 
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px'}}>
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Số vé</Typography>
                                <Typography className='button38-3'sx={{fontSize:'15px'}}> {SeatCode},</Typography>
                            </Box>
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px', marginBottom:'20px'}}>
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Tổng tiền lượt đi</Typography>
                                <Typography className='button38-3' sx={{fontSize:'18px',color:"#2b8276"}}> {selectedSeats.length > 0 ? new Intl.NumberFormat('vi-VN', {style: 'currency',currency: 'VND',}).format(selectedSeats.length * totalAmount) : ""} </Typography>
                            </Box>        
                        </Box>
                        <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd",borderRadius:'10px', width:'350px',backgroundColor:'rgb(255, 255, 255)' ,marginTop:'15px',marginBottom:'20px'}}>                   
                        <Typography className='button35' sx={{marginLeft:'18px', marginTop:'20px' }} >Thông tin liên hệ <span style={{color:'red'}}>*</span></Typography>  
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px', }}>
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Khách hàng</Typography>
                                <Typography className='button38-1' sx={{fontSize:'15px',color:"#2b8276"}}> {formDataCustoOfTrips.fullName}</Typography>
                            </Box> 
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px'}}>
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Số điện thoại</Typography>
                                <Typography className='button38-1' sx={{fontSize:'13px',}}> {formDataCustoOfTrips.phoneNumber} </Typography>
                            </Box> 
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px', marginBottom:'20px'}}>
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Email</Typography>
                                <Typography className='button38-1' sx={{fontSize:'18px',color:"#2b8276"}}> {formDataCustoOfTrips.email}</Typography>
                            </Box>        
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{width:'100%', backgroundColor:'white' , }}>
                   <Box sx={{display:'flex', alignItems:'center', margin: 'auto', width:'1000px', height:'120px', justifyContent:'space-between'}}>
                          <Box sx={{display:'flex', flexDirection:"column"}}>
                          <Button sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd", borderRadius:'10px', width:'620px',backgroundColor:'#e66961', height:'50px'}}>
                          <Typography sx={{color:'white', textTransform:'none', textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', marginTop:'5px'}}>Đặt chỗ</Typography>
                            </Button>
                              <Typography className='button36' sx={{fontSize:'14.5px',textAlign:'center', marginTop:'10px'}}>Bằng việc nhấn nút Tiếp tục, bạn đồng ý với Chính sách bảo mật thanh toán và Quy chế</Typography>
                          </Box>
                    <Typography className='button36' sx={{width:'350px',backgroundColor:'rgb(255, 255, 255)',fontSize:'14px'}}>
                      Bạn sẽ sớm nhận được biển số xe, số điện thoại tài xế và dễ dàng thay đổi điểm đón trả sau khi đặt.</Typography>
                   </Box>
              
                    </Box>
                </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Payment;