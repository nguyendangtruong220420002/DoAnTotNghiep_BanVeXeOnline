/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import logo from "../../../public/images/logohome (2).png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

const PaymetSuccess = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingId, setBookingId] = useState(null);
  const [bookingId2, setBookingId2] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataOfShowTrips, setDataOfShowTrips] = useState(null);
  const [InforCusto, setInforCusto] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('bookingId');
    const id2 = queryParams.get('bookingId2');
    const trips = queryParams.get('dataOfShowTrips');
    const customer = queryParams.get('InforCusto');

    console.log("Raw Params from URL:");
    console.log("bookingId:", id);
    console.log("bookingId2:", id2);
    console.log("dataOfShowTrips (raw):", trips);
    console.log("InforCusto (raw):", customer);

    setBookingId(id);
    setBookingId2(id2);
    try {
      const parsedTrips = trips ? JSON.parse(decodeURIComponent(trips)) : null;
      const parsedCustomer = customer
        ? JSON.parse(decodeURIComponent(customer))
        : null;

      setDataOfShowTrips(parsedTrips);
      setInforCusto(parsedCustomer);

      console.log("Decoded Params:");
      console.log("dataOfShowTrips (parsed):", parsedTrips);
      console.log("InforCusto (parsed):", parsedCustomer);
    } catch (error) {
      console.error("Lỗi khi giải mã hoặc parse JSON:", error);
    }
  }, [location]);
  useEffect(() => {
    // Hàm xử lý thanh toán
    const processPayment = async () => {
      try {
        // Kiểm tra xem bookingId có dữ liệu hay không, nếu có thì gọi API
        if (bookingId) {
          const response = await axios.get(`${API_URL}/api/addPaymentRoute/success`, {
            params: { bookingId },
          });
          console.log(response.data);

          // Sau khi xử lý bookingId, kiểm tra tiếp bookingId2 nếu có
          if (bookingId2) {
            const response2 = await axios.get(`${API_URL}/api/addPaymentRoute/success`, {
              params: { bookingId: bookingId2 },
            });
            console.log(response2.data);
          }
        } else {
          console.log("Không có bookingId, dừng lại.");
        }
      } catch (error) {
        console.error("Lỗi khi xử lý thanh toán:", error);
        setErrorMessage("Đã xảy ra lỗi khi xử lý yêu cầu thanh toán.");
      }
    };

    processPayment();
  }, [bookingId, bookingId2]);
  // useEffect(() => {
  //   if (bookingId) {
  //     axios
  //       .get(`${API_URL}/api/addPaymentRoute/success`, {
  //         params: { bookingId },
  //       })
  //       .then((response) => {
  //         console.log(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Lỗi khi xử lý thanh toán:", error);
  //         setErrorMessage("Đã xảy ra lỗi khi xử lý yêu cầu hủy.");
  //       });
  //   }
  // }, [bookingId]);
  // useEffect(() => {
  //   if (bookingId2) {
  //     axios
  //       .get(`${API_URL}/api/addPaymentRoute/success`, {
  //         params: { bookingId: bookingId2 },
  //       })
  //       .then((response) => {
  //         console.log(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Lỗi khi xử lý thanh toán cho bookingId2:", error);
  //         setErrorMessage("Đã xảy ra lỗi khi xử lý yêu cầu thnanh toán cho bookingId2."
  //         );
  //       });
  //   }
  // }, [bookingId2]);

  return (
    <Box sx={{ position: "relative" }}>
      <AppBar sx={{ backgroundColor: "#e7e7e7", position: "unset" }}>
        <Toolbar
          sx={{
            height: "70px",
            boxShadow: "2px 2px 6px rgba(47, 46, 46, 0.5)",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
            className="menu1"
          >
            <Box
              component="img"
              src={logo}
              alt=""
              sx={{ width: "300px", height: "70px", marginTop: "3px" }}
            ></Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ position: "relative", height: "auto" }}>
        <Box>
          <Box
            sx={{ width: "100%", height: "auto", backgroundColor: "#f2f2f2" }}
          >
            <Box
              sx={{
                width: "1000px",
                height: "auto",
                alignItems: "center",
                margin: "auto",
              }}
            >
              <Box>
                <Button
                  startIcon={
                    <ArrowBackIosNewRoundedIcon
                      sx={{ width: "15px", color: "#888888" }}
                    />
                  }
                  onClick={() =>
                    navigate("/showTrips", {
                      state: { dataOfShowTrips, InforCusto },
                    })
                  }
                  variant="outlined"
                  sx={{
                    border: "none",
                    textTransform: "none",
                    fontSize: "13.5px",
                    color: "#0456ca",
                    lineHeight: "20px",
                    padding: "15px 7px",
                    textShadow: "1px 1px 2px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  Quay lại
                </Button>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "20px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      width: "620px",
                      backgroundColor: "rgb(255, 255, 255)",
                    }}
                  >
                    <Typography
                      className="button35"
                      sx={{ marginLeft: "18px", marginTop: "20px" }}
                    >
                      Phương thức thanh toán{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Typography> Thanh toán thành công </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymetSuccess;
