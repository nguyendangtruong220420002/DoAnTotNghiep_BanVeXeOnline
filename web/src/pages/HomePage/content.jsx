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
  Button 
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
import home_banner from '../../../public/images/home1.png';
import ShowTrips from '../HomePage/showTrips';
import PropTypes from 'prop-types';



const Content = ({userInfo}) => {
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
 
  useEffect(() => {
    const fetchProvincesAndDistricts = async () => {
        setLoading(true); 

        try {
          const provincesResponse = await axios.get("https://open.oapi.vn/location/provinces?size=63");
          if (provincesResponse.data && Array.isArray(provincesResponse.data.data)) {
              const provincesData = provincesResponse.data.data;
              const cleanedProvinces = provincesData.map((province) => ({
                  ...province,
                  name: province.name.replace(/^(Tỉnh|Thành phố) /, ""), 
              }));

              console.log("Danh sách tỉnh/thành phố:", cleanedProvinces);
              setProvinces(cleanedProvinces);
          } else {
              console.error("Dữ liệu API không hợp lệ:", provincesResponse.data);
          }

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
  const handleSearch = () => {
    const dataOfShowTrips = {
      departure: fromProvince.name,
      destination: toProvince.name, 
      departureDate: dateRange[0],
      returnDate: dateRange[1],
      tripType: selectedValue === 'one-way' ? 'Một chiều' : 'Khứ hồi',
      userId: userInfo._id
    };
    console.log("Tỉnh đi:", fromProvince);
    console.log("Tỉnh đến:", toProvince);
    console.log("Ngày đi:", dateRange[0]);
    console.log("Ngày về:", dateRange[1]);
    console.log("Loại chuyến:", selectedValue === 'one-way' ? 'Một chiều' : 'Khứ hồi');
    console.log("id khách hàng",userInfo._id);
    setTripData(dataOfShowTrips); 
    setShowNoTripMessage(true);
      
  };
  return (
    <Box sx={{background:'#f4f4f4', height:'auto'}}>
      <img alt="" className='home_banner' src={home_banner} style={{ width: '100%', height: 'auto', }} />
      <Box
       sx={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        paddingTop: '120px', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1, 
      }}
      >
        <Typography
        sx={{
          width: "1130px",
          height: "190px",
          backgroundColor: "white",
          marginTop: "10px",
        }}
        className="border1"
      >
        <Box sx={{ padding: "20px" }}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="trip-type"
              value={selectedValue}
              onChange={handleChange}
            >
              <FormControlLabel
                value="one-way"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": { fontSize: 18 },
                      width: "25px",
                    }}
                    className={
                      selectedValue === "one-way" ? "radio-checked" : ""
                    }
                  />
                }
                label={
                  <span style={{ fontSize: "15px", marginRight: "20px" }}>
                    Một chiều
                  </span>
                }
                className={
                  selectedValue === "one-way"
                    ? "radio-label-checked"
                    : "radio-label"
                }
              />
              <FormControlLabel
                value="round-trip"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": { fontSize: 18 },
                      width: "25px",
                    }}
                    className={
                      selectedValue === "round-trip" ? "radio-checked" : ""
                    }
                  />
                }
                label={<span style={{ fontSize: "15px" }}>Khứ hồi</span>}
                className={
                  selectedValue === "round-trip"
                    ? "radio-label-checked"
                    : "radio-label"
                }
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ display: "flex" }}>
            <Box sx={{ marginTop: "20px", display: "flex" }}>
              <Autocomplete
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
                    {...params}
                    label="Nơi xuất phát"
                    fullWidth
                    placeholder="Chọn Tỉnh thành"
                    className="date"
                    sx={{ width: "270px" }}
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
                        fontSize: "17px",
                        fontFamily: "InterTight, sans-serif",
                        fontWeight: "bold",
                      },
                    }}
                    InputLabelProps={{
                      sx: { color: "black", fontSize: "17px" },
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
                  mt: 2,
                  border: "none",
                  borderRadius: "50%",
                  padding: 0,
                  minWidth: "auto",
                  minHeight: "auto",
                }}
              >
                <SwapHorizOutlinedIcon sx={{ color: "rgb(240, 82, 34)" }} />
              </Button>

              <Autocomplete
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
                    {...params}
                    className="date"
                    label="Nơi đến"
                    fullWidth
                    placeholder="Chọn Tỉnh thành"
                    
                    sx={{ width: "270px" }}
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
                        fontSize: "17px",
                        fontFamily: "InterTight, sans-serif",
                        fontWeight: "bold",
                      },
                    }}
                    InputLabelProps={{
                      sx: { color: "black", fontSize: "17px" },
                    }}
                  />
                )}
              />
            </Box>
            <Box sx={{ marginTop: "20px", display: "flex", margin: "20px" }}>
              {selectedValue === "round-trip" ? (
                <Box sx={{ display: "flex", justifyContent: "space-between", }}>
                  <Box sx={{ position: "relative" , marginRight:'10px' }}>
                    <TextField
                      className="date"
                      label="Ngày đi"
                      sx={{ width: "180px" }}
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
                      label="Ngày về"
                       className="date"
                      sx={{ width: "180px" }}
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
                    className="date"
                    label="Ngày đi"
                    sx={{ width: "370px" }}
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
                            sx={{ color: "rgb(88, 87, 87)", fontSize: "20px" }}
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
                type="number"
                label="Số lượng vé"
                className="date"
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
                sx={{ width: "100px", marginLeft: "20px", textAlign: "center" }}
              />
            </Box>
          </Box>
          <Box
              sx={{
                marginTop: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent:'center',
                position: "relative", 
              }}
            >
              <Button
                variant="contained" 
                onClick={handleSearch}
                sx={{
                  width:'260px',
                  height:'50px',
                  position: "absolute",
                  bottom: "20px", 
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                  borderRadius:'50px',
                  fontSize:'15px',     
                  backgroundColor:'rgb(220,99,91)'
                }}
              >
                Tìm chuyến xe 
              </Button>


             
            </Box>
            
        </Box>
      </Typography>
      </Box>
      {showNoTripMessage && (
        <Box>
          {tripData && <ShowTrips dataOfShowTrips={tripData}></ShowTrips>}
        </Box>
      )}
    </Box>
  );
};

Content.propTypes = {
  
  userInfo: PropTypes.func.isRequired,
  
};

export default Content;
