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
  IconButton,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  Alert,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

const UserManagement = ({ userInfo }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState([]);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
    password: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const roles = ["Business", "User"];

  const fetchUserList = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/get-user-by-admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.users) {
          setUser(data.users);
        } else {
          console.error("Users data is not present in the response.");
        }
      } else {
        console.error("Error fetching user list:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { ...newUser, userId: userInfo._id };

    try {
      let response;
      if (editingUserId) {
        const id = editingUserId;
        response = await fetch(
          `${API_URL}/api/users/edit-user-by-admin/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        );
      } else {
        response = await fetch(`${API_URL}/api/users/create-user-by-admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      }
      if (response.ok) {
        await fetchUserList();
        setNewUser({
          fullName: "",
          email: "",
          phoneNumber: "",
          role: "",
          password: "",
        });
        setEditingUserId(null);
        setAlert({
          open: true,
          message: editingUserId
            ? "Cập nhập thành công"
            : "Tạo người dùng thành công",
          severity: "success",
        });
      } else {
        const errorData = await response.json();
        setAlert({
          open: true,
          message: errorData.error || "Có lỗi xảy ra",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({ open: true, message: "Có lỗi xảy ra ", severity: "error" });
    }
  };

  const onEdit = (userItem) => {
    setNewUser({
      fullName: userItem.fullName,
      email: userItem.email,
      phoneNumber: userItem.phoneNumber,
      role: userItem.role,
      password: "",
    });
    setEditingUserId(userItem._id);
  };

  useEffect(() => {
    fetchUserList();
  }, [userInfo._id]);

  const onDeleteUser = async (userItem) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa người dùng này không?"
    );
    const id = userItem._id;
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${API_URL}/api/users/delete-user-by-admin/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          await fetchUserList();
          setAlert({
            open: true,
            message: "Xóa người dùng thành công!",
            severity: "success",
          });
        } else {
          const errorData = await response.json();
          setAlert({
            open: true,
            message: errorData.error || "Có lỗi xảy ra!",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        setAlert({ open: true, message: "Có lỗi xảy ra!", severity: "error" });
      }
    }
  };
  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };
  const filteredUsers = user.filter(
    (userItem) =>
      userItem.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userItem.phoneNumber.includes(searchQuery)
  );
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderRadius: "10px",
          border: "1px solid #e5e5e5",
          padding: "10px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography sx={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
          {editingUserId ? "Sửa người dùng" : "Thêm người dùng"}
        </Typography>
        <Box>
          <Box sx={{ margin: "10px" }}>
            <TextField
              label="Họ và tên"
              required
              variant="outlined"
              size="small"
              color="warning"
              sx={{
                width: "300px",
                mr: 2,
                fontSize: "13px",
                backgroundColor: "#fef3f0",
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 0 2px rgb(255, 224, 212)",
                },
              }}
              name="fullName"
              value={newUser.fullName}
              onChange={handleChange}
            />
            <TextField
              label="Số điện thoại"
              required
              variant="outlined"
              size="small"
              color="warning"
              sx={{
                width: "300px",
                mr: 2,
                fontSize: "13px",
                backgroundColor: "#fef3f0",
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 0 2px rgb(255, 224, 212)",
                },
              }}
              name="phoneNumber"
              value={newUser.phoneNumber}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              required
              variant="outlined"
              size="small"
              color="warning"
              sx={{
                width: "300px",
                mr: 2,
                fontSize: "13px",
                backgroundColor: "#fef3f0",
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 0 2px rgb(255, 224, 212)",
                },
              }}
              name="email"
              value={newUser.email}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ display: "flex", marginBottom: "5px", margin: "10px" }}>
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
                Trạng thái
              </InputLabel>
              <Select
                name="role"
                size="small"
                label="Trạng thái"
                value={newUser.role}
                onChange={handleChange}
                color="warning"
                sx={{
                  fontSize: "13px",
                  mr: 2,
                  backgroundColor: "#fef3f0",
                  "&.Mui-focused": {
                    backgroundColor: "white",
                    boxShadow: "0 0 0 2px rgb(255, 224, 212)",
                  },
                }}
              >
                {roles.map((role, index) => (
                  <MenuItem key={index} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Mật khẩu"
              required
              variant="outlined"
              size="small"
              color="warning"
              sx={{
                fontSize: "13px",
                backgroundColor: "#fef3f0",
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 0 2px rgb(255, 224, 212)",
                },
              }}
              name="password"
              value={newUser.password}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ ml: 2 }}
            >
              {editingUserId ? "Cập nhật" : "Tạo"}
            </Button>
            <Stack sx={{ width: "300px" }}>
              {alert.open && (
                <Alert severity={alert.severity} onClose={handleAlertClose}>
                  {alert.message}
                </Alert>
              )}
            </Stack>
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
        <Typography sx={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
          Danh sách người dùng
        </Typography>

        <TextField
          label="Tìm kiếm theo tên hoặc số điện thoại"
          variant="outlined"
          size="small"
          color="warning"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            fontSize: "13px",
            width: "600px",
            ml: 30,
            backgroundColor: "#fef3f0",
            "&.Mui-focused": {
              backgroundColor: "white",
              boxShadow: "0 0 0 2px rgb(255, 224, 212)",
            },
          }}
        />
        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid #e5e5e5",
            marginTop: "10px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "center" }}>STT</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Họ tên</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  Số điện thoại
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>Quyền</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Địa chỉ</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Công Cụ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((userItem, index) => (
                  <TableRow key={userItem._id}>
                    <TableCell sx={{ textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {userItem.fullName}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {userItem.phoneNumber}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {userItem.role}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {userItem.address}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton
                        sx={{
                          color: "#f4b807",
                          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                          borderRadius: "50px",
                          height: "30px",
                          "&:hover": { color: "#313731" },
                        }}
                        onClick={() => onEdit(userItem)}
                      >
                        <ReportProblemOutlinedIcon sx={{ width: "25px" }} />
                      </IconButton>
                      <IconButton
                        sx={{
                          color: "#F44336",
                          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                          borderRadius: "50px",
                          height: "30px",
                          "&:hover": { color: "#313731" },
                        }}
                        onClick={() => onDeleteUser(userItem)}
                      >
                        <DeleteForeverOutlinedIcon sx={{ width: "25px" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                    No users found.
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell colSpan={6} sx={{ fontWeight: "bold" }}>
                  Tổng số người dùng: {filteredUsers.length}
                  <Typography>
                    {" "}
                    Business:{" "}
                    {
                      filteredUsers.filter(
                        (userItem) => userItem.role === "Business"
                      ).length
                    }
                  </Typography>
                  <Typography>
                    {" "}
                    User:{" "}
                    {
                      filteredUsers.filter(
                        (userItem) => userItem.role === "User"
                      ).length
                    }
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

UserManagement.propTypes = {
  userInfo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserManagement;
