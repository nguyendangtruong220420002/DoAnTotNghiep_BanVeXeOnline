import { FlatList, Image, SafeAreaView, StyleSheet, Text, View, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { styles } from './styles'
import { Icon, Tab, TabView } from 'react-native-elements'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { getData } from '../../utils/fetching'
import useAuthData from '../../context/useAuth'
import moment from 'moment-timezone';
import Loading from '../loading/Loading'

const Ticket = () => {

  const nav = useNavigation()
  const { user } = useAuthData();
  const [bookingTicket, setBookingTicket] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // Set the header with dynamic data
    nav.setOptions({
      headerTitle: () => (
        <View style={styles.viewTitle}>
          <Text style={styles.headerText}>Vé xe</Text>
        </View>
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
  }, [nav]);

  const fetchBookingData = async () => {
    try {
      const res = await getData("bookingRoutes/getBookingByUser", { userId: user?._id })
      if (res.status === 201) {
        return;
      }
      if (res.status === 200) {
        setLoading(false)
        setBookingTicket(res?.data);
      }
    } catch (error) {
      setLoading(false)
      console.error("error when fetching booking data");
    }
  }

  useEffect(() => {
    fetchBookingData();
  }, [nav, user])

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookingData();
    setRefreshing(false);
  };

  const [index, setIndex] = useState(0);
  const today = new Date()
  const todayDateString = today.toLocaleDateString();

  const upcomingBookings = bookingTicket?.filter(item => {
    const formattedDepartureTime = moment(item.departureDate, 'ww ,DD/MM/YYYY')
      .tz('Asia/Ho_Chi_Minh')
      .format("DD/MM/YYYY")


    // So sánh với ngày hiện tại
    return formattedDepartureTime > todayDateString;
  });

  const historyBookings = bookingTicket;

  if (loading) {
    return <Loading />;
  }

  return (
    <>

      <View style={styles.container}>
        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          indicatorStyle={{
            backgroundColor: '#f95300',
            height: 3
          }}

        >
          <Tab.Item
            title="Sắp khởi hành"
            titleStyle={{ fontSize: 14, color: index === 0 ? "#f95300" : "#333", }}
            containerStyle={{ backgroundColor: "#fff" }}
          />
          <Tab.Item
            title="Lịch sử vé"
            titleStyle={{ fontSize: 14, color: index === 1 ? "#f95300" : "#333" }}
            containerStyle={{ backgroundColor: "#fff" }}
          />
        </Tab>
        <TabView value={index} onChange={setIndex} animationType="spring">
          {upcomingBookings && upcomingBookings.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
              data={upcomingBookings}
              keyExtractor={(item) => item.BookingID.toString()}
              renderItem={({ item }) => (
                <View style={styles.bookingCard}>
                  <View style={styles.headerCard}>
                    <View>
                      <Text style={styles.bookingTitle}>
                        Mã vé/ Code: {item.BookingID}
                      </Text>
                      <Text style={[styles.bookingDetails, { color: item.paymentStatus === 'Đã thanh toán' ? 'green' : "red" }]}>
                        {item.paymentStatus === 'Thanh toán không thành công' && 'Đã hủy'}
                        {item.paymentStatus === 'Đã thanh toán' && 'Đã thanh toán'}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.bookingTitle}>
                        Nhà xe {item.tripId.busId.busName}
                      </Text>

                      <Text style={styles.bookingFare}>
                        {item.totalFare} VND
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dashedLineHorizontal} />
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.bookingDetails}>
                      Tuyến:
                    </Text>
                    <Text style={styles.bookingInfo}>
                      {item.selectedDepartureName} - {item.selectedDestinationName}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.bookingDetails}>
                      Số ghế:
                    </Text>
                    <Text style={styles.bookingInfo}>
                      {item.seatId}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.bookingDetails}>
                      Giờ khởi hành:
                    </Text>
                    <Text style={styles.bookingDate}>
                      {item.Timehouse}
                      {moment(item?.departureDate, ['ww, DD/MM/YYYY', ' DD/MM/YYYY'], 'vi')
                        .isValid()
                        ? moment(item?.departureDate, ['ww, DD/MM/YYYY', ' DD/MM/YYYY'], 'vi')
                          .format(' DD/MM/YYYY')
                        : 'Ngày không hợp lệ'}
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Bạn chưa đặt vé</Text>
            </View>
          )}

          {historyBookings && historyBookings.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
              data={historyBookings}
              keyExtractor={(item) => item.BookingID.toString()}
              renderItem={({ item }) => (
                <View style={styles.bookingCard}>
                  <View style={styles.headerCard}>
                    <View>
                      <Text style={styles.bookingTitle}>
                        Mã vé/ Code: {item.BookingID}
                      </Text>
                      <Text style={[styles.bookingDetails, { color: item.paymentStatus === 'Đã thanh toán' ? 'green' : "red" }]}>
                        {item.paymentStatus === 'Thanh toán không thành công' && 'Đã hủy'}
                        {item.paymentStatus === 'Đã thanh toán' && 'Đã thanh toán'}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.bookingTitle}>
                        Nhà xe {item.tripId.busId.busName}
                      </Text>

                      <Text style={styles.bookingFare}>
                        {item.totalFare} VND
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dashedLineHorizontal} />
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.bookingDetails}>
                      Tuyến:
                    </Text>
                    <Text style={styles.bookingInfo}>
                      {item.selectedDepartureName} - {item.selectedDestinationName}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.bookingDetails}>
                      Số ghế:
                    </Text>
                    <Text style={styles.bookingInfo}>
                      {item.seatId}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.bookingDetails}>
                      Giờ khởi hành:
                    </Text>
                    <Text style={styles.bookingDate}>
                      {item.Timehouse}
                      {moment(item?.departureDate, 'ww, DD/MM/YYYY')
                        .tz('Asia/Ho_Chi_Minh')
                        .format(" DD/MM/YYYY")}
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Bạn chưa đặt vé</Text>
            </View>
          )}
        </TabView>
      </View>
    </>
  )
}

export default Ticket
