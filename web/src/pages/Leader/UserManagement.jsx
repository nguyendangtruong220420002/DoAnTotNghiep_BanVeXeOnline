/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
    Box, Paper, TableContainer, Table, TableCell, TableHead, TableRow, TableBody, IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button
} from '@mui/material';
import PropTypes from 'prop-types';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

const UserManagement = ({ userInfo }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [user, setUser] = useState([]);

    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        role: '',
        password: '',
    });

    const fetchUserList = async () => {
        try {
            const response = await fetch(`${API_URL}/api/users/get-user-by-admin`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Fetched data: ", data); // Log the entire response to check the structure
                if (data.users) {
                    setUser(data.users); // Ensure you are setting the users array
                } else {
                    console.error("Users data is not present in the response.");
                }
            } else {
                console.error('Error fetching user list:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleSubmit = async () => {

        console.log("New User: ", newUser);

        try {
            const response = await fetch(`${API_URL}/api/users/create-user-by-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Created user: ", data);
                fetchUserList(); // Fetch the updated user list after creating a new user
                setNewUser({
                    fullName: '',
                    phoneNumber: '',
                    role: '',
                    email: '',
                    password: ''
                });
            } else {
                console.error('Error creating user:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchUserList();
    }, [userInfo._id]);

    console.log("User state: ", user); // Log user state to verify if it's set correctly

    return (
        <Box sx={{ width: '100%' }}>
            <Box>
                <TextField
                    label="Họ và tên"
                    required
                    variant="outlined"
                    size="small"
                    color="warning"
                    sx={{ width: '250px' }}
                    name="fullName"
                    value={newUser.fullName}
                    onChange={handleChange}
                    InputProps={{
                        sx: {
                            fontSize: '13px',
                            backgroundColor: '#fef3f0',
                            '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 0 0 2px rgb(255, 224, 212)' },
                        },
                    }}
                    InputLabelProps={{ sx: { fontSize: '13px' } }}
                />
                <TextField
                    label="Số điện thoại"
                    required
                    variant="outlined"
                    size="small"
                    color="warning"
                    sx={{ width: '250px' }}
                    name="phoneNumber"
                    value={newUser.phoneNumber}
                    onChange={handleChange}
                    InputProps={{
                        sx: {
                            fontSize: '13px',
                            backgroundColor: '#fef3f0',
                            '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 0 0 2px rgb(255, 224, 212)' },
                        },
                    }}
                    InputLabelProps={{ sx: { fontSize: '13px' } }}
                />
                <TextField
                    label="Email"
                    required
                    variant="outlined"
                    size="small"
                    color="warning"
                    sx={{ width: '250px' }}
                    name="email"
                    value={newUser.email}
                    onChange={handleChange}
                    InputProps={{
                        sx: {
                            fontSize: '13px',
                            backgroundColor: '#fef3f0',
                            '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 0 0 2px rgb(255, 224, 212)' },
                        },
                    }}
                    InputLabelProps={{ sx: { fontSize: '13px' } }}
                />
                <TextField
                    select
                    required
                    label="Quyền"
                    variant="outlined"
                    size="small"
                    color="warning"
                    sx={{ width: '250px' }}
                    name="role"
                    value={newUser.role}
                    onChange={handleChange}
                    InputProps={{
                        sx: {
                            fontSize: '13px',
                            backgroundColor: '#fef3f0',
                            '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 0 0 2px rgb(255, 224, 212)' },
                        },
                    }}
                    InputLabelProps={{ sx: { fontSize: '13px' } }}
                >
                    <MenuItem value="Business">Business</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                </TextField>
                <TextField
                    label="Mật khẩu"
                    required
                    variant="outlined"
                    size="small"
                    color="warning"
                    sx={{ width: '250px' }}
                    name="password"
                    value={newUser.password}
                    onChange={handleChange}
                    InputProps={{
                        sx: {
                            fontSize: '13px',
                            backgroundColor: '#fef3f0',
                            '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 0 0 2px rgb(255, 224, 212)' },
                        },
                    }}
                    InputLabelProps={{ sx: { fontSize: '13px' } }}
                />
                <Button variant="contained" color="success" onClick={handleSubmit} sx={{ ml: 2 }}>
                    Tạo
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ border: '1px solid #e5e5e5', marginTop: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ minWidth: 5, textAlign: 'center' }}>STT</TableCell>
                            <TableCell sx={{ minWidth: 5, textAlign: 'center' }}>Họ tên</TableCell>
                            <TableCell sx={{ minWidth: 5, textAlign: 'center' }}>Số điện thoại</TableCell>
                            <TableCell sx={{ minWidth: 5, textAlign: 'center' }}>Quyền</TableCell>
                            <TableCell sx={{ minWidth: 5, textAlign: 'center' }}>Địa chỉ</TableCell>
                            <TableCell sx={{ minWidth: 5, textAlign: 'center' }}>Công Cụ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {user.length > 0 ? (
                            user.map((userItem, index) => (
                                <TableRow key={userItem._id}>
                                    <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{userItem.fullName}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{userItem.phoneNumber}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{userItem.role}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{userItem.address}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton>
                                            <LockRoundedIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

UserManagement.propTypes = {
    userInfo: PropTypes.shape({
        _id: PropTypes.string.isRequired,
    }).isRequired,
};

export default UserManagement;
