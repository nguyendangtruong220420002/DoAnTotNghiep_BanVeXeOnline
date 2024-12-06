
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef  } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Autocomplete,
  Button ,Select,MenuItem,Stack, Alert
} from "@mui/material";
import "../HomePage/css/content.css";
import axios from "axios";
import { vi } from "date-fns/locale";
import InputAdornment from "@mui/material/InputAdornment";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import FmdGoodRoundedIcon from "@mui/icons-material/FmdGoodRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { solarToLunar  } from 'lunar-calendar';
import ShowTrips from '../HomePage/showTrips';
import PropTypes from 'prop-types';
import home_banner from '../../../public/images/home1.png';
import one_way from '../../../public/images/one-way.png';
import round_trip from '../../../public/images/round-trip.png';


import { useNavigate } from 'react-router-dom';



const SearchTrips = ({userInfo}) => {
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromProvince, setFromProvince] = useState(null);
  const [toProvince, setToProvince] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), null]);
  const [selectedValue, setSelectedValue] = useState("one-way");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState(null);
  const calendarRef = useRef(null);
  const today = new Date();
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [showNoTripMessage, setShowNoTripMessage] = useState(false);
  const [tripData, setTripData] = useState(null);

  const [alert, setAlert] = useState('');

  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, open: false }));
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [alert.open, setAlert]);
 
  useEffect(() => {
    const fetchProvincesAndDistricts = async () => {
        setLoading(true); 

        //try {
          // const provincesResponse = await axios.get("https://open.oapi.vn/location/provinces?size=63");
          // if (provincesResponse.data && Array.isArray(provincesResponse.data.data)) {
          //     const provincesData = provincesResponse.data.data;
          //     const cleanedProvinces = provincesData.map((province) => ({
          //         ...province,
          //         name: province.name.replace(/^(Tỉnh|Thành phố) /, ""), 
          //     }));

          //     console.log("Danh sách tỉnh/thành phố:", cleanedProvinces);
          //     setProvinces(cleanedProvinces);
          // } else {
          //     console.error("Dữ liệu API không hợp lệ:", provincesResponse.data);
          // }
          try {
            const response = await axios.get('https://provinces.open-api.vn/api/p/');
            const provinces = response.data;
            const cleanedProvinces = provinces.map((province) => ({
                      ...province,
                         name: province.name.replace(/^(Tỉnh|Thành phố) /, ""), 
                     }));
            // console.log("Số lượng tỉnh/thành phố:", provinces.length); 
            // console.log("Danh sách tỉnh/thành phố:", provinces);
            setProvinces(cleanedProvinces);
  
            setLoading(false);

          setLoading(false);
      } catch (error) {
          console.error("Lỗi Khi Lấy Dữ Liệu API:", error);
          setLoading(false);
      }
  };

    fetchProvincesAndDistricts();
}, []);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    
    if (event.target.value === "one-way") {
      setDateRange([dateRange[0], null]);  
    }
  
    
  };

  const handleSwap = () => {
    const temp = fromProvince;
    setFromProvince(toProvince);
    setToProvince(temp);
  };

  const groupOptions = (options) => {
    const grouped = options.reduce((acc, item) => {
      const category = item.provinceName ? "Quận/Huyện" : "Tỉnh/Thành phố";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    return Object.keys(grouped).map((category) => ({
      category,
      items: grouped[category],
    }));
  };

  const options = [
    ...provinces.map((province) => ({
      ...province,
      label: `${province.name}`,
    })),
    ...districts,
  ];
  

  const groupedOptions = groupOptions(options);
  const handleDateChange = (date) => {
    if (date && date < today) {
      date = today;
    }
    if (calendarType === "departure") {
      if (dateRange[1] && date > dateRange[1]) {
        setDateRange([date, null]);
      } else {
        setDateRange([date, dateRange[1]]);
      }
    } else if (calendarType === "return") {
      if (date < dateRange[0]) {
        setDateRange([dateRange[0], dateRange[0]]); 
      } else {
        setDateRange([dateRange[0], date]);
      }
    }
    setShowCalendar(false);
  };
  
  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      console.log("Clicked outside");
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const tileClassName = ({ date, view }) => {
    const today = new Date();
  
    if (view === 'month') {
      const [startDate, endDate] = dateRange; 
  
      
      if (startDate && date.getDate() === startDate.getDate() && 
          date.getMonth() === startDate.getMonth() && 
          date.getFullYear() === startDate.getFullYear()) {
        return 'range-date'; 
      }
  
      if (date.getDate() === today.getDate() && 
          date.getMonth() === today.getMonth() && 
          date.getFullYear() === today.getFullYear()) {
        return 'default-date'; 
      }
      if (startDate && endDate) {
        if (date >= startDate && date <= endDate) {
          return 'range-date'; 
        }
      } else if (startDate) {
        if (date >= startDate && date <= today) {
          return 'range-date';
        }
      }
    }
  
    return null;
  };
 
  const getLunarDate = (date) => {
    try {
      const lunar = solarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
      return `${lunar.lunarDay}/${lunar.lunarMonth}`; 
    } catch (error) {
      console.error('Error converting date:', error);
      return '';
    }
  };
   
  useEffect(() => {

    const storedFromProvince = localStorage.getItem('fromProvince');
    const storedToProvince = localStorage.getItem('toProvince');
    const storedDateRange = localStorage.getItem('dateRange');
    const storedSelectedValue = localStorage.getItem('selectedValue');
    
    if (storedFromProvince) {
      setFromProvince(JSON.parse(storedFromProvince));
    }
    if (storedToProvince) {
      setToProvince(JSON.parse(storedToProvince));
    }
    if (storedDateRange) {
      const parsedDateRange = JSON.parse(storedDateRange);
      if (Array.isArray(parsedDateRange)) {
        setDateRange([new Date(parsedDateRange[0]), parsedDateRange[1] ? new Date(parsedDateRange[1]) : null]);
      }
    }
  
    if (storedSelectedValue) {
      setSelectedValue(storedSelectedValue);
    }
  }, []);
  
  const handleSearch = () => {
    const departureDate = new Date(dateRange[0]);
   
    const returnDate = dateRange[1] ? new Date(dateRange[1]) : null;
    if (returnDate) {
    //  returnDate.setHours(0, 0, 0, 0); 
    }
    if (selectedValue === 'round-trip' && !returnDate) {
      setAlert({
        open: true,
        severity: 'warning', 
        message: 'Vui lòng chọn ngày trở lại cho chuyến đi khứ hồi!',
      });
      return; 
    }
    const formattedDepartureDate = departureDate.toLocaleDateString('vi-VN', {
      weekday: 'short', 
      day: '2-digit',   
      month: '2-digit', 
      year: 'numeric', 
    });
  
    const formattedReturnDate = returnDate
      ? returnDate.toLocaleDateString('vi-VN', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : null;

    localStorage.setItem('fromProvince', JSON.stringify(fromProvince));
    localStorage.setItem('toProvince', JSON.stringify(toProvince));
    localStorage.setItem('dateRange', JSON.stringify([departureDate, returnDate]));
    localStorage.setItem('selectedValue', selectedValue);
    const dataOfShowTrips = {
      departure: fromProvince.name,
      destination: toProvince.name,
      departureDate: dateRange[0],
      returnDate: dateRange[1],
      tripType: selectedValue === 'one-way' ? 'Một chiều' : 'Khứ hồi',
      userId: userInfo ? userInfo._id : undefined 
      
    };
    //console.log("dataOfShowTíp gửi qua ShowTrips",dataOfShowTrips);
   
    setTripData(dataOfShowTrips);
    setShowNoTripMessage(true);
    navigate('/showTrips', { state: { dataOfShowTrips, userInfo }});
    
  };
  
  return (
    <Box sx={{backgroundColor:'#551615', height:'67px'}}>
      <Box
       sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
       
      }}
      >
        <Typography
        sx={{
          width: "1350px",
          height: "67px",
          backgroundColor:'#551615',
         
        }}
      >
        <Box sx={{  marginTop:'3px' }}>
         
          <Box sx={{ display: "flex" }}>
            <Box sx={{ marginTop: "5px", display: "flex" }}>     
            <FormControl sx={{ marginRight: '20px' }}>
      <Select
        className="select"
        size="small"
        value={selectedValue}
        onChange={handleChange}
        MenuProps={{ disableScrollLock: true }}
        inputProps={{ "aria-label": "trip-type" }}
        sx={{
          borderRadius: '8px',
          height: '50px',
          width:'150px',
          fontSize: '15.5px',
          fontWeight: "bold",
          "& .MuiSelect-select": {
            padding: '0px',
          },
        }}
      >
        <MenuItem value="one-way">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={one_way}
              alt="One Way"
              style={{ width: '30px', height: '30px', marginRight: '10px' }}
            />
            <Typography sx={{ fontSize: '13px', fontWeight: 'bold', color:'#dc635b' }}>
              Một chiều
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem value="round-trip">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={round_trip}
              alt="Round Trip"
              style={{ width: '30px', height: '30px', marginRight: '10px' }}
            />
            <Typography sx={{ fontSize: '13px', fontWeight: 'bold' , color:'#dc635b' }}>
              Khứ hồi
            </Typography>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
    
              <Autocomplete
               size="small"
                options={groupedOptions.flatMap((group) => group.items)}
                groupBy={(option) => {
                  return option.provinceName ? "Quận/Huyện" : "Tỉnh/Thành phố";
                }}
                getOptionLabel={(option) => option.label}
                value={fromProvince}
                onChange={(event, newValue) => setFromProvince(newValue)}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    fullWidth
                    placeholder="Nơi đi"
                    className="select"
                    sx={{ width: "220px",}}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <GpsFixedRoundedIcon
                            sx={{ color: "rgb(88, 87, 87)", fontSize: "20px" }}
                          />
                        </InputAdornment>
                      ),
                      sx: {
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "InterTight, sans-serif",
                        fontWeight: "bold",
                        height:'50px'
                      },
                    }}
                   
                  />
                )}
              />

              <Button
                onClick={handleSwap}
                variant="outlined"
                sx={{
                  height: "30px",
                  width: "30px",
                  mt: 1,
                  border: "none",
                  borderRadius: "15px",
                  padding: 0,
                  minWidth: "auto",
            
                }}
              >
                <SwapHorizOutlinedIcon sx={{ color: "#cbbaba" }} />
              </Button>

              <Autocomplete
                size="small"
                options={groupedOptions.flatMap((group) => group.items)}
                groupBy={(option) => {
                  return option.provinceName ? "Quận/Huyện" : "Tỉnh/Thành phố";
                }}
                getOptionLabel={(option) => option.label}
                value={toProvince}
                onChange={(event, newValue) => setToProvince(newValue)}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                   className="select"
                    fullWidth
                    placeholder="Nơi đến"
                    
                    sx={{ width: "220px" }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <FmdGoodRoundedIcon
                            sx={{ color: "rgb(88, 87, 87)", fontSize: "20px" }}
                          />
                        </InputAdornment>
                      ),
                      sx: {
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "InterTight, sans-serif",
                        fontWeight: "bold",
                         height:'50px'
                      },
                    }}
                    InputLabelProps={{
                      sx: { color: "black", fontSize: "17px" },
                    }}
                  />
                )}
              />
            </Box>
            <Box sx={{ marginTop: "5px", display: "flex",  marginLeft:'20px' }}>
              {selectedValue === "round-trip" ? (
                <Box sx={{ display: "flex", justifyContent: "space-between", }}>
                  <Box sx={{ position: "relative" , marginRight:'10px' }}>
                    <TextField
                      size="small"
                      className="select"
                       placeholder="Ngày đi"
                      sx={{ width: "180px",height:'50px' }}
                      onClick={() => {
                        setShowCalendar(true);
                        setCalendarType("departure");
                      }}
                      value={
                        dateRange[0]
                          ? format(dateRange[0], "eeeee, dd/MM/yyyy", {
                              locale: vi,
                            })
                          : ""
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <CalendarMonthRoundedIcon
                              sx={{
                                color: "rgb(88, 87, 87)",
                                fontSize: "20px",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      readOnly
                    />
                    {showCalendar && calendarType === "departure" && (
                      <Box
                      ref={calendarRef} 
                        sx={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 1,
                        }}
                      >
                        <Calendar
                        
                          onChange={handleDateChange}
                          value={dateRange[0]}
                          minDate={today}
                          locale={vi}
                          tileClassName={tileClassName}
                          tileContent={({ date }) => (
                            <div>
                            <div style={{ fontSize:'10px'}}>{getLunarDate(date)}</div>
                          </div>
                          )}
                          
                        />
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      size="small"
                      placeholder="Ngày về"
                      className="select"
                      sx={{ width: "180px", height:'50px' }}
                      onClick={() => {
                        setShowCalendar(true);
                        setCalendarType("return");
                      }}
                      value={
                        dateRange[1]
                          ? format(dateRange[1], "eeeee, dd/MM/yyyy", {
                              locale: vi,
                            })
                          : ""
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <CalendarMonthRoundedIcon
                              sx={{
                                color: "rgb(88, 87, 87)",
                                fontSize: "20px",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      readOnly
                    />
                    {showCalendar && calendarType === "return" && (
                      <Box
                      ref={calendarRef} 
                        sx={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 1,
                        }}
                      >
                        <Calendar
                          onChange={handleDateChange}
                          value={dateRange[1]} 
                          minDate={dateRange[0]}
                          locale={vi}
                          tileClassName={tileClassName}
                          tileContent={({ date }) => (
                            <div>
                            <div style={{ fontSize:'10px'}}>{getLunarDate(date)}</div>
                          </div>
                          )}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ position: "relative" }}>
                  <TextField
                    size="small"
                    className="select"
                    placeholder="Ngày đi"
                    sx={{ width: "370px",height:'50px' }}
                    onClick={() => {
                      setShowCalendar(true);
                      setCalendarType("departure");
                    }}
                    value={
                      dateRange[0]
                        ? format(dateRange[0], "eeeee, dd/MM/yyyy", {
                            locale: vi,
                          })
                        : ""
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" >
                          <CalendarMonthRoundedIcon
                            sx={{ color: "rgb(88, 87, 87)", fontSize: "20px" , }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    readOnly
                  />
                  {showCalendar && calendarType === "departure" && (
                    <Box
                    ref={calendarRef} 
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        zIndex: 1,
                      }}
                    >
                      <Calendar 
                        onChange={handleDateChange}
                        value={dateRange[0]}
                        minDate={today}
                        locale={vi}
                        tileClassName={tileClassName}
                        tileContent={({ date }) => (
                          <div style={{ fontSize:'10px'}}>{getLunarDate(date)}</div>
                        )}
                      />
                    </Box>
                  )}
                </Box>
              )}
              <TextField
                size="small"
                className="select"
                type="number"
               placeholder="Số Lượng"
                value={numberOfTickets}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 0 && value <= 47) {
                    setNumberOfTickets(value);
                  }
                }}
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: 47,
                  },
                }}
                sx={{ width: "62px", marginLeft: "20px", textAlign: "center", height:'50px' }}
              />
              <Stack sx={{ width: '500px', margin: 'auto',position: "absolute",
                    bottom: "500px", 
                    left: "80%",
                    transform: "translateX(-50%)",
                    zIndex: 10,}}>
                    {alert.open && (
                      <Alert 
                      variant="filled" 
                        severity={alert.severity} 
                        onClose={() => setAlert((prev) => ({ ...prev, open: false }))} 
                      >
                        {alert.message}
                      </Alert>
                    )}
                  </Stack>
             <Button
                variant="contained" 
                onClick={handleSearch}
                sx={{
                  width:'200px',
                  height:'50px',
                  bottom: "20px", 
                  borderRadius:'10px',
                  fontSize:'15px',     
                  backgroundColor:'rgb(220,99,91)',
                  marginTop:'20px',
                  marginLeft:'15px'
                }}
              >
                  <Typography sx={{fontSize:'17.5px' ,textShadow:"1px 1px 2px rgba(0, 0, 0, 0.2)", color:'#fffaf3',textTransform: 'none' }}>Tìm chuyến</Typography>
              </Button>
            </Box>
          </Box>          
        </Box>        
      </Typography>
      </Box>
      {/* {showNoTripMessage && (
        <Box>
          {tripData && <ShowTrips dataOfShowTrips={tripData} userInfo={userInfo} ></ShowTrips>}
        </Box>
      )} */}
    </Box>
  );
};

SearchTrips.propTypes = {
  
  userInfo: PropTypes.func,
  
};

export default SearchTrips;
