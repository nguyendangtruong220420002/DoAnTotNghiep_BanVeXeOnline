/* eslint-disable no-unused-vars */
import React ,  { useState, useEffect } from 'react';
import {Box, AppBar, Toolbar ,Typography, Button, FormControl , Divider,RadioGroup,FormControlLabel,Radio} from '@mui/material'
import logo from '../../../public/images/logohome (2).png';

import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useLocation } from 'react-router-dom';
import moment from "moment-timezone";
import axios from 'axios';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import pay from '../../../public/images/pay.png'



const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
 
  const InforCusto = location.state?.userInfo;
  const dataOfShowTrips = location.state?.dataOfShowTrips;
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
  const business = location.state?.business;  
  const { tripType } = dataOfShowTrips || {};
  const bookingId2 = location.state?.bookingId2;
  
 //console.log("bookingId2",bookingId2);
// console.log("dataOfShowTrips",dataOfShowTrips);
const departure2 = location.state?.departure2;
const selectedSeats2 = location.state?.selectedSeats2;
const destination2 = location.state?.destination2;
const SeatCode2 = location.state?.SeatCode2;
const from2 = location.state?.from2;
const to2 = location.state?.to2;
const totalAmountAllTowTrips = location.state?.totalAmountAllTowTrips;
//console.log("totalAmountAllTowTrips",totalAmountAllTowTrips)


  const [paymentMethod, setPaymentMethod] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;
  const [paymentStatus, setPaymentStatus] = useState('');
  
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
 
  const formattedTotalAmountAllTowTrips = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(totalAmountAllTowTrips);  
  
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
      const response = await axios.post(`${API_URL}/api/addPaymentRoute/add`, {
        bookingId,
        bookingId2,
        bookingID,
        paymentMethod,
        totalAmountAllTowTrips,
        SeatCode,
        business,
        dataOfShowTrips,
        InforCusto,
      });

      if (response.data.checkoutUrl) {
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
                        onChange={handlePaymentMethodChange} 
                      >
                        <FormControlLabel
                      
                          value="Chuyen khoan"
                          control={<Radio />}
                          label={
                            <>
                            <Box sx={{display:'flex'}}> <QrCodeRoundedIcon style={{ marginRight: 8, color:'#647280' }} /> {/* Icon ở bên trái */}
                            <Typography className='button38-4'> Chuyển khoản / Ví điện tử</Typography></Box>
                            </>
                          }
                        />
                        <Divider sx={{width:'590px', marginBottom:'10px',marginTop:'10px'}}></Divider>
                        <FormControlLabel
                          value="Tien ma"
                          control={<Radio disabled  />}
                          label={
                            <>
                            <Box sx={{display:'flex'}}>  <Box component="img" src={pay} alt="" sx={{width:'22px', height:'20px', marginTop:'4px', marginRight: 1}} ></Box>
                            <Typography className='button38-5'> Tiền mặt (Tạm thời không nhận tiền mặt. Xin lỗi vì sự bất tiện này)</Typography></Box>
                            </>
                          }
                        />
                      </RadioGroup>
                    </FormControl>     
                    </Box>      
                  </Box>
                    <Box>
                    <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd",borderRadius:'10px', width:'350px',backgroundColor:'rgb(255, 255, 255)',marginTop:'20px'}}> 
                        <Box sx={{display:'flex', justifyContent:'space-between',alignItems:'center'}}> 
                          <Typography className='button35' sx={{marginLeft:'18px', marginTop:'20px' }} >Tạm tính <span style={{color:'red'}}>*</span></Typography>     
                           <Typography className='button35-5' sx={{ marginTop:'20px', marginRight:'20px' }} > {formattedTotalAmountAllTowTrips}  </Typography> 
                        </Box>
                        {tripType !== 'Khứ hồi' && (
                        <Box sx={{display:'flex', marginRight:'20px',justifyContent:'space-between', marginBottom:'20px'}}> 
                          <Typography className='button38' sx={{marginLeft:'20px', }}>Giá vé</Typography>  
                          <Box sx={{display:'flex',flexDirection:'column', justifyContent:'space-between',alignItems:'flex-end'}}>
                              <Box sx={{display:'flex', justifyContent:'flex-end' }}>
                                <Typography className='button38-1'> {selectedSeats.length > 0 ? new Intl.NumberFormat('vi-VN', {style: 'currency',currency: 'VND',}).format(selectedSeats.length * totalAmount) : ""}   </Typography> 
                                <Typography className='button38-1'> &nbsp;x {selectedSeats.length === 0 ? "" : `${selectedSeats.length}`}</Typography> 
                              </Box>  
                          <Typography className='button38-2'> Mã ghế/giường:  {SeatCode}</Typography>
                          </Box>
                         
                        </Box>     
                        )}               
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
                      
                       {tripType === 'Khứ hồi' && (
                      <Box sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd",borderRadius:'10px', width:'350px',backgroundColor:'rgb(255, 255, 255)' ,marginTop:'15px'}}>                   
                        <Typography className='button35' sx={{marginLeft:'18px', marginTop:'20px' }} >Thông tin chuyến về  <span style={{color:'red'}}>*</span></Typography>  
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px', }}>
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Tuyến xe</Typography>
                                <Typography className='button38-3' sx={{fontSize:'15px',color:"#2b8276"}}> {departure2} - {destination2} </Typography>
                            </Box> 
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px'}}>
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Đón/trả</Typography>
                                <Typography className='button38-3' sx={{fontSize:'13px',}}> {from2} - {to2} </Typography>
                            </Box> 
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px'}}>
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Số lượng vé</Typography>
                                <Typography className='button38-3' sx={{fontSize:'15px',color:"#2b8276"}} > {selectedSeats2.length === 0 ? "" : `${selectedSeats2.length} Vé`} </Typography>
                            </Box> 
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px'}}>
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Số vé</Typography>
                                <Typography className='button38-3'sx={{fontSize:'15px'}}> {SeatCode2},</Typography>
                            </Box>
                            <Box sx={{display:'flex', justifyContent:'space-between' , marginLeft:'20px', marginRight:'20px',marginTop:'5px', marginBottom:'20px'}}>
                                <Typography className='button38' sx={{color:'#647280',fontSize:'15px'}}> Tổng tiền lượt đi</Typography>
                                <Typography className='button38-3' sx={{fontSize:'18px',color:"#2b8276"}}> {selectedSeats2.length > 0 ? new Intl.NumberFormat('vi-VN', {style: 'currency',currency: 'VND',}).format(selectedSeats2.length * totalAmount) : ""} </Typography>
                            </Box>        
                      </Box>
                       )}
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
                          <Button  onClick={handlePayment}
                          disabled={!paymentMethod} 
                          sx={{display:'flex',flexDirection:'column', border: "1px solid #ddd", borderRadius:'10px', width:'620px',
                   
                           backgroundColor: paymentMethod ? '#e66961' : '#d2d2d2',
                          height:'50px'}}>
                          <Typography sx={{
                            color: paymentMethod ?'white' : 'black', 
                            textTransform:'none', textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', marginTop:'5px'}}>
                            
                            {paymentMethod ? 'Thanh toán' : 'Chọn phương thức thanh toán'}
                            </Typography>
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