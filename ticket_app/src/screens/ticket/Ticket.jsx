import { FlatList, Image, SafeAreaView, StyleSheet, Text, View, RefreshControl, TouchableOpacity } from 'react-native'
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
      const res = await getData("bookingRoutes/getBookingByUserId", { userId: user?._id })
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
  const paidTickets = bookingTicket?.filter(item => item.paymentStatus === 'Đã thanh toán');
  const cancelledTickets = bookingTicket?.filter(item => item.paymentStatus === 'Thanh toán không thành công');

  if (loading) {
    return <Loading />;
  }

  const handleInfoTicket = (item) => {
    nav.navigate("InfoTicket", item);
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
            title="Đã thanh toán"
            titleStyle={{ fontSize: 14, color: index === 0 ? "#f95300" : "#333" }}
            containerStyle={{ backgroundColor: "#fff" }}
          />
          <Tab.Item
            title="Đã hủy"
            titleStyle={{ fontSize: 14, color: index === 1 ? "#f95300" : "#333" }}
            containerStyle={{ backgroundColor: "#fff" }}
          />
        </Tab>
        <TabView value={index} onChange={setIndex} animationType="spring">
          {paidTickets && paidTickets.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
              data={paidTickets}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleInfoTicket(item)}
                  style={styles.bookingCard}>
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
                        Nhà xe {item?.tripId?.userId?.fullName}
                      </Text>

                      <Text style={styles.bookingFare}>
                        Số điện thoại: {item?.tripId?.userId?.phoneNumber}
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
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", borderTopWidth: 0.5, borderTopColor: "gray", marginTop: 5, width: "100%" }}>
                    <Text style={styles.bookingDetails}>
                      Tổng giá vé:
                    </Text>
                    <Text style={styles.bookingFare}>
                      {item?.totalFare}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có vé xe đã thanh toán</Text>
            </View>
          )}

          {cancelledTickets && cancelledTickets.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
              data={cancelledTickets}
              keyExtractor={(item) => item._id.toString()}
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
                        Nhà xe {item?.tripId?.userId?.fullName}
                      </Text>

                      <Text style={styles.bookingFare}>
                        Số điện thoại: {item?.tripId?.userId?.phoneNumber}
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.bookingDetails}>
                      Tổng giá vé
                    </Text>
                    <Text style={styles.bookingFare}>
                      {item?.totalFare}
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có vé xe đã hủy</Text>
            </View>
          )}
        </TabView>
      </View>
    </>
  )
}

export default Ticket
