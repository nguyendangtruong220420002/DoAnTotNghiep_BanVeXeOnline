/* eslint-disable no-unused-vars */
import React, { useEffect, useState, } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Autocomplete,
  Button ,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import WhereToVoteTwoToneIcon from '@mui/icons-material/WhereToVoteTwoTone';
import DirectionsBusTwoToneIcon from '@mui/icons-material/DirectionsBusTwoTone';
import TrendingFlatTwoToneIcon from '@mui/icons-material/TrendingFlatTwoTone';
import PropTypes from 'prop-types';
import axios from 'axios'; 
import moment from 'moment-timezone';
import PinDropRoundedIcon from '@mui/icons-material/PinDropRounded';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RadioButtonCheckedTwoToneIcon from '@mui/icons-material/RadioButtonCheckedTwoTone';


const ShowTrips = ({dataOfShowTrips , }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [trips, setTrips] = useState([]);
    const [tabIndex1, setTabIndex1] = useState(0);
    const [selectedBox, setSelectedBox] = useState(null);
    const [tripType, setTripType] = useState(dataOfShowTrips.tripType);
    const [openTabs, setOpenTabs] = useState({});
    
    const formatDate = (date) => {
        if (!date) return "Không xác định"; 
        const options = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('vi-VN', options);
    };
    const departureDateLabel = formatDate(dataOfShowTrips.departureDate);
    const returnDateLabel = formatDate(dataOfShowTrips.returnDate);
    useEffect(() => {
        console.log("dataOfShowTrips:", dataOfShowTrips);
        fetchTrips();
    }, [dataOfShowTrips,tripType ]);
   
    const fetchTrips = async () => {
        try {
            console.log('Fetching trips with params:', {
                departure: dataOfShowTrips.departure,
                destination: dataOfShowTrips.destination,
                departureDate: dataOfShowTrips.departureDate,
                returnDate: tripType === "Khứ hồi" ? dataOfShowTrips.returnDate : undefined,
                tripType: tripType,
                userId: dataOfShowTrips.userId,
            });
            
            const response = await axios.get(`${API_URL}/api/tripsRoutes/search`, {
                params: {
                    departure: dataOfShowTrips.departure, 
                    destination: dataOfShowTrips.destination,  
                    departureDate: dataOfShowTrips.departureDate,
                    returnDate: tripType === "Khứ hồi" ? dataOfShowTrips.returnDate : undefined,
                    tripType: tripType,
                    userId: dataOfShowTrips.userId, 
                },
            });
            console.log("Fetched trips data from API:", response.data);
            setTrips(response.data);
        } catch (error) {
            if (error.response) {
                console.error("Error fetching trips:", error.response.data);
                console.error("Status code:", error.response.status);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error:", error.message);
            }
        }
    };
    const handleTabChange1 = (event, newValue) => {
        setTabIndex1(newValue);
    };
    const handleToggleTab = (tripId, tab) => {
        setOpenTabs((prevState) => ({
          ...prevState,
          [tripId]: prevState[tripId] === tab ? null : tab, 
        }));
      };
      const handleBoxClick = (tripId) => {
       
        setSelectedBox(prevSelectedBox => prevSelectedBox === tripId ? null : tripId);
      };
   
    return (
        <Box>
            <Box sx={{ width:'1200px', height:'70px', display:'flex', alignItems:'center', margin: 'auto', border: '1px solid #ececec',backgroundColor:'#ffffff',borderRadius: '8px'  }}>
                <Box sx={{ width:'60%', display:'flex', alignItems:'center', margin: 'auto',justifyContent:'space-around', marginLeft:'20px'  }}>
                    <Typography className="button13">Sắp xếp theo:</Typography>
                    <Typography className="button14" >Giá </Typography>
                    <Typography className="button14" >Xếp hạng</Typography>
                    <Typography className="button14" >Thời gian</Typography>
                    <Typography className="button14">Thời gian khởi hành</Typography> 
                </Box>
                <Box sx={{ width:'40%', display:'flex', alignItems:'center', margin: 'auto'  }}>
                    <Typography  sx={{fontSize:'20px', color:'#808080'}}>|</Typography>
                    <DirectionsBusTwoToneIcon sx={{color:'#2b2b2b',fontSize:'25px'}}></DirectionsBusTwoToneIcon> 
                    <Box>
                    <Typography className="button16">{dataOfShowTrips.departure} <TrendingFlatTwoToneIcon></TrendingFlatTwoToneIcon> {dataOfShowTrips.destination}</Typography> 
                    <Typography className="button15" >Hiện thị {trips.length} tuyến xe trên tuyến đường này</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ width:'1200px', height:'auto', display:'flex', margin: 'auto', marginTop:'15px',  }}>
                <Box sx={{ width:'420px',height:'500px', alignItems:'',  border: '1px solid #ececec',
                    backgroundColor:'#ffffff',borderRadius: '8px', marginLeft:'40px', boxShadow:'' }}>
                <Typography> Bộ lộc</Typography>
                </Box>
                <Box sx={{ width: "100%", margin: "auto", maxHeight: '600px',  overflowY: 'auto',scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }  }}>
                        {dataOfShowTrips.tripType === "Khứ hồi" ? (
                            <Box>
                                <Tabs value={tabIndex1} onChange={handleTabChange1} centered>
                                <Tab label={`Chuyến đi (${departureDateLabel})`}/>
                                <Tab label={`Chuyến về (${returnDateLabel})`} />
                                </Tabs>
                                {tabIndex1 === 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="h6">Thông tin chuyến đi:</Typography>
                                        {trips.map((trip) => (
                                            <Box key={trip._id}>
                                              
           
    
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                                {tabIndex1 === 1 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="h6">Thông tin chuyến về:</Typography>
                                        {trips.map((trip) => (
                                            <Box key={trip._id}>
                                                <Typography>{trip.departure} đến {trip.destination}</Typography>
                                                <Typography>Quay lại: {new Date(trip.returnDate).toLocaleString()}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Box >
                                {trips.map((trip) => (
                                <Box key={trip._id} 
                                    onClick={() => handleBoxClick(trip._id)}
                                    sx={{width:'780px',backgroundColor:'#ffffff',marginLeft:'25px' ,marginTop:'20px', height:'auto',
                                        borderRadius:'10px',
                                        boxShadow: selectedBox === trip._id  ? '0 4px 4px rgba(239, 82, 34, .3), 0 -3px 8px rgba(239, 82, 34, .3), inset 0 0 0 1px rgb(240, 82, 34)' : '0 3px 6px rgba(0, 0, 0, .16), 0 3px 6px rgba(0, 0, 0, .2)',
                                        transition: 'all 0.3s ease',
                                        transform: selectedBox === trip._id ? 'scale(1.02)' : 'scale(1)', 
                                        
                                    }}>
                                    <Box sx={{display:'flex',}}> 
                                        <Box sx={{margin:'20px',  width:'250px', }}>
                                            <Typography className="button17">{trip.userId.fullName}</Typography>
                                            <Typography className="button19" >{trip.busId.busType}</Typography>
                                            <Box sx={{display:'flex', marginLeft:'10px'}} > <AddCircleRoundedIcon sx={{color:'#202020', fontSize:'16px', marginTop:'3px', marginLeft:'4px'}}></AddCircleRoundedIcon><Typography  className="button22" sx={{marginLeft:'20px'}}>chỗ trống</Typography></Box>
                                            
                                        </Box>
                                   <Box sx={{display:'flex',marginTop:'20px' ,}}>
                                        <Box > 
                                            {trip.departureTime && (
                                                <Typography className="button18">
                                                    {moment(trip.departureTime).tz('Asia/Ho_Chi_Minh').format('HH:mm')}
                                                </Typography>
                                            )}
                                                <Typography className="button21" sx={{width:'auto'}}>{trip.routeId.from}</Typography>
                                        </Box>
                                        <MyLocationRoundedIcon sx={{color:'#00613d', fontSize:'21px', marginTop:'10px', marginLeft:'4px'}} />
                                        {trip.departureTime && trip.endTime && (
                                            <Box sx={{display:'flex',marginTop:'12px'}} className="button19">
                                                --------------------<Typography className="button20">{moment.duration(moment(trip.endTime).diff(moment(trip.departureTime))).hours()}h{moment.duration(moment(trip.endTime).diff(moment(trip.departureTime))).minutes()}`</Typography>--------------------
                                            </Box>
                                        )}
                                        <PinDropRoundedIcon sx={{color:'#f2754e', fontSize:'25px',marginTop:'10px', marginRight:'4px'}} />
                                        <Box>
                                            {trip.endTime && (
                                                <Typography className="button23">
                                                    {moment(trip.endTime).tz('Asia/Ho_Chi_Minh').format('HH:mm')}
                                                </Typography>
                                            )}
                                             <Typography className="button21" sx={{width:'auto', }}>{trip.routeId.to} </Typography>
                                             <Typography sx={{marginTop:"15px ", marginLeft:'5px'}}
                                              className="button24">{new Intl.NumberFormat('vi-VN', {style: 'currency',currency: 'VND',}).format(trip.totalFareAndPrice)}</Typography>
                                        </Box>                                                                               
                                   </Box>
                                    </Box>
                                    <Box sx={{marginLeft:'20px', marginRight:'20px' }}>
                                    <Divider ></Divider>
                                    <Box sx={{display:'flex' }}> 
                                    <Box sx={{width:'80%'}}>
                                        <Box sx={{width:'100%'}}>
                                        <Button onClick={() => handleToggleTab(trip._id, "1")} 
                                                sx={{textTransform:'none',fontSize:'15px',
                                                    width:'100px', textAlign:'center',
                                                    color: openTabs[trip._id] === "1" ? "#dc635b" : "#0c0c0c",  
                                                    textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)'                                                   
                                                  }}>Chọn ghế
                                        </Button>
                                        <Button onClick={() => handleToggleTab(trip._id, "2")}  
                                                sx={{textTransform:'none',fontSize:'15px',
                                                    width:'100px', textAlign:'center',
                                                    color: openTabs[trip._id] === "2" ? "#dc635b" : "#0a0a0a",
                                                    textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)' 
                                                  }}> Lịch trình
                                        </Button>
                                        <Button onClick={() => handleToggleTab(trip._id, "3")}  
                                                sx={{textTransform:'none',fontSize:'15px',
                                                    width:'100px', textAlign:'center',
                                                    color: openTabs[trip._id] === "3" ? "#dc635b" : "#070707",
                                                    textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)'  
                                                  }}>Chính sách
                                        </Button>
                                        <Button onClick={() => handleToggleTab(trip._id, "4")}  
                                                sx={{textTransform:'none',fontSize:'15px',
                                                    width:'130px', textAlign:'center',
                                                    color: openTabs[trip._id] === "4" ? "#dc635b" : "#000000",
                                                    textShadow:'1px 1px 2px rgba(0, 0, 0, 0.2)'   
                                                  }}>Trung chuyển
                                        </Button>
                                        {openTabs[trip._id] === "1" && (
                                        <Box>
                                            <Typography>Nội dung cho tab Chọn ghế</Typography>
                                        </Box>
                                        )}
                                        {openTabs[trip._id] === "2" && (
                                        <Box sx={{display:'flex', marginLeft:'30px', marginTop:'10px' , flexDirection:"column"}} >   
                                            <Box >
                                                <Box sx={{display:'flex', alignItems:'center'}}>
                                                    <Typography className="button28">{moment(trip.departureTime).tz('Asia/Ho_Chi_Minh').format('HH:mm')} </Typography>
                                                    <RadioButtonCheckedTwoToneIcon sx={{ marginLeft:"30px" ,width:'20px',color:'#00613d'}}></RadioButtonCheckedTwoToneIcon>
                                                    <Typography className="button26" sx={{marginLeft:"30px", width:'200px'}}>{trip.routeId.from}</Typography>
                                                </Box>
                                                <Box sx={{
                                                        height: '25px',
                                                        width: '1.5px',
                                                        marginLeft: '76px',
                                                        borderLeft: '1px dotted #b0aeae', 
                                                        }}></Box>
                                                {trip.schedule.map((stop, index) => (
                                                <Box key={stop._id}  sx={{display:'flex', alignItems:'center'}}>
                                                    <Typography className="button28">{moment(stop.time, "HH:mm").tz("Asia/Ho_Chi_Minh").format("HH:mm")}</Typography>
                                                    <Box sx={{display:'flex', flexDirection:'column'}}>
                                                        <Box><RadioButtonCheckedTwoToneIcon sx={{ marginLeft:"30px" ,width:'20px',color:'#7e7f7f'}}></RadioButtonCheckedTwoToneIcon></Box>
                                                    <Box sx={{
                                                        height: '25px',
                                                        width: '1.5px',
                                                        marginLeft: '40px',
                                                        borderLeft: '1px dotted #b0aeae', 
                                                        }}></Box>
                                                    </Box>
                                                    <Box  sx={{display:'flex', flexDirection:'column', marginLeft:'30px'}}>
                                                        <Typography className="button26">{stop.name}</Typography>
                                                        <Typography className="button27">{stop.address}</Typography>
                                                    </Box>
                                                </Box>
                                                ))}
                                                <Box sx={{display:'flex', alignItems:'center'}}>
                                                    <Typography className="button28">{moment(trip.endTime).tz('Asia/Ho_Chi_Minh').format('HH:mm')} </Typography>
                                                    <WhereToVoteTwoToneIcon  sx={{marginLeft:"30px", color:'#f2754e' ,width:'20px' }}></WhereToVoteTwoToneIcon>
                                                     <Typography className="button26" sx={{marginLeft:"30px", width:'200px'}}>{trip.routeId.to}</Typography>
                                                </Box>
                                           </Box>
                                        </Box>
                                        )}
                                        {openTabs[trip._id] === "3" && (
                                        <Box>
                                            <Typography>Nội dung cho tab Chính Sách</Typography>
                                        </Box>
                                        )}
                                        {openTabs[trip._id] === "4" && (
                                        <Box>
                                            <Typography>Nội dung cho tab Trung Chuyển</Typography>
                                        </Box>
                                        )}
                                        </Box>
                                    </Box>
                                    <Box sx={{width:'20%' }}>
                                        <Button sx={{backgroundColor: selectedBox === trip._id  ?'rgb(220,99,91)' : 'rgb(180, 155, 153)',
                                                    color: selectedBox === trip._id  ?'white' : 'rgb(106, 44, 44)',
                                                    borderRadius:"50px",
                                                    width:'125px',
                                                    height:'32px',
                                                    textTransform:'none', 
                                                    textAlign:'center',
                                                    textShadow:"1px 1px 2px rgba(0, 0, 0, 0.1)",
                                                    fontSize:'13.5px',
                                                    marginTop:'5px', 
                                                    marginLeft:'15px'
                                        }}>Chọn chuyến</Button>
                                    </Box> 
                                    </Box>
                                    <Box sx={{height:"10px"}}></Box>
                                    </Box> 
                                </Box>
                                
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>

        </Box>
    );
};
ShowTrips.propTypes = {
    dataOfShowTrips: PropTypes.shape({
      departure: PropTypes.string.isRequired, 
      destination: PropTypes.string.isRequired,
      departureDate: PropTypes.string.isRequired,
      returnDate: PropTypes.string.isRequired,
      tripType: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    }).isRequired,
  };
export default ShowTrips;