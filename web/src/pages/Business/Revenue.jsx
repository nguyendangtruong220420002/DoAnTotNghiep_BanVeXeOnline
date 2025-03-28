/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Box, TextField, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Select } from "@mui/material";
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as XLSX from 'xlsx';

const Revenue = ({ userInfo }) => {

    const API_URL = import.meta.env.VITE_API_URL;
    const userId = userInfo._id;

    const [bookingInfo, setBookingInfo] = useState([]);
    const [seatQuantity, setSeatQuantity] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [month, setMonth] = useState('');
    const [date, setDate] = useState('');
    const [year, setYear] = useState('');
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [chartData, setChartData] = useState([]);
    const [years, setYears] = useState([]);


    useEffect(() => {
        generateYearRange();
        fetchingRevenue();  
    }, [userInfo._id]);

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

    const fetchingRevenue = async () => {
        setMonth();
        setYear();
        setDate();
        setFilteredBookings([]);
        setSeatQuantity(0);
        setTotalRevenue(0);
        const response = await fetch(`${API_URL}/api/revenue/getRevenue/${userId}`, { method: 'GET' });
        if (response.ok) {
            const data = await response.json();
            calculateMonthlyData(data.bookings);
            const sluongGhe = data.bookings.map(booking => booking.seatId).reduce((total, item) => {
                const count = item.includes(',') ? item.split(',').length : 1;
                return total + count;
            }, 0);
            const total = data.bookings.reduce((sum, booking) => sum + booking.totalFare, 0);
            setSeatQuantity(sluongGhe);
            setTotalRevenue(total);
            setBookingInfo(data.bookings);
        }
    };
    const handleYearChange = (e) => {
        const selectedYear = e.target.value;
        setCurrentYear(selectedYear);        
        setYear(selectedYear);
        setMonth();
        setDate();

        const filtered = bookingInfo.filter((booking) => booking.bookingDate.slice(0, 4) === selectedYear);
        if (filtered.length === 0) {
            setSeatQuantity();
            setTotalRevenue();
            setChartData([]); 
        } else {
            const updatedSeatQuantity = filtered.reduce((total, booking) => total + (booking.seatId.includes(',') ? booking.seatId.split(',').length : 1), 0);
            const updatedTotalRevenue = filtered.reduce((sum, booking) => sum + booking.totalFare, 0);
            console.log(updatedSeatQuantity)
            console.log(updatedTotalRevenue)

            setFilteredBookings(filtered);
            setSeatQuantity(updatedSeatQuantity);
            setTotalRevenue(updatedTotalRevenue);
            calculateMonthlyData(filtered, selectedYear);
        }
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
        setYear();
        setDate();
        const filtered = bookingInfo.filter((booking) => booking.bookingDate.slice(0, 7) === selectedMonth);
        const updatedSeatQuantity = filtered.reduce((total, booking) => total + (booking.seatId.includes(',') ? booking.seatId.split(',').length : 1), 0);
        const updatedTotalRevenue = filtered.reduce((sum, booking) => sum + booking.totalFare, 0);
        setFilteredBookings(filtered);
        setSeatQuantity(updatedSeatQuantity);
        setTotalRevenue(updatedTotalRevenue);
    };
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);
        setYear();
        setMonth();
        const filtered = bookingInfo.filter((booking) => booking.bookingDate.slice(0, 10) === selectedDate);
        const updatedSeatQuantity = filtered.reduce((total, booking) => total + (booking.seatId.includes(',') ? booking.seatId.split(',').length : 1), 0);
        const updatedTotalRevenue = filtered.reduce((sum, booking) => sum + booking.totalFare, 0);
        setFilteredBookings(filtered);
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
        XLSX.writeFile(wb, `Bao_cao_doanh_thu_nam_${year || currentYear}.xlsx`);
    };

    return (
        <Box sx={{ width: "1200px" }}>
            <Box sx={{
                borderRadius: '10px',
                border: '1px solid #e5e5e5',
                padding: '10px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}>
                <Typography sx={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', padding: 2 }}>
                    {month
                        ? `Doanh thu theo tháng ${month}`
                        : year
                            ? `Doanh thu theo năm ${year}`
                            : date ? `Doanh thu theo ngày ${date}`
                                : 'Doanh thu tổng quan'}
                </Typography>

                <TextField
                    color="warning"
                    label="Lọc theo ngày"
                    variant="outlined"
                    size="small"
                    sx={{ width: '250px' }}
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
                    sx={{ width: '250px' }}
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
                <Button variant="contained" color="primary" onClick={fetchingRevenue}>
                    Bỏ lọc
                </Button>

                <Button variant="contained" color="primary" onClick={exportToExcel} sx={{ marginLeft: '20px' }}>
                    Xuất Excel
                </Button>

            </Box>

            <Box sx={{ display: "flex", width: "1200px", alignItems: "center", justifyContent: "space-between" }}>

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
            <Typography sx={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', padding: 2, textAlign: "center" }}>
                Biểu đồ hiển doanh thu năm {currentYear}
            </Typography>

            <Box sx={{
                borderRadius: '10px',
                border: '1px solid #e5e5e5',
                padding: '10px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                marginTop: '20px'
            }}>
                <Typography sx={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', padding: 2 }}>
                    Thông tin doanh thu theo các tiêu chí lọc
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{date ? 'Ngày' : month ? 'Tháng' : year ? 'Năm' : ''}</TableCell>
                                <TableCell align="right">Số vé</TableCell>
                                <TableCell align="right">Doanh thu</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{month || year || date}</TableCell>
                                <TableCell align="right">{seatQuantity}</TableCell>
                                <TableCell align="right">{totalRevenue?.toLocaleString()}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </Box>
    );
};
Revenue.propTypes = {
    userInfo: PropTypes.shape({
        _id: PropTypes.string.isRequired,
    }).isRequired,
    setUserInfo: PropTypes.func.isRequired,
};

export default Revenue;
