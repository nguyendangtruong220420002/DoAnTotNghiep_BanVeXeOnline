/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, Box ,Divider} from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment-timezone';
import ChairRoundedIcon from '@mui/icons-material/ChairRounded';
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL;

const SeatSelection = ({ userInfo, tripId, departureDate,totalAmount }) => {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats, setSeats] = useState(
    Array.from({ length: 40 }, (_, index) => ({
      id: index + 1,
      status: 'Còn trống',
    }))
  );

  const fetchBookedSeats = async () => {
    try {
      const formattedDepartureDate = departureDate.replace("Th ", "").trim();
      const parts = formattedDepartureDate.split(", ");
      const dayMonthYear = parts[1];
      const formattedDepartureTime = moment(dayMonthYear, "D/MM/YYYY")
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD");

      const response = await axios.get(`${API_URL}/api/tripsRoutes/getBooked-seats`, {
        params: { tripId, bookingDate: formattedDepartureTime },
      });

      const bookedSeats = response.data.bookedSeats || [];
      console.log("Booked Seats Data:", bookedSeats);

      // Cập nhật trạng thái ghế
      setSeats((prevSeats) =>
        prevSeats.map((seat) => ({
          ...seat,
          status: bookedSeats.some((bookedSeat) => bookedSeat.seatId === getSeatCode(seat.id))
            ? "Đã mua"
            : "Còn trống",
        }))
      );
    } catch (error) {
      console.error("Lỗi khi lấy ghế đã đặt:", error);
    }
  };

  useEffect(() => {
    fetchBookedSeats();
  }, [tripId, departureDate]);

  const getSeatCode = (id) => {
    return id <= 20 ? `A${id}` : `B${id - 20}`;
  };

  const handleSeatClick = (seatId) => {
    const updatedSeats = seats.map((seat) => {
      if (seat.id === seatId) {
        const newStatus = seat.status === "Còn trống" ? "Đã chọn" : "Còn trống";
        return { ...seat, status: newStatus };
      }
      return seat;
    });
    setSeats(updatedSeats);
    const clickedSeat = updatedSeats.find((seat) => seat.id === seatId);
    if (clickedSeat.status === "Đã chọn") {
      setSelectedSeats((prev) => [...prev, seatId]);
    } else {
      setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
    }
  };

  const handleBookSeats = async () => {
    if (!selectedSeats || selectedSeats.length === 0) {
      alert("Bạn chưa chọn ghế.");
      return;
    }

    const formattedDepartureDate = departureDate.replace("Th ", "").trim();
    const parts = formattedDepartureDate.split(", ");
    const dayMonthYear = parts[1];
    const formattedDepartureTime = moment(dayMonthYear, "D/MM/YYYY")
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    const bookingData = {
      tripId,
      bookingDate: formattedDepartureTime,
      seats: selectedSeats.map((id) => getSeatCode(id)),
      userId: userInfo._id,
    };

    try {
      const response = await axios.post(`${API_URL}/api/tripsRoutes/book-seats`, bookingData);
      alert(response.data.message || "Đặt ghế thành công!");
      await fetchBookedSeats();
    } catch (error) {
      console.error("Lỗi khi đặt ghế:", error);
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Đã có lỗi xảy ra khi đặt ghế.");
      }
    }
  };


  const renderSeats = (seats) => {
    return seats.map((seat) => (
      <Box
        key={seat.id}
        onClick={() => handleSeatClick(seat.id)} 
        sx={{ position: "relative", display: "inline-block", margin: "2px" }}
      >
        <ChairRoundedIcon
          sx={{
            width: "38px",
            height: "40px",
            color:
              seat.status === "Đã mua"
                ? "#ccc"
                : seat.status === "Đã chọn"
                ? "#ffc9b9"
                : "#b1dffb",
          }}
        />
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: "32%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "9.5px",
            fontWeight: "bold",
            color:
              seat.status === "Đã mua"
                ? "#888585"
                : seat.status === "Đã chọn"
                ? "#f06843"
                : "#2b7ecc",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
          }}
        >
          {getSeatCode(seat.id)}
        </Typography>
      </Box>
    ));
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "center", marginLeft: "70px" }}>
        <Box display="flex" alignItems="center" sx={{ marginRight: "50px" }}>
          <Box sx={{ width: "15px", height: "15px", backgroundColor: "#d5d9dd", borderRadius: "3px" }}></Box>
          <Typography variant="caption" sx={{ fontSize: "13px", marginLeft: "7px" }}>
            Đã mua
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" sx={{ marginRight: "50px" }}>
          <Box sx={{ width: "15px", height: "15px", backgroundColor: "#b1dffb", borderRadius: "3px" }}></Box>
          <Typography variant="caption" sx={{ fontSize: "13px", marginLeft: "7px" }}>
            Còn trống
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" sx={{ marginRight: "50px" }}>
          <Box sx={{ width: "15px", height: "15px", backgroundColor: "#ffc9b9", borderRadius: "3px" }}></Box>
          <Typography variant="caption" sx={{ fontSize: "13px", marginLeft: "7px" }}>
            Đã chọn
          </Typography>
        </Box>
      </Box>
        <Box>
        <Box sx={{ display: 'flex', marginTop: '20px', justifyContent: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: '14px' }}>Tầng dưới</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {renderSeats(seats.slice(0, 15), 0)}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px' }}>
              {renderSeats(seats.slice(15, 20), 15)}
            </Box>
          </Box>

          <Box sx={{ marginLeft: '50px' }}>
            <Typography sx={{ fontSize: '14px' }}>Tầng trên</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {renderSeats(seats.slice(20, 35), 20)}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px' }}>
              {renderSeats(seats.slice(35, 40), 35)}
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider></Divider>

     <Box sx={{display:'flex' , justifyContent:'space-between', marginLeft:'20px', width:'700px', alignItems:'center' }}>
      <Box sx={{display:'flex' , flexDirection:'column', textAlign:'left'}}>
      <Typography className='button32' sx={{ }}>
            {selectedSeats.length === 0 ? "" : `${selectedSeats.length} Vé`}
          </Typography>
        <Typography className='button31' sx={{ }}>
            {selectedSeats.length === 0 ? "" : selectedSeats.map(id => getSeatCode(id)).join(", ") }
          </Typography> 
          
      </Box>
        <Box sx={{display:'flex' , justifyContent:'center', alignItems:'center' ,}}>  
          <Box sx={{marginRight:'10px'}}> 
          {selectedSeats.length > 0 && (
                <Typography className='button32' sx={{ textAlign:'right' }} >Tổng tiền</Typography>
              )}
                  <Typography  className='button33'>
                    {selectedSeats.length > 0 ? new Intl.NumberFormat('vi-VN', {style: 'currency',currency: 'VND',}).format(selectedSeats.length * totalAmount) : ""}
                  </Typography>
              
          </Box>
              {selectedSeats.length > 0 && (
                <Button 
                 //onClick={handleBookSeats} 
                 onClick={() => navigate('/inforCustoOfTrips')}
                sx={{backgroundColor:  'rgb(220,99,91)' ,
                  color:  'white' ,
                  borderRadius:"50px",
                  width:'150px',
                  height:'32px',
                  textTransform:'none', 
                  textAlign:'center',
                  textShadow:"1px 1px 2px rgba(0, 0, 0, 0.2)",
                  fontSize:'13.5px',
                    }}>
                  Tiếp Tục
                </Button>
              )}
        </Box>
     </Box>
    </Box>
  );
};

SeatSelection.propTypes = {
  userInfo: PropTypes.object.isRequired,
  tripId: PropTypes.string.isRequired,
  departureDate: PropTypes.string.isRequired,
  totalAmount:PropTypes.string.isRequired,
};

export default SeatSelection;
