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
  TextField,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import LocalPrintshopTwoToneIcon from "@mui/icons-material/LocalPrintshopTwoTone";

const AllRevenue = ({ userInfo }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState([]);
  const [buses, setBuses] = useState([]);
  const [busRoutes, setBusRoutes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [totalPrice, settotalPrice] = useState([]);

  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState([]);
  const [years, setYears] = useState([]);
  const [bookingInfo, setBookingInfo] = useState([]);
  const [seatQuantity, setSeatQuantity] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const AllBuses = buses.length;
  const AllBusRoutes = busRoutes.length;
  const AllTrips = trips.length;

  useEffect(() => {
    // console.log("Users:", user);
    // console.log("Buses:", buses);
    // console.log("Bus Routes:", busRoutes);
    // console.log("Trips:", trips);
    // console.log("totalPrice:", totalPrice);
  }, [user, buses, busRoutes, trips, bookings]);
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
      const businessUsers = data.users.filter(
        (user) => user.role === "Business"
      );
      setUser(businessUsers);
      setBuses(data.buses || []);
      setBusRoutes(data.busRoutes || []);
      setTrips(data.trips || []);

      const totalPriceBookings = (data.bookings || []).filter(
        (booking) => booking.paymentStatus === "Đã thanh toán" && booking.tripId
      );
      settotalPrice(totalPriceBookings);
      const paidBookings = (data.bookings || []).filter(
        (booking) => booking.paymentStatus === "Đã thanh toán" && booking.tripId
      );
      const userBooking = paidBookings.flatMap((booking) => {
        const seatIds = Array.isArray(booking.seatId)
          ? booking.seatId
          : booking.seatId.split(",").map((seat) => seat.trim());
        return seatIds.map((seat) => ({ ...booking, seatId: seat }));
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
    const updatedSeatQuantity = filteredBookings.reduce(
      (total, booking) =>
        total +
        (booking.seatId.includes(",") ? booking.seatId.split(",").length : 1),
      0
    );
    const totalFiltered = totalPrice.filter((booking) => {
      const bookingYear = new Date(booking.bookingDate).getFullYear();
      return bookingYear === parseInt(selectedYear);
    });
    const updatedTotalRevenue = totalFiltered.reduce(
      (sum, booking) => sum + booking.totalFare,
      0
    );
    setFilteredBookings(filteredBookings);
    setSeatQuantity(updatedSeatQuantity);
    setTotalRevenue(updatedTotalRevenue);
    calculateMonthlyData(filteredBookings, selectedYear);
  };
  const calculateMonthlyData = (bookings, selectedYear) => {
    const monthlyData = Array(12)
      .fill(0)
      .map((_, index) => ({
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
      console.log(
        `Booking year: ${bookingYear}, Selected year: ${selectedYear}`
      );
      if (bookingYear === parseInt(selectedYear)) {
        const monthIndex = bookingMonth;
        monthlyData[monthIndex].revenue += booking.totalFare;
        monthlyData[monthIndex].tickets += booking.seatId.includes(",")
          ? booking.seatId.split(",").length
          : 1;
      }
    });
    console.log("Monthly Data:", monthlyData);
    if (monthlyData.every((data) => data.revenue === 0 && data.tickets === 0)) {
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

    const updatedSeatQuantity = filteredBookings.reduce(
      (total, booking) =>
        total +
        (booking.seatId.includes(",") ? booking.seatId.split(",").length : 1),
      0
    );
    const totalFiltered = totalPrice.filter((booking) => {
      const bookingMonth = booking.bookingDate.slice(0, 7);
      return bookingMonth === selectedMonth;
    });
    const updatedTotalRevenue = totalFiltered.reduce(
      (sum, booking) => sum + booking.totalFare,
      0
    );
    setFilteredBookings(filteredBookings);
    setSeatQuantity(updatedSeatQuantity);
    setTotalRevenue(updatedTotalRevenue);
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setYear("");
    setMonth("");
    const filteredBookings = bookings.filter(
      (booking) => booking.bookingDate.slice(0, 10) === selectedDate
    );
    const updatedSeatQuantity = filteredBookings.reduce(
      (total, booking) =>
        total +
        (booking.seatId.includes(",") ? booking.seatId.split(",").length : 1),
      0
    );
    const totalFiltered = totalPrice.filter(
      (booking) => booking.bookingDate.slice(0, 10) === selectedDate
    );

    const updatedTotalRevenue = totalFiltered.reduce(
      (sum, booking) => sum + booking.totalFare,
      0
    );
    setFilteredBookings(filteredBookings);
    setSeatQuantity(updatedSeatQuantity);
    setTotalRevenue(updatedTotalRevenue);
  };
  const exportToExcel = () => {
    const data =
      chartData.length > 0
        ? chartData.map((item) => ({
            Month: item.month,
            Revenue: item.revenue,
            Tickets: item.tickets,
          }))
        : Array.from({ length: 12 }, (_, i) => ({
            Month: `Month ${i + 1}`,
            Revenue: 0,
            Tickets: 0,
          }));

    const totalRevenue = data.reduce((sum, item) => sum + item.Revenue, 0);
    const totalTickets = data.reduce((sum, item) => sum + item.Tickets, 0);
    data.push({
      Month: "Tổng doanh thu",
      Revenue: totalRevenue,
      Tickets: totalTickets,
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      `Doanh thu năm ${year || currentYear}`
    );

    XLSX.writeFile(
      wb,
      `Bao_cao_doanh_thu_nam_cua_VeXeOnline_${year || currentYear}.xlsx`
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{}}>
        <Box
          sx={{
            borderRadius: "10px",
            border: "1px solid #e5e5e5",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            width: "100%",
          }}
        >
          <Typography
            sx={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", mb: 2 }}
          >
            Thống kế tổng số lượng của toàn hệ thống
          </Typography>
          <TextField
            color="warning"
            label="Lọc theo ngày"
            variant="outlined"
            size="small"
            sx={{ width: "250px", mr: 2, mb: 2, ml: 20 }}
            name="date"
            type="date"
            value={date}
            onChange={handleDateChange}
            InputProps={{
              sx: {
                fontSize: "13px",
                backgroundColor: "#fef3f0",
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 0 2px rgb(255, 224, 212)",
                },
              },
            }}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: "13px",
              },
            }}
          />
          <TextField
            color="warning"
            label="Lọc theo tháng"
            variant="outlined"
            size="small"
            sx={{ width: "250px", mr: 2 }}
            name="month"
            type="month"
            value={month}
            onChange={handleMonthChange}
            InputProps={{
              sx: {
                fontSize: "13px",
                backgroundColor: "#fef3f0",
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 0 2px rgb(255, 224, 212)",
                },
                inputProps: {
                  min: 0,
                },
              },
            }}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: "13px",
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
                fontSize: "13px",
                backgroundColor: "#fef3f0",
                width: "210px",
                height: "36px",
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: " 0 0 0 2px rgb(255, 224, 212)",
                },
              },
            }}
            InputLabelProps={{
              sx: {
                fontSize: "13px",
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
              color: "#F44336",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
              borderRadius: "50px",
              ml: 3,
              height: "30px",
              "&:hover": { color: "#313731" },
            }}
            onClick={resetFilters}
          >
            <DeleteForeverOutlinedIcon sx={{ width: "40px", height: "35px" }} />
          </IconButton>
          <IconButton
            sx={{
              color: "#46b70d",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
              borderRadius: "50px",
              height: "30px",
              "&:hover": { color: "#313731" },
            }}
            onClick={exportToExcel}
          >
            <LocalPrintshopTwoToneIcon sx={{ width: "40px", height: "35px" }} />
          </IconButton>
          <Box sx={{ display: "flex" }}>
            <TableContainer
              component={Paper}
              sx={{
                border: "1px solid #e5e5e5",
                marginTop: "10px",
                maxHeight: "110px",
                maxWidth: "1000px",
                overflowY: "auto",
                ml: 10,
                mb: 2,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {" "}
                      Xe
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {" "}
                      Tuyến xe
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {" "}
                      Chuyến xe
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {" "}
                      Vé bán
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      Tổng giá tiền
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    <TableRow>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        {AllBuses}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        {AllBusRoutes}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        {AllTrips}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {seatQuantity}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(totalRevenue)}{" "}
                        {/* Tổng giá tiền */}
                      </TableCell>
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
          <Typography
            sx={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", mb: 2 }}
          >
            Biểu đồ quản lý doanh thu của toàn hệ thống
          </Typography>
          <Box
            sx={{
              display: "flex",
              width: "1170px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ResponsiveContainer width="50%" height={400}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis orientation="left" dataKey="revenue" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Doanh thu"
                />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="50%" height={400}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis orientation="right" dataKey="tickets" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#82ca9d"
                  name="Số lượng vé"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Typography
            sx={{
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
              padding: 2,
              textAlign: "center",
            }}
          >
            Biểu đồ hiển doanh thu năm {currentYear}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

AllRevenue.propTypes = {
  userInfo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default AllRevenue;
