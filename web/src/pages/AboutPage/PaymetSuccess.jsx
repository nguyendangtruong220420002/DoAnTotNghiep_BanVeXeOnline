/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import logo from "../../../public/images/logohome (2).png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import PaymentSucess from '../../../public/images/PaymentSucess.png'
import FmdGoodTwoToneIcon from '@mui/icons-material/FmdGoodTwoTone';
import LocalPhoneTwoToneIcon from '@mui/icons-material/LocalPhoneTwoTone';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';

const PaymetSuccess = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingId, setBookingId] = useState(null);
  const [bookingId2, setBookingId2] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataOfShowTrips, setDataOfShowTrips] = useState(null);
  const [InforCusto, setInforCusto] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('bookingId');
    const id2 = queryParams.get('bookingId2');
    const trips = queryParams.get('dataOfShowTrips');
    const customer = queryParams.get('InforCusto');

    // console.log("Raw Params from URL:");
    // console.log("bookingId:", id);
    // console.log("bookingId2:", id2);
    // console.log("dataOfShowTrips (raw):", trips);
    // console.log("InforCusto (raw):", customer);

    setBookingId(id);
    setBookingId2(id2);
    try {
      const parsedTrips = trips ? JSON.parse(decodeURIComponent(trips)) : null;
      const parsedCustomer = customer
        ? JSON.parse(decodeURIComponent(customer))
        : null;

      setDataOfShowTrips(parsedTrips);
      setInforCusto(parsedCustomer);
      // console.log("Decoded Params:");
      // console.log("dataOfShowTrips (parsed):", parsedTrips);
      // console.log("InforCusto (parsed):", parsedCustomer);
    } catch (error) {
      console.error("Lỗi khi giải mã hoặc parse JSON:", error);
    }
  }, [location]);
  useEffect(() => {
    const processPayment = async () => {
      try {
        if (bookingId) {
          const response = await axios.get(`${API_URL}/api/addPaymentRoute/success`, {
            params: { bookingId },
          });
          console.log(response.data);
          if (bookingId2) {
            const response2 = await axios.get(`${API_URL}/api/addPaymentRoute/success`, {
              params: { bookingId: bookingId2 },
            });
            console.log(response2.data);
          }
        } else {
          console.log("Không có bookingId, dừng lại.");
        }
      } catch (error) {
        console.error("Lỗi khi xử lý thanh toán:", error);
        setErrorMessage("Đã xảy ra lỗi khi xử lý yêu cầu thanh toán.");
      }
    };

    processPayment();
  }, [bookingId, bookingId2]);
 

  return (
    <Box sx={{ position: 'relative',backgroundColor:"rgb(250, 247, 247)" }}>
      <AppBar sx={{
        backgroundColor: '#e7e7e7',
        position: 'unset',
      }} >
        <Toolbar sx={{ height: '70px', boxShadow: '2px 2px 6px rgba(107, 106, 106, 0.1)', zIndex: 1 }} >
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }} className='menu1'>
            <Box component="img" src={logo} alt="" sx={{ width: '300px', height: '70px', marginTop: '3px' }} ></Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ position: 'relative', height: 'auto', display: 'flex', flexDirection: 'column', margin:'auto', justifyContent:'center',alignItems:'center' }}>
        <Box>
          <Box sx={{ width: '100%', height: 'auto', }}>
            <Box sx={{ width: '1000px', height: 'auto', alignItems: 'center', margin: 'auto', }}>
              <Box>
                
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '20px',margin:'auto', justifyContent:'center',alignItems:'center' }} >
                  <Box sx={{ display: 'flex', flexDirection: 'column', margin:'auto', justifyContent:'center',alignItems:'center' ,mt:5}}>
                    <Typography className='button61' sx={{ marginLeft: '18px', marginTop: '20px' }} >Thanh toán thành công</Typography>
                      <Typography className="button36" sx={{ marginLeft: '18px', marginTop: '10px' }} >
                      Vui lòng nhấn 
                      <a 
                        href="#" 
                        onClick={() => navigate('/', { state: { dataOfShowTrips, InforCusto } })} 
                        style={{ color: '#0456ca', marginRight:"3px",marginLeft:'3px'  }}
                      >
                        tiếp tục
                      </a> 
                      để quay lại.
                    </Typography>
                    <Box component="img" src={PaymentSucess} alt="" sx={{width:'650px', height:'450px', marginTop:'25px',mb:10,backgroundColor: 'transparent'}} ></Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{backgroundColor:"#fff7f5"}}>
          <Box sx={{ display:'flex', justifyContent:'space-around', width:'75%', marginLeft: '170px', marginTop:'50px' , marginBottom:'20p' }}>
            <Box sx={{ display:'flex', flexDirection:'column',marginTop:'30px'}}>
              <Box component="img" src={logo} alt="" sx={{width:'300px', height:'70px', marginTop:'3px'}} ></Box>
              <Typography className="button56">Website Bán Vé Xe Online là trang web  <br></br> đáng tin cậy để bạn tìm kiếm những vé xé <br></br>  chất lượng nhất!</Typography>
              <Box sx={{display:'flex',}}>
                    <FmdGoodTwoToneIcon sx={{color:'#dc635b', width:'15px', height:'20px', marginRight:'5px'}}></FmdGoodTwoToneIcon>
                    <Typography className="button55">12 Nguyễn Văn Bảo, F4, Q.Gò Vấp, Tp.Hồ Chí Minh</Typography>
              </Box>
              <Box sx={{display:'flex'}}>
                    <LocalPhoneTwoToneIcon sx={{color:'#dc635b',width:'15px', height:'20px',marginRight:'5px'}}></LocalPhoneTwoToneIcon>
                    <Typography className="button55" >0326923816</Typography>
              </Box>
              <Box sx={{display:'flex'}}>
                    <InventoryTwoToneIcon sx={{color:'#dc635b',width:'15px', height:'20px',marginRight:'5px'}}></InventoryTwoToneIcon>
                    <Typography className="button55">nguyendangtruong22042002@gmail.com </Typography>
              </Box>
            </Box>          
            <Box sx={{ display:'flex', flexDirection:'column',marginTop:'30px'}}>
              <Typography className="button53">Thông tin chung</Typography>
              <a href="#" className="button54">Điều Khoảng & Điều kiện</a>
              <a href="#" className="button54">Chính Sách Bảo Mật</a>
              <a href="#" className="button54">Liên Hệ Về Hợp Tác </a>
              <a href="#" className="button54">Nhà Xe Limosine</a>
              <a href="#" className="button54">Quy Chế</a>
            </Box>
            <Box sx={{ display:'flex', flexDirection:'column',marginTop:'30px'}}>
              <Typography className="button53">Hổ Trợ  </Typography>
              <a href="#" className="button54">Điều Khoảng Sử Dụng</a>
              <a href="#" className="button54">Câu Hỏi Thường Gặp</a>
              <a href="#" className="button54">Hợp Tác Với Doanh Nghiệp</a>
              <a href="#" className="button54">Ví Điện Tử</a>
            </Box>
            <Box sx={{ display:'flex', flexDirection:'column',marginTop:'30px'}}>
              <Typography className="button53">Liên hệ </Typography>
              <Typography className="button53-1">Thứ 2 - Chủ Nhật</Typography>
              <Typography className="button53-2">0326923816 - 0911513297</Typography>
              <Typography className="button53-3">08:00 - 22:00</Typography>             
            </Box>
          </Box>
        </Box>
        <Box sx={{backgroundColor:"#ff1100"}}><Typography sx={{textAlign:'center', color:'white', fontSize:'14px'}}> © 2024|Bản quyền thuộc về Nguyễn Đang Trường_20062481 & Phạm Sỹ Thái_20047921
|
Giảng Viên quản lý : Thầy Đặng Văn Thuận</Typography>
      </Box>

      
      
    </Box>
  );
};

export default PaymetSuccess;
