/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Typography, FormControl, FormControlLabel, RadioGroup, Radio, TextField, Autocomplete, Button } from '@mui/material';
import '../HomePage/css/content.css';
import axios from 'axios';
import { vi } from 'date-fns/locale';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';




const Content = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fromProvince, setFromProvince] = useState(null);
    const [toProvince, setToProvince] = useState(null);
    const [dateRange, setDateRange] = useState([new Date(), null]);
    const [selectedValue, setSelectedValue] = useState('one-way');
   
    const today = new Date();
    const [numberOfTickets, setNumberOfTickets] = useState(1);
    
    useEffect(() => {
        const fetchProvincesAndDistricts = async () => {
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/?depth=2');
                const provincesData = response.data;
                // Cập nhật dữ liệu tỉnh/thành phố
                const cleanedProvinces = provincesData.map(province => ({
                    ...province,
                    name: province.name.replace(/^(Tỉnh|Thành phố) /, '')
                }));

                const flattenedOptions = provincesData.flatMap(province =>
                    province.districts.map(district => ({
                        ...district,
                        provinceName: province.name,
                        label: `${district.name.replace(/^(Huyện|Quận) /, '')} - ${province.name.replace(/^(Tỉnh|Thành phố) /, '')}` 
                    }))
                );

                setProvinces(cleanedProvinces);
                setDistricts(flattenedOptions);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi Khi Lấy dữ Liệu API:', error);
                setLoading(false);
            }
        };

        fetchProvincesAndDistricts();
    }, []);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleSwap = () => {
        const temp = fromProvince;
        setFromProvince(toProvince);
        setToProvince(temp);
    };

    const groupOptions = (options) => {
        const grouped = options.reduce((acc, item) => {
            const category = item.provinceName ? 'Quận/Huyện' : 'Tỉnh/Thành phố';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});

        return Object.keys(grouped).map((category) => ({
            category,
            items: grouped[category]
        }));
    };

    const options = [
        ...provinces.map(province => ({
            ...province,
            label: `${province.name}` 
        })),
        ...districts
    ];

    const groupedOptions = groupOptions(options);
    
    return (
        <Box>
            <Typography
                sx={{ width: '1130px', height: '325px', backgroundColor: 'white', marginTop: '10px' }}
                className='border1'
            >
                <Box sx={{ padding: '20px', }}>
                    <FormControl component="fieldset">
                        <RadioGroup row aria-label="trip-type" value={selectedValue} onChange={handleChange}>
                            <FormControlLabel 
                                value="one-way"
                                control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, width: '25px' }} className={selectedValue === 'one-way' ? 'radio-checked' : ''} />}
                                label={<span style={{ fontSize: '15px', marginRight: '20px' }}>Một chiều</span>}
                                className={selectedValue === 'one-way' ? 'radio-label-checked' : 'radio-label'}
                            />
                            <FormControlLabel
                                value="round-trip"
                                control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, width: '25px' }} className={selectedValue === 'round-trip' ? 'radio-checked' : ''} />}
                                label={<span style={{ fontSize: '15px' }}>Khứ hồi</span>}
                                className={selectedValue === 'round-trip' ? 'radio-label-checked' : 'radio-label'}
                            />
                        </RadioGroup>
                    </FormControl>

                    <Box sx={{display: 'flex'  }}> 
                        <Box sx={{ marginTop: '20px', display: 'flex',  }}>
                        <Autocomplete
                            options={groupedOptions.flatMap(group => group.items)}
                            groupBy={(option) => {
                                return option.provinceName ? 'Quận/Huyện' : 'Tỉnh/Thành phố';
                            }}
                            getOptionLabel={(option) => option.label}
                            value={fromProvince}
                            onChange={(event, newValue) => setFromProvince(newValue)}
                            loading={loading}
                            renderInput={(params) => (
                                <TextField {...params} label="Nơi xuất phát" fullWidth placeholder='Chọn Tỉnh thành' color="warning"
                                    sx={{ width: '270px' }}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: { color: 'black', fontSize: '17px', fontFamily: 'InterTight, sans-serif', fontWeight: 'bold' }
                                    }}
                                    InputLabelProps={{
                                        sx: { color: 'black', fontSize: '17px' }
                                    }} />
                            )}
                        />

                        <Button onClick={handleSwap} variant="outlined" sx={{ height: '30px', width: '5px', mt: 2, border: 'none', borderRadius: '50%' }}>
                            <SwapHorizOutlinedIcon sx={{ color: 'rgb(240, 82, 34)' }} />
                        </Button>

                        <Autocomplete
                            options={groupedOptions.flatMap(group => group.items)}
                            groupBy={(option) => {
                                return option.provinceName ? 'Quận/Huyện' : 'Tỉnh/Thành phố';
                            }}
                            getOptionLabel={(option) => option.label}
                            value={fromProvince}
                            onChange={(event, newValue) => setFromProvince(newValue)}
                            loading={loading}
                            renderInput={(params) => (
                                <TextField {...params} label="Nơi đến" fullWidth placeholder='Chọn Tỉnh thành' color="warning"
                                    sx={{ width: '270px' }}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: { color: 'black', fontSize: '17px', fontFamily: 'InterTight, sans-serif', fontWeight: 'bold' }
                                    }}
                                    InputLabelProps={{
                                        sx: { color: 'black', fontSize: '17px' }
                                    }} />
                            )}
                        />
                    </Box>
                    <Box sx={{ marginTop: '20px', display: 'flex', margin: '20px' }}>
    {selectedValue === 'round-trip' ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
                <DatePicker
                    selected={dateRange[0]} // Ngày đi
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    className="date"
                    onChange={(date) => {
                        if (date && date <= dateRange[1]) {
                            setDateRange([date, dateRange[1]]); // Chỉ cập nhật ngày đi
                        } else {
                            setDateRange([date, date]); // Reset nếu ngày đi lớn hơn ngày về
                        }
                    }}
                    minDate={today}
                    dateFormat="eeeee, dd/MM/yyyy"
                    locale={vi}
                    customInput={<TextField label="Ngày đi" sx={{ width: '155px' }} />}
                />
            </Box>
            <Box sx={{ marginLeft: '20px' }}>
                <DatePicker
                    selected={dateRange[1]} // Ngày về
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    className="date"
                    onChange={(date) => {
                        if (date && date >= dateRange[0]) {
                            setDateRange([dateRange[0], date]); // Chỉ cập nhật ngày về
                        }
                    }}
                    minDate={dateRange[0] || today} // Ngày về phải sau ngày đi
                    dateFormat="eeeee, dd/MM/yyyy"
                    locale={vi}
                    customInput={<TextField label="Ngày về" sx={{ width: '155px' }} />}
                />
            </Box>
        </Box>
    ) : (
        <DatePicker
            selected={dateRange[0]} // Chế độ 1 chiều, chỉ có ngày đi
            onChange={(date) => {
                if (date && date < today) {
                    date = today;
                }
                setDateRange([date, null]);
            }}
            minDate={today}
            locale={vi}
            dateFormat="eeeee, dd/MM/yyyy"
            customInput={<TextField label="Ngày đi" sx={{ width: '330px' }} />}
        />
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
            }
        }}
        sx={{ width: '100px', marginLeft: '20px', textAlign: 'center' }}
    />
</Box>

                </Box>
                <Box sx={{ marginTop: '20px', display: 'flex', alignItems: 'center',  }}>
                       
                       <Button variant="contained" color="primary" onClick={() => { /* Xử lý tìm chuyến */ }}>
                           Tìm chuyến
                       </Button>
                   </Box>
            </Box>          
            </Typography>
        </Box>
    );
};

export default Content;
