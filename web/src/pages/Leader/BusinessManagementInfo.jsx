/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Button,
  TextField,IconButton
} from "@mui/material";
import PropTypes from "prop-types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as XLSX from 'xlsx';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import LocalPrintshopTwoToneIcon from '@mui/icons-material/LocalPrintshopTwoTone';


const BusinessManagementInfo = ({ userInfo }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState([]);
  const [buses, setBuses] = useState([]);
  const [busRoutes, setBusRoutes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [totalPrice, settotalPrice] = useState([]);

  const [month, setMonth] = useState('');
  const [date, setDate] = useState('');
  const [year, setYear] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [chartData, setChartData] = useState([]);
    const [years, setYears] = useState([]);
    const [bookingInfo, setBookingInfo] = useState([]);
    const [seatQuantity, setSeatQuantity] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [filteredBookings, setFilteredBookings] = useState([]);
  useEffect(() => {
    // Log các state sau khi chúng được cập nhật
    console.log("Users:", user);
    console.log("Buses:", buses);
    console.log("Bus Routes:", busRoutes);
    console.log("Trips:", trips);
    console.log("totalPrice:", totalPrice);
  }, [user, buses, busRoutes, trips, bookings])

  const [selectedUserId, setSelectedUserId] = useState(""); 
  const [selectedUserStats, setSelectedUserStats] = useState({
    totalBuses: 0,
    totalRoutes: 0,
    totalTrips: 0,
    totalBookings: 0,
    totalAmount: 0,
  });
  const generateYearRange = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 10;
    const yearRange = [];

    for (let year = startYear; year <= endYear; year++) {
        yearRange.push(year.toString());
    }

    setYears(yearRange);
};
  const fetchUserList = async () => {
   
    try {
      const response = await fetch(`${API_URL}/api/users/get-user-by-admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        console.error("Error:", response.statusText);
        return;
      }
  
      const data = await response.json();
      if (!data.users) {
        console.error("Không tìm thấy user.");
        return;
      }
      const businessUsers = data.users.filter(user => user.role === "Business");
      setUser(businessUsers);
      setBuses(data.buses || []);
      setBusRoutes(data.busRoutes || []);
      setTrips(data.trips || []);

      const totalPriceBookings = (data.bookings || []).filter(
        booking => booking.paymentStatus === "Đã thanh toán" && booking.tripId
      );
      settotalPrice(totalPriceBookings);
      const paidBookings = (data.bookings || []).filter(
        booking => booking.paymentStatus === "Đã thanh toán" && booking.tripId
      );
      const userBooking = paidBookings.flatMap(booking => {
        const seatIds = Array.isArray(booking.seatId)
          ? booking.seatId
          : booking.seatId.split(",").map(seat => seat.trim());
        return seatIds.map(seat => ({ ...booking, seatId: seat }));
      });
      setBookings(userBooking);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchUserList();
    generateYearRange();
  }, []);
  const handleUserChange = (event) => {
  setMonth("");  
  setDate("");   
  setYear("");  
  setFilteredBookings([]); 
  setSeatQuantity(0);  
  setTotalRevenue(0);

    const selectedUserId = event.target.value;
    setSelectedUserId(selectedUserId);
    const userBuses = buses.filter((bus) => bus.userId === selectedUserId);
    const userRoutes = busRoutes.filter((route) => route.userId === selectedUserId);
    const userTrips = trips.filter((trip) => trip.userId === selectedUserId);
    const userBookings = bookings.filter((booking) => booking.tripId.userId === selectedUserId);
    const calculateTotalAmount = (bookings, selectedUserId) => {
      const totalBooking = totalPrice.filter((booking) => booking.tripId.userId === selectedUserId);
      const totalAmount = totalBooking.reduce((total, booking) => {
        return total + booking.totalFare; 
      }, 0); 
      return totalAmount;
    };

    const totalBuses = userBuses.length;
    const totalRoutes = userRoutes.length;
    const totalTrips = userTrips.length;
    const totalBookings = userBookings.length;
    const totalAmount = calculateTotalAmount(bookings, selectedUserId); 
    console.log("totalAmount",totalAmount)

    setSelectedUserStats({
      totalBuses,
      totalRoutes,
      totalTrips,
      totalBookings,
      totalAmount,
    });
  };
  const resetFilters = () => {
  setMonth("");  
  setDate("");   
  setYear("");  
  setFilteredBookings([]); 
  setSeatQuantity(0);  
  setTotalRevenue(0); 
};
  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear); 
    setMonth("");              
    setDate("");          
    const filteredBookings = bookings.filter((booking) => {
      const bookingYear = new Date(booking.bookingDate).getFullYear();
      return bookingYear === parseInt(selectedYear);
    });
    const filteredUserBookings = filteredBookings.filter((booking) => booking.tripId.userId === selectedUserId);
    const updatedSeatQuantity = filteredUserBookings.reduce((total, booking) => 
      total + (booking.seatId.includes(',') ? booking.seatId.split(',').length : 1), 0
    );
    const totalFiltered = totalPrice.filter((booking) => {
      const bookingYear = new Date(booking.bookingDate).getFullYear();
      return bookingYear === parseInt(selectedYear);
    });
    const totalUserBookings = totalFiltered.filter((booking) => booking.tripId.userId === selectedUserId);
    const updatedTotalRevenue = totalUserBookings.reduce((sum, booking) => 
      sum + booking.totalFare, 0
    );
    setFilteredBookings(totalUserBookings);
    setSeatQuantity(updatedSeatQuantity);
    setTotalRevenue(updatedTotalRevenue);
     calculateMonthlyData(totalUserBookings, selectedYear);

  };
const calculateMonthlyData = (bookings, selectedYear) => {
    const monthlyData = Array(12).fill(0).map((_, index) => ({
        month: `Tháng ${index + 1}`,
        revenue: 0,
        tickets: 0,
    }));
    if (!selectedYear) {
        selectedYear = currentYear;
    }
    bookings.forEach((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        const bookingYear = bookingDate.getFullYear();
        const bookingMonth = bookingDate.getMonth(); 
        console.log(`Booking year: ${bookingYear}, Selected year: ${selectedYear}`); 
        if (bookingYear === parseInt(selectedYear)) {
            const monthIndex = bookingMonth;
            monthlyData[monthIndex].revenue += booking.totalFare;
            monthlyData[monthIndex].tickets += booking.seatId.includes(",") ? booking.seatId.split(",").length : 1;
        }
    });
    console.log("Monthly Data:", monthlyData); 
    if (monthlyData.every(data => data.revenue === 0 && data.tickets === 0)) {
        setChartData([]); 
    } else {
        setChartData(monthlyData); 
    }
};
const handleMonthChange = (e) => {
  const selectedMonth = e.target.value;
  setMonth(selectedMonth); 
  setYear("");               
  setDate("");           

  const filteredBookings = bookings.filter((booking) => {
    const bookingMonth = booking.bookingDate.slice(0, 7); 
    return bookingMonth === selectedMonth;
  });
  const filteredUserBookings = filteredBookings.filter((booking) => booking.tripId.userId === selectedUserId);
  const updatedSeatQuantity = filteredUserBookings.reduce((total, booking) => 
    total + (booking.seatId.includes(',') ? booking.seatId.split(',').length : 1), 0
  );
  const totalFiltered = totalPrice.filter((booking) => {
    const bookingMonth = booking.bookingDate.slice(0, 7);
    return bookingMonth === selectedMonth;
  });
  const totalUserBookings = totalFiltered.filter((booking) => booking.tripId.userId === selectedUserId);
  const updatedTotalRevenue = totalUserBookings.reduce((sum, booking) => 
    sum + booking.totalFare, 0
  );

  setFilteredBookings(filteredUserBookings);
  setSeatQuantity(updatedSeatQuantity);
  setTotalRevenue(updatedTotalRevenue);
};

const handleDateChange = (e) => {
  const selectedDate = e.target.value;
  setDate(selectedDate); 
  setYear(""); 
  setMonth("");
  const filteredBookings = bookings.filter((booking) => booking.bookingDate.slice(0, 10) === selectedDate);
  const filteredUserBookings = filteredBookings.filter((booking) => booking.tripId.userId === selectedUserId);
  const updatedSeatQuantity = filteredUserBookings.reduce((total, booking) => 
    total + (booking.seatId.includes(',') ? booking.seatId.split(',').length : 1), 0);

  const Total = totalPrice.filter((booking) => booking.bookingDate.slice(0, 10) === selectedDate);
  const TotalUserBookings = Total.filter((booking) => booking.tripId.userId === selectedUserId);

  const updatedTotalRevenue = TotalUserBookings.reduce((sum, booking) => 
    sum + booking.totalFare, 0);
  setFilteredBookings(filteredUserBookings);
  setSeatQuantity(updatedSeatQuantity);
  setTotalRevenue(updatedTotalRevenue);
};

const exportToExcel = () => {
    const data = chartData.length > 0 ? chartData.map(item => ({
        Month: item.month,
        Revenue: item.revenue,
        Tickets: item.tickets,
    })) : Array.from({ length: 12 }, (_, i) => ({
        Month: `Month ${i + 1}`,
        Revenue: 0,
        Tickets: 0,
    }));

    const totalRevenue = data.reduce((sum, item) => sum + item.Revenue, 0);
    const totalTickets = data.reduce((sum, item) => sum + item.Tickets, 0);
    data.push({
        Month: 'Tổng doanh thu',
        Revenue: totalRevenue,
        Tickets: totalTickets,
    });

    const ws = XLSX.utils.json_to_sheet(data); 
    const wb = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(wb, ws, `Doanh thu năm ${year || currentYear}`);  

    const selectedUser = user.find(userItem => userItem._id === selectedUserId);
    const selectedUserName = selectedUser ? selectedUser.fullName : "Unknown User";
    XLSX.writeFile(wb, `Bao_cao_doanh_thu_nam_cua_tung_Nha_Xe_${selectedUserName}_${year || currentYear}.xlsx`);
};

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{display:'flex'}}>
      <Box
        sx={{
          borderRadius: "10px",
          border: "1px solid #e5e5e5",
          padding: "10px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          width:'40%',
          mr:4
        }}
      >
        <Typography sx={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}> Chọn nhà xe</Typography>
        <Box>
          <Box sx={{ margin: "10px",display: "flex",}}>
        
          <Box sx={{ ml:2 ,}}>
          <Typography sx={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", mb:1.5}}> Hiện tại có {user.length} Nhà xe</Typography>
            <FormControl size="small" sx={{ width: "200px" }}>
              <InputLabel
                sx={{
                  color: "#706966",
                  fontSize: "13px",
                  "&.Mui-focused": {
                    color: "#ed6c02",
                  },
                }}
              >
                Các nhà xe
              </InputLabel>
              <Select
                name="role"
                label="Trạng thái"
                color="warning"
                sx={{
                  fontSize: "16px",width:'350px',
                  mr: 2,
                  backgroundColor: "#fef3f0",
                  "&.Mui-focused": {
                    backgroundColor: "white",
                    boxShadow: "0 0 0 2px rgb(255, 224, 212)",
                  },
                }}
                value={selectedUserId}
                onChange={handleUserChange}
              >
                {user.map((userItem, index) => (
                <MenuItem key={index} value={userItem._id}> 
                  {userItem.fullName}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
          </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{
          borderRadius: "10px",
          border: "1px solid #e5e5e5",
          padding: "10px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          width:'50%'
        }}>
           <Typography sx={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>Thống kế tổng số lượng của từng nhà xe cho đến hiện tại</Typography>
           <Box sx={{width:'550px', m:1,ml:4}}>
          
        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid #e5e5e5",
            marginTop: "10px",
            maxHeight: "450px",
            overflowY: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "center" ,fontWeight:'bold' }}> Xe</TableCell>
                <TableCell sx={{ textAlign: "center",fontWeight:'bold'  }}> Tuyến xe</TableCell>
                <TableCell sx={{ textAlign: "center" ,fontWeight:'bold' }}> Chuyến xe</TableCell>
                <TableCell sx={{ textAlign: "center",fontWeight:'bold'  }}> Vé bán</TableCell>
                <TableCell sx={{ textAlign: "center" ,fontWeight:'bold' }}>Tổng giá tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {selectedUserId ? (
                  <TableRow >
                    
                    <TableCell sx={{ textAlign: "center" }}>
                    {selectedUserStats.totalBuses}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                    {selectedUserStats.totalRoutes}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                    {selectedUserStats.totalTrips}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center"  ,fontWeight:'bold' , }}>
                    {selectedUserStats.totalBookings}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" ,fontWeight:'bold'  ,fontSize:'16px'}}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedUserStats.totalAmount)}
                    </TableCell>
                  </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                    Không có thông tin
                  </TableCell>
                </TableRow>
              )}
              
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
        </Box>
         </Box>
      
      <Box
        sx={{
          borderRadius: "10px",
          border: "1px solid #e5e5e5",
          padding: "10px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          marginTop: "15px",
        }}
      >
      <Typography sx={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" ,mb:1.5}}>Doanh thu của từng nhà xe theo</Typography>
                <TextField
                    color="warning"
                    label="Lọc theo ngày"
                    variant="outlined"
                    size="small"
                    sx={{ width: '250px', mr:2 ,mb :2}}
                    name="date"
                    type="date"
                    value={date} 
                    onChange={handleDateChange} 
                    InputProps={{
                        sx: {
                            fontSize: '13px',
                            backgroundColor: '#fef3f0',
                            '&.Mui-focused': {
                                backgroundColor: 'white',
                                boxShadow: '0 0 0 2px rgb(255, 224, 212)',
                            },
                        },
                    }}
                    InputLabelProps={{
                        shrink: true,
                        sx: {
                            fontSize: '13px',
                        },
                    }}
                />
                <TextField
                    color="warning"
                    label="Lọc theo tháng"
                    variant="outlined"
                    size="small"
                    sx={{ width: '250px' , mr:2 }}
                    name="month"
                    type="month"
                    value={month}
                    onChange={handleMonthChange}
                    InputProps={{
                        sx: {
                            fontSize: '13px',
                            backgroundColor: '#fef3f0',
                            '&.Mui-focused': {
                                backgroundColor: 'white',
                                boxShadow: '0 0 0 2px rgb(255, 224, 212)',
                            },
                            inputProps: {
                                min: 0,
                            },
                        },
                    }}
                    InputLabelProps={{
                        shrink: true,
                        sx: {
                            fontSize: '13px',
                        },
                    }}
                />

                <TextField
                    select
                    label="Lọc theo năm"
                    variant="outlined"
                    name="year"
                    value={year}
                    onChange={handleYearChange}
                    size="small"
                    color="warning"
                    InputProps={{
                        sx: {
                            fontSize: '13px',
                            backgroundColor: '#fef3f0',
                            width: '210px',
                            height: '36px',
                            '&.Mui-focused': {
                                backgroundColor: 'white',
                                boxShadow: ' 0 0 0 2px rgb(255, 224, 212)',
                            },
                        },
                    }}
                    InputLabelProps={{
                        sx: {
                            fontSize: '13px',
                        },
                    }}
                >
                    {years.map((year) => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
                </TextField>
               
                  <IconButton 
              sx={{
                color: '#F44336',
                textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', 
                borderRadius: '50px', ml:3,
                height: '30px', 
                '&:hover': { color: '#313731' } 
              }}
              onClick={resetFilters}
            >
              <DeleteForeverOutlinedIcon sx={{ width: '40px', height:'35px'}} />
            </IconButton>
            <IconButton 
              sx={{
                color: '#46b70d',
                textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)', 
                borderRadius: '50px', 
                height: '30px', 
                '&:hover': { color: '#313731' } 
              }}
              onClick={exportToExcel}
            >
              <LocalPrintshopTwoToneIcon sx={{ width: '40px', height:'35px', }} />
            </IconButton>
            <Box sx={{display:'flex'}}>
            <TableContainer
          component={Paper}
          sx={{
            border: "1px solid #e5e5e5",
            marginTop: "10px",
            maxHeight: "110px",
            maxWidth: "250px",
            overflowY: "auto",
            mr:3
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "center" , fontWeight:'bold'}}> Vé bán</TableCell>
                <TableCell sx={{ textAlign: "center",fontWeight:'bold' }}>Tổng giá tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredBookings.length > 0 ? (
                  <TableRow >
                    <TableCell sx={{ textAlign: "center" ,fontWeight:'bold'  ,fontSize:'16px'}}>
                    {seatQuantity} 
                    </TableCell >
                    <TableCell sx={{ textAlign: "center",fontWeight:'bold'  ,fontSize:'16px'}}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)} {/* Tổng giá tiền */}
                    </TableCell >
                
                  </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                    Không tìm thấy thông tin... Vui lòng lọc lại !!!
                  </TableCell>
                </TableRow>
              )}
              
            </TableBody>
          </Table>
        </TableContainer>
            <Box sx={{ display: "flex", width: "900px", alignItems: "center", justifyContent: "space-between" }}>
              
            <ResponsiveContainer width="50%" height={400}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis orientation="left" dataKey='revenue' />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu" />

                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="50%" height={400}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis orientation="right" dataKey="tickets" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="tickets" stroke="#82ca9d" name="Số lượng vé" />
                </LineChart>
            </ResponsiveContainer>
            </Box>
            </Box>
            <Typography sx={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', padding: 2, textAlign: "center",ml:25 }}>
            Biểu đồ hiển doanh thu năm {currentYear}
            </Typography>
      </Box>
      
    </Box>
  );
};

BusinessManagementInfo.propTypes = {
  userInfo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default BusinessManagementInfo;
