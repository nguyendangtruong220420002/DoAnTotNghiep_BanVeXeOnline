/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Tab,
  Typography,
  TextField,
  Alert,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import logout from "../../../public/images/log-out.png";
import history from "../../../public/images/history.png";
import information from "../../../public/images/information.png";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import profile from "../../../public/images/profile.png";
import TicketOfMy from "../AboutPage/TicketOfMy";
import reset  from '../../../public/images/reset-password.png';
import axios from "axios";

const Ticket = ({ onLogout, userInfo, setUserInfo }) => {
  const [value, setValue] = useState("2");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePath, setImagePath] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      //console.log('Token retrieved:', token);
    }
  }, []);

  const handlePasswordReset = async () => {
    const token = localStorage.getItem('token');  
  
    if (!token) {
      console.log('Token not found');
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_URL}/api/users/change-password/${userInfo._id}`,
        {
          phoneNumber,
          newPassword,
          oldPassword,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,  
          },
        }
      );
  
      setAlert({
        open: true,
        message: 'Mật khẩu đã được thay đổi thành công!',
        severity: 'success',
      });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Đã có lỗi xảy ra khi thay đổi mật khẩu.',
        severity: 'error',
      });
     
    }
  };
  useEffect(() => {
    if (message) {
//   console.log("Thông báo mới:", message);
    }
  }, [message]);
  useEffect(() => {
    if (userInfo) {
   //   console.log("Số điện thoại:", userInfo.phoneNumber);
    //  console.log("Họ và tên:", userInfo.fullName);
    }
  }, [userInfo]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === "3") {
      onLogout();
    }
  };

  const handleInputChange = (e, field) => {
    setUserInfo({ ...userInfo, [field]: e.target.value });
  };
  const resetForm = () => {
    setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
    setIsEditing(false);
    setMessage("");
    setImagePath("");
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!userInfo) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Vui lòng đăng nhập để thực hiện thao tác này.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", userInfo.fullName);
    formData.append("email", userInfo.email);
    formData.append("phoneNumber", userInfo.phoneNumber);
    formData.append("address", userInfo.address);
    console.log("userInfo.img:", userInfo.img);
    if (userInfo.img) {
      formData.append("img", userInfo.img);
      console.log("Image added to formData.");
    } else {
      console.error("Image is null. Please provide a valid image.");
    }

    try {
      const response = await fetch(`${API_URL}/api/users/${userInfo._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log("body", formData);
      if (!response.ok) {
        throw new Error("Cập nhật thất bại");
      }

      const updatedUser = await response.json();
      setUserInfo(updatedUser.user);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser.user));
      console.log(
        "User info saved to localStorage:",
        JSON.stringify(updatedUser.user)
      );

      setMessage("Cập nhật thành công!");
      resetForm();
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
      setMessage("Cập nhật thất bại!");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleUpdate();
    }
    setIsEditing(!isEditing);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserInfo({ ...userInfo, img: file });
      setImagePath(URL.createObjectURL(file));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        maxWidth: "1128px",
        justifyContent: "space-around",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          width: "252px",
          height: "300px",
          marginTop: "24px",
          backgroundColor: "#fffefe",
          borderRadius: "15px",
          border: "2px solid #e5e7eb",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            orientation="vertical"
            sx={{ marginTop: "20px", marginLeft: "10px" }}
          >
            <Tab
              label={
                <Box
                  sx={{
                    position: "relative",
                    marginTop: "3px",
                    marginLeft: "5px",
                  }}
                >
                  Thông tin cá nhân
                </Box>
              }
              value="1"
              className="button6"
              iconPosition="start"
              sx={{ display: "flex", justifyContent: "left", minHeight: 0 }}
              icon={
                <Box
                  component="img"
                  src={information}
                  sx={{ width: "37px", height: "37px" }}
                ></Box>
              }
            />
            <Tab
              label={
                <Box
                  sx={{
                    position: "relative",
                    marginTop: "3px",
                    marginLeft: "5px",
                  }}
                >
                  Đổi mật khẩu
                </Box>
              }
              value="4"
              className="button6"
              iconPosition="start"
              sx={{ display: "flex", justifyContent: "left", minHeight: 0 }}
              icon={
                <Box
                  component="img"
                  src={information}
                  sx={{ width: "37px", height: "37px" }}
                ></Box>
              }
            />
            <Tab
              label={
                <Box
                  sx={{
                    position: "relative",
                    marginTop: "3px",
                    marginLeft: "5px",
                  }}
                >
                  Lịch sử mua vé
                </Box>
              }
              value="2"
              className="button6"
              iconPosition="start"
              sx={{ display: "flex", justifyContent: "left", minHeight: 0 }}
              icon={
                <Box
                  component="img"
                  src={history}
                  sx={{ width: "37px", height: "37px" }}
                ></Box>
              }
            />
            <Tab
              label={
                <Box
                  sx={{
                    position: "relative",
                    marginTop: "3px",
                    marginLeft: "5px",
                  }}
                >
                  Đăng Xuất
                </Box>
              }
              value="3"
              className="button6"
              iconPosition="start"
              sx={{ display: "flex", justifyContent: "left", minHeight: 0 }}
              icon={
                <Box
                  component="img"
                  src={logout}
                  sx={{ width: "37px", height: "37px" }}
                ></Box>
              }
            />
          </TabList>
        </TabContext>
      </Box>
      <Box sx={{ width: "824px", height: "500px", backgroundColor: "#fffafa" }}>
        <TabContext value={value}>
          <TabPanel value="1">
            <Box>
              <Typography
                sx={{
                  fontSize: "23px",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                Thông tin tài khoản
              </Typography>
              <Typography
                sx={{
                  fontSize: "15px",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                  color: "#79828a",
                }}
              >
                Quản lý thông tin hồ sơ để bảo mật tài khoản
              </Typography>
            </Box>
            <Box
              sx={{
                width: "770px",
                height: "398px",
                marginTop: "20px",
                backgroundColor: "#fffafa",
                borderRadius: "15px",
                border: "2px solid #e5e7eb",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Box
                sx={{ display: "flex", marginTop: "30px", marginLeft: "20px" }}
              >
                <Box
                  sx={{ width: "210px", height: "100%", marginLeft: "30px" }}
                >
                  <Box
                    component="img"
                    src={imagePath || userInfo?.img || profile}
                    sx={{
                      width: "190px",
                      height: "190px",
                      borderRadius: "50%",
                    }}
                  />
                  <input
                    accept="image/*"
                    type="file"
                    hidden
                    onChange={handleImageChange}
                    style={{
                      marginTop: "20px",
                      display: isEditing ? "block" : "none",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    width: "460px",
                    marginRight: "30px",
                    marginLeft: "10px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography
                      sx={{
                        width: "140px",
                        color: "#637280",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                        fontSize: "15px",
                      }}
                    >
                      Họ và Tên
                    </Typography>
                    <Typography
                      sx={{
                        width: "30px",
                        color: "#637280",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                        fontSize: "15px",
                      }}
                    >
                      :
                    </Typography>
                    <TextField
                      fullWidth
                      color="warning"
                      value={userInfo?.fullName || ""}
                      onChange={(e) => handleInputChange(e, "fullName")}
                      variant="standard"
                      InputProps={{
                        readOnly: !isEditing,
                        sx: {
                          fontSize: "14px",
                          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                          color: "black",
                        },
                      }}
                    />
                    {isEditing && (
                      <EditRoundedIcon
                        sx={{ marginLeft: 2, color: "#637280", width: "20px" }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography
                      sx={{
                        width: "140px",
                        color: "#637280",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                        fontSize: "15px",
                      }}
                    >
                      Số điện thoại
                    </Typography>
                    <Typography
                      sx={{
                        width: "30px",
                        color: "#637280",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                        fontSize: "15px",
                      }}
                    >
                      :
                    </Typography>
                    <TextField
                      fullWidth
                      color="warning"
                      value={userInfo?.phoneNumber || ""}
                      onChange={(e) => handleInputChange(e, "phoneNumber")}
                      variant="standard"
                      InputProps={{
                        readOnly: !isEditing,
                        sx: {
                          fontSize: "14px",
                          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                          color: "black",
                        },
                      }}
                    />
                    {isEditing && (
                      <EditRoundedIcon
                        sx={{ marginLeft: 1, color: "#637280", width: "20px" }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography
                      sx={{
                        width: "140px",
                        color: "#637280",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                        fontSize: "15px",
                      }}
                    >
                      Email
                    </Typography>
                    <Typography
                      sx={{
                        width: "30px",
                        color: "#637280",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                        fontSize: "15px",
                      }}
                    >
                      :
                    </Typography>
                    <TextField
                      color="warning"
                      fullWidth
                      value={userInfo?.email || ""}
                      onChange={(e) => handleInputChange(e, "email")}
                      variant="standard"
                      InputProps={{
                        readOnly: !isEditing,
                        sx: {
                          fontSize: "14px",
                          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                          color: "black",
                        },
                      }}
                    />
                    {isEditing && (
                      <EditRoundedIcon
                        sx={{ marginLeft: 1, color: "#637280", width: "20px" }}
                      />
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography
                      sx={{
                        width: "140px",
                        color: "#637280",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                        fontSize: "15px",
                      }}
                    >
                      Địa chỉ
                    </Typography>
                    <Typography
                      sx={{
                        width: "30px",
                        color: "#637280",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                        fontSize: "15px",
                      }}
                    >
                      :
                    </Typography>
                    <TextField
                      color="warning"
                      fullWidth
                      value={userInfo?.address || ""}
                      onChange={(e) => handleInputChange(e, "address")}
                      variant="standard"
                      InputProps={{
                        readOnly: !isEditing,
                        sx: {
                          fontSize: "14px",
                          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                          color: "black",
                        },
                      }}
                    />
                    {isEditing && (
                      <EditRoundedIcon
                        sx={{ marginLeft: 1, color: "#637280", width: "20px" }}
                      />
                    )}
                  </Box>

                  <Box>
                    {message && (
                      <Stack sx={{ marginTop: 2 }} spacing={2}>
                        <Alert
                          severity={
                            message.includes("thất bại") ? "error" : "success"
                          }
                        >
                          {message}
                        </Alert>
                      </Stack>
                    )}
                    <Button
                      variant="contained"
                      onClick={handleEditToggle}
                      sx={{
                        mr: 2,
                        marginLeft: "120px",
                        marginTop: "20px",
                        borderRadius: "50px",
                        width: "120px",
                        height: "40px",
                        fontSize: "13px",
                        backgroundColor: isEditing ? "#9e9e9e" : "#dc635b",
                        color: isEditing ? "white" : "white",
                        "&:hover": {
                          backgroundColor: isEditing ? "#b55b50" : "#757575",
                        },
                      }}
                    >
                      {isEditing ? "Hủy" : "Chỉnh Sửa"}
                    </Button>

                    {isEditing && (
                      <Button
                        variant="contained"
                        onClick={handleUpdate}
                        sx={{
                          borderRadius: "50px",
                          width: "120px",
                          height: "40px",
                          fontSize: "13px",
                          marginTop: "20px",
                          backgroundColor: "#dc635b",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#b55b50",
                          },
                        }}
                      >
                        Cập Nhật
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value="2">
            <TicketOfMy userInfo={userInfo}></TicketOfMy>
          </TabPanel>
          <TabPanel value="4">
            <Box>
              <Typography
                sx={{
                  fontSize: "23px",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                Đặt lại mật khẩu
              </Typography>
              <Typography
                sx={{
                  fontSize: "15px",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                  color: "#79828a",
                }}
              >
                Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người
                khác
              </Typography>
              <Box
                sx={{
                  width: "770px",
                  height: "398px",
                  marginTop: "20px",
                  backgroundColor: "#fffafa",
                  borderRadius: "15px",
                  border: "2px solid #e5e7eb",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "auto",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "23px",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                      marginTop: "20px",
                    }}
                  >
                    {userInfo.phoneNumber}
                  </Typography>
                  <TextField
                    sx={{ marginTop: "20px", width: "50%" }}
                    color="warning"
                    InputProps={{
                      sx: {
                        fontSize: "13px",
                        backgroundColor: "#fef3f0",
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
                    size="small"
                    label="Mật khẩu cũ"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <TextField
                    sx={{ marginTop: "20px", width: "50%" }}
                    color="warning"
                    InputProps={{
                      sx: {
                        fontSize: "13px",
                        backgroundColor: "#fef3f0",
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
                    size="small"
                    label="Mật khẩu mới"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <TextField
                    sx={{ marginTop: "20px", width: "50%" }}
                    color="warning"
                    InputProps={{
                      sx: {
                        fontSize: "13px",
                        backgroundColor: "#fef3f0",
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
                    size="small"
                    label="Nhập lại mật khẩu"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    sx={{ marginTop: "20px", width: "30%" }}
                    variant="contained"
                    color="primary"
                    onClick={handlePasswordReset}
                  >
                    Đổi mật khẩu
                  </Button>
                </Box>
                <Stack
                  sx={{
                    width: "400px",
                    margin: "auto",
                    position: "absolute",
                    bottom: "800px",
                    left: "85%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                  }}
                >
                  {alert.open && (
                    <Alert
                      variant="filled"
                      severity={alert.severity}
                      onClose={() =>
                        setAlert((prev) => ({ ...prev, open: false }))
                      }
                    >
                      {alert.message}
                    </Alert>
                  )}
                </Stack>
              </Box>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

Ticket.propTypes = {
  onLogout: PropTypes.func.isRequired,
  userInfo: PropTypes.func,
  setUserInfo: PropTypes.func,
};

export default Ticket;
