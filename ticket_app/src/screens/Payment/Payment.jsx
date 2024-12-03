import { Alert, Image, Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import useAuthData from '../../context/useAuth';
import { Icon, ListItem } from 'react-native-elements';
import { styles } from './styles';
import moment from 'moment-timezone';
import axios from 'axios';
import Loading from '../loading/Loading';
import { getData, postData } from '../../utils/fetching';
import { showSuccessToast } from '../../utils/toast';
import PaymentScreen from './PaymentScreen';

const Payment = () => {

  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (timeLeft > 0 && !orderInfo) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      Alert.alert(
        'Thời gian đã hết',
        'Thời gian giữ vé đã hết. Vui lòng đặt lại vé.',
        [
          {
            text: 'OK',
            onPress: () => nav.goBack(), // Điều hướng về màn hình trước đó
          },
        ]
      );
    }
  }, [timeLeft, orderInfo]);

  // Hàm định dạng thời gian (giây -> phút:giây)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };


  const nav = useNavigation();
  const route = useRoute();
  const ngaydi = route?.params?.ngaydi;

  const date = new Date(ngaydi);

  const departureDate = new Intl.DateTimeFormat('vi-VN', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    weekday: "short"
  }).format(date);
  const customerInfo = route.params?.CustomerInfo;

  const price = route.params?.price


  const trip = route.params?.trip;
  const diemdi = route.params?.trip.routeId.departure;
  const diemden = route.params?.trip.routeId.destination;
  const SeatCodeSelect = route.params?.SeatCodeSelect;
  const SeatCode = route.params?.SeatCode;
  const dropOffPoint = route.params?.dropOffPoint;
  const pickupPoint = route.params?.pickupPoint;
  const bookingId = route.params?.bookingId;
  const bookingID = route.params?.bookingID;
  const [paymentMethod, setPaymentMethod] = useState("Thanh toán qua PayOS");
  const [orderInfo, setOrderInfo] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Set loading to false after data is processed/fetched
    }, 200);
    // Set the header with dynamic data
    nav.setOptions({
      headerTitle: () => (
        <View>
          <View style={styles.viewTitle}>
            <Text style={styles.headerText}>{diemdi}</Text>
            <Icon
              type='ionicon'
              name='bus-outline'
              color="white"
              iconStyle={{ paddingHorizontal: 10 }}
            />
            <Text style={styles.headerText}>{diemden}</Text>
          </View>
          <View style={{ alignItems: "center" }}>

            {departureDate && (
              <Text style={styles.textTime}>
                {departureDate}
              </Text>
            )}


          </View>
        </View >
      ),
      headerBackground: () => (
        <View style={styles.headerBackgroundContainer}>
          <Image
            source={require('../../../img/imageheader.png')}
            style={styles.headerImage}
            resizeMode="cover"
          />

        </View>
      ),
      headerStyle: {
        height: 100,
        backgroundColor: "#f95300",
      },
      headerTitleAlign: "center",
      headerTintColor: 'white',
    });
    const unsubscribe = nav.addListener('beforeRemove', (e) => {
      e.preventDefault();
      const huy = () => {
        nav.dispatch(e.data.action),
          showSuccessToast("Hủy thanh toán", "Hủy thanh toán thành công")
      }
      Alert.alert(
        'Xác nhận',
        'Bạn có chắc chắn muốn thoát khỏi trang thanh toán?',
        [
          { text: 'Hủy', style: 'cancel', onPress: () => { } },
          {
            text: 'Đồng ý',
            style: 'destructive',
            onPress: () => huy()// Cho phép quay lại
          },
        ]
      );

    });

    return unsubscribe;
  }, [nav, diemdi, diemden, trip]);


  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async () => {
    if (!bookingID) {
      setRefreshing(false);
      return;

    }
    try {
      const response = await getData("addPaymentRoute/getOrder", { bookingID })
      console.log("booking id:", bookingID);

      console.log("orrder data:", response.data);

      if (response.status === 200) {
        setOrderInfo(response.data);
      } else if (response.status === 201) {
        return;
      }
    } catch (error) {
      console.error("Error when get order:", error);
    }

  }


  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrder();
    setRefreshing(false);
  };

  if (loading) {
    return <Loading />;
  }
  const handlePayment = async () => {

    try {
      // Gửi yêu cầu thanh toán tới server
      const response = await postData(`addPaymentRoute/add`, {
        bookingId,
        bookingID,
        paymentMethod,
        totalAmountAll: price,
        SeatCode,
      });

      // Kiểm tra kết quả trả về từ server
      if (response.data.checkoutUrl) {
        // Mở URL thanh toán trong trình duyệt
        Linking.openURL(response.data.checkoutUrl).catch((err) => {
          console.error('Failed to open URL:', err);
          Alert.alert('Lỗi', 'Không thể mở trang thanh toán.');
        });
      } else {

        Alert.alert('Thông báo', 'Thanh toán thất bại');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi thanh toán.');
    }
  };
  return (
    <View style={styles.container}>
      {!orderInfo ? (<View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }

          style={styles.body}>
          <View style={styles.viewInfoCustomer}>
            <View style={styles.headerInfoCus}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '450', padding: 8 }}>
                  Thông tin thanh toán
                </Text>
              </View>
            </View>

            <View style={styles.ListItem}>
              <ListItem containerStyle={{ padding: 5 }}>

                <ListItem.Content>
                  <ListItem.Title><Text style={styles.textListItem}>Họ và tên</Text></ListItem.Title>
                </ListItem.Content>
                <ListItem.Title><Text>{customerInfo?.fullName}</Text></ListItem.Title>
              </ListItem>
              <ListItem containerStyle={{ padding: 5 }}>

                <ListItem.Content >
                  <ListItem.Title><Text style={styles.textListItem}>Số điện thoại</Text></ListItem.Title>
                </ListItem.Content>
                <ListItem.Title><Text>{customerInfo?.phoneNumber}</Text></ListItem.Title>
              </ListItem>
              <ListItem containerStyle={{ padding: 5 }}>
                <ListItem.Content >
                  <ListItem.Title><Text style={styles.textListItem}>Email</Text></ListItem.Title>
                </ListItem.Content>
                <ListItem.Title><Text>{customerInfo?.email}</Text></ListItem.Title>
              </ListItem>
            </View>

          </View>
          <View style={styles.viewTrip}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '450', padding: 8 }}>
                Thông tin chuyến đi
              </Text>
              <View style={styles.ListItem}>
                <ListItem containerStyle={{ padding: 5 }}>

                  <ListItem.Content>
                    <ListItem.Title><Text style={styles.textListItem}>Tuyến xe</Text></ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Title><Text style={styles.textTitle} >{trip?.routeId.routeName}</Text></ListItem.Title>
                </ListItem>
                <ListItem containerStyle={{ padding: 5 }}>

                  <ListItem.Content >
                    <ListItem.Title><Text style={styles.textListItem}>Thời gian khởi hành</Text></ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Title><Text style={styles.textTitle} >{trip?.departureTime}</Text></ListItem.Title>
                </ListItem>
                <ListItem containerStyle={{ padding: 5 }}>
                  <ListItem.Content >
                    <ListItem.Title><Text style={styles.textListItem}>Vị trí ghế</Text></ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Title><Text style={styles.textTitle} >{SeatCodeSelect}</Text></ListItem.Title>
                </ListItem>

                <ListItem containerStyle={{ padding: 5 }}>
                  <ListItem.Content >
                    <ListItem.Title><Text style={styles.textListItem}>Điểm lên xe</Text></ListItem.Title>
                  </ListItem.Content>

                  <ListItem.Title>
                    <Text style={styles.textTitle} >
                      {pickupPoint}
                    </Text>
                  </ListItem.Title>
                </ListItem>

                <ListItem containerStyle={{ paddingHorizontal: 5, paddingTop: 0 }}>
                  <ListItem.Content >
                    <ListItem.Title>
                      <Text style={{ color: "#F95300", fontSize: 16 }}>
                        Quý khách vui lòng có mặt tại "{pickupPoint}" trước {moment(trip.departureTime, 'DD/MM/YYYY, HH:mm')
                          .tz('Asia/Ho_Chi_Minh')
                          .format('HH:mm')} để được trung chuyển hoặc kiểm tra thông tin trước khi lên xe!
                      </Text></ListItem.Title>
                  </ListItem.Content>
                </ListItem>


                <ListItem containerStyle={{ paddingHorizontal: 5, paddingVertical: 0 }}>
                  <ListItem.Content >
                    <ListItem.Title><Text style={styles.textListItem}>Điểm xuống xe</Text></ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Title style={{ flexDirection: "column" }}>
                    <Text style={styles.textTitle} >{dropOffPoint}</Text>

                  </ListItem.Title>

                </ListItem>


              </View>
            </View>

          </View>
          <View style={styles.viewPayment}>
            <View style={styles.headerInfoCus}>
              <View>
                <Text style={{ fontSize: 18, color: "grey" }}>
                  Giá vé
                </Text>
              </View>
              <View style={{}}>
                <Text style={{ fontSize: 18 }}>{price}đ</Text>
              </View>
            </View>
            <View style={styles.viewCost}>
              <View>
                <Text style={{ fontSize: 18, color: "grey" }}>
                  Phí thanh toán
                </Text>
              </View>
              <View style={{}}>
                <Text style={{ fontSize: 18 }}>0đ</Text>
              </View>
            </View>

            <View style={styles.headerInfoCus}>
              <View>
                <TouchableWithoutFeedback>
                  <Text style={{ fontSize: 18, color: "grey" }}>
                    Thanh toán mặc định với PayOS
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={{}}>
                <Text style={{ fontSize: 25 }} >{price}đ</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.viewBtn}>
          <View style={{}}>
            <Text style={{ textAlign: "center", padding: 5 }}> Thời gian giữ vé còn lại</Text>
            <Text style={styles.timerText}>{!orderInfo ? formatTime(timeLeft) : "0"} </Text>
          </View>

          <TouchableOpacity
            onPress={() => handlePayment()}
            style={styles.btnContinue}>
            <Text style={styles.textbtn}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
      ) : (
        <View style={styles.container}>
          <PaymentScreen data={orderInfo} bookingId={bookingId} />
        </View>
      )}
    </View>


  )
}

export default Payment

