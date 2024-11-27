import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import useAuthData from '../../context/useAuth';
import { Icon, ListItem } from 'react-native-elements';
import { styles } from './styles';
import moment from 'moment-timezone';
import axios from 'axios';

const Payment = () => {

  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Xóa timer khi component unmount
    }
  }, [timeLeft]);

  // Hàm định dạng thời gian (giây -> phút:giây)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };


  const nav = useNavigation();
  const route = useRoute();

  const customerInfo = route.params?.CustomerInfo;

  const price = route.params?.price


  const trip = route.params?.trip;
  const diemdi = route.params?.trip.routeId.departure;
  const diemden = route.params?.trip.routeId.destination;
  const selectedSeatArray = route.params?.selectedSeatArray;
  const dropOffPoint = route.params?.dropOffPoint;
  const pickupPoint = route.params?.pickupPoint;


  useEffect(() => {

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

            {trip?.departureTime && (
              <Text style={styles.textTime}>
                {moment(trip.departureTime, 'DD/MM/YYYY, HH:mm')
                  .tz('Asia/Ho_Chi_Minh')
                  .format('DD/MM/YYYY ')}
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
  }, [nav, diemdi, diemden, trip]);

  const handlePayment = () => {

    // // Gửi yêu cầu thanh toán đến backend
    // axios.post('http://192.168.1.2:5000/api/order/create_payment_url', {
    //   amount: price,
    // })
    //   .then(response => {
    //     // Chuyển tới màn hình thanh toán VNPAY
    //     if (response.data && response.data.url) {
    //       nav.navigate('PaymentScreen', { paymentUrl: response.data.url });
    //     } else {
    //       Alert.alert('Error', 'Không thể tạo URL thanh toán!');
    //     }
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     Alert.alert('Error', 'Đã xảy ra lỗi khi tạo URL thanh toán!');
    //   });

  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.body}>
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
                  <ListItem.Title><Text style={styles.textListItem}>Số lượng vé</Text></ListItem.Title>
                </ListItem.Content>
                <ListItem.Title><Text style={styles.textTitle} >{selectedSeatArray.length} vé</Text></ListItem.Title>
              </ListItem>
              <ListItem containerStyle={{ padding: 5 }}>
                <ListItem.Content >
                  <ListItem.Title><Text style={styles.textListItem}>Vị trí ghế</Text></ListItem.Title>
                </ListItem.Content>
                <ListItem.Title><Text style={styles.textTitle} >{selectedSeatArray.map(seat => seat).join(', ')}</Text></ListItem.Title>
              </ListItem>

              <ListItem containerStyle={{ padding: 5 }}>
                <ListItem.Content >
                  <ListItem.Title><Text style={styles.textListItem}>Điểm lên xe</Text></ListItem.Title>
                </ListItem.Content>

                <ListItem.Title>
                  <Text style={styles.textTitle} >
                    {pickupPoint?.name}
                  </Text>
                </ListItem.Title>
              </ListItem>
              <ListItem containerStyle={{ paddingHorizontal: 5, paddingVertical: 0 }}>
                <ListItem.Content >
                  <ListItem.Title><Text style={styles.textListItem}></Text></ListItem.Title>
                </ListItem.Content>

                <ListItem.Title style={{ flexDirection: "column" }}>
                  <Text style={styles.textaddress}>{pickupPoint?.address}</Text>
                </ListItem.Title>

              </ListItem>
              <ListItem containerStyle={{ paddingHorizontal: 5, paddingTop: 0 }}>
                <ListItem.Content >
                  <ListItem.Title>
                    <Text style={{ color: "#F95300", fontSize: 16 }}>
                      Quý khách vui lòng có mặt tại "{pickupPoint?.name}" trước {pickupPoint?.time} {moment(trip.departureTime, 'DD/MM/YYYY, HH:mm')
                        .tz('Asia/Ho_Chi_Minh')
                        .format('DD/MM/YYYY ')} để được trung chuyển hoặc kiểm tra thông tin trước khi lên xe!
                    </Text></ListItem.Title>
                </ListItem.Content>
              </ListItem>


              <ListItem containerStyle={{ paddingHorizontal: 5, paddingVertical: 0 }}>
                <ListItem.Content >
                  <ListItem.Title><Text style={styles.textListItem}>Điểm xuống xe</Text></ListItem.Title>
                </ListItem.Content>
                <ListItem.Title style={{ flexDirection: "column" }}>
                  <Text style={styles.textTitle} >{dropOffPoint?.name}</Text>

                </ListItem.Title>

              </ListItem>

              <ListItem containerStyle={{ paddingHorizontal: 5, paddingVertical: 0 }}>
                <ListItem.Content >
                  <ListItem.Title><Text style={styles.textListItem}></Text></ListItem.Title>
                </ListItem.Content>
                <ListItem.Title style={{ flexDirection: "column" }}>
                  <Text style={styles.textaddress}>{dropOffPoint?.address}</Text>
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
                  Phương thức thanh toán
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
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>

        <TouchableOpacity
          onPress={() => handlePayment()}
          style={styles.btnContinue}>
          <Text style={styles.textbtn}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Payment

