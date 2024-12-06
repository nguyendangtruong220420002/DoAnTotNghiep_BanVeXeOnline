import { Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { generateSeats, generate41Seats } from '../../config/seat'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, tab, useFocusEffect } from '@react-navigation/native'
import { useEffect } from 'react'
import { styles } from './styles'
import Loading from '../loading/Loading'
import moment from 'moment-timezone';
import { getData } from '../../utils/fetching'
import { useSocket } from '../../context/useSocket'
import { TabView, SceneMap } from 'react-native-tab-view';

const ChooseSeat = () => {

    const nav = useNavigation();
    const route = useRoute();

    const socket = useSocket();

    const tripId = route.params?.trip?._id || route.params?.tripdi?._id;

    const trip = route.params?.trip || route.params?.tripdi;

    const [tripve, setTripve] = useState(route.params?.tripve || null)
    const [tripIdve, setTripIdve] = useState(route.params?.tripve?._id || null)
    const [index, setIndex] = useState(0);

    const ngaydi = route.params?.ngaydi
    const ngayve = route.params?.ngayve || null;




    const show = route.params?.show;
    // console.log("trip di", trip);
    console.log("trip id di", tripId);

    // console.log("trip ve", tripve);
    console.log("trip id ve", tripIdve);

    const layout = useWindowDimensions();

    const date = new Date(ngaydi);
    const dateVe = new Date(ngayve);


    const destinationDate = new Intl.DateTimeFormat('vi-VN', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        weekday: "short"
    }).format(dateVe);


    const departureDate = new Intl.DateTimeFormat('vi-VN', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        weekday: "short"
    }).format(date);

    const [routes] = useState([
        {
            key: 'departure', title: (
                <>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 16, color: "#f95300" }}>Chiều đi</Text>
                        <Text style={{ fontSize: 14, color: "#f95300" }}>{departureDate}</Text>
                    </View>
                </>
            ),
        },
        ...(tripve ? [{
            key: 'return', title: (
                <>
                    <View style={{ flexDirection: "column", alignItems: "center" }}>
                        <Text style={{ fontSize: 16, color: "#f95300" }}>Chiều về</Text>
                        <Text style={{ fontSize: 14, color: "#f95300" }}>{destinationDate}</Text>
                    </View>
                </>
            ),
        }] : [])
    ]);
    const diemdi = route.params?.diemdi
    const diemden = route.params?.diemden

    const totalFareAndPrice = trip?.totalFareAndPrice;
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedSeatsReturn, setSelectedSeatsReturn] = useState([]);

    const [seats, setSeats] = useState(
        Array.from({ length: 40 }, (_, index) => ({
            id: index + 1,
            status: 'Còn trống',
        }))
    );


    useEffect(() => {

        setSelectedSeats([]);

        socket?.on('update-data-seat', async (data) => {
            // Dữ liệu ghế mới
            const bookedSeats = data?.res?.bookedSeats || [];

            console.log("Booked Seats Data:", bookedSeats);
            console.log(data);

            if (data?.tripId === tripId) {
                setSeats((prevSeats) =>
                    prevSeats.map((seat) => ({
                        ...seat,
                        status: bookedSeats.some((bookedSeat) => bookedSeat.seatId === getSeatCode(seat.id))
                            ? "Đã mua"
                            : "Còn trống",
                    }))
                );
            } else if (!show) {
                await fetchBookedSeats(tripId, departureDate);
            }
        });

        socket?.on('delete-get-seat', async (data) => {
            // Dữ liệu ghế mới
            const bookedSeats = data?.bookedSeats || [];

            console.log("Booked Seats Data:", bookedSeats);

            if (data?.tripId === tripId) {
                setSeats((prevSeats) =>
                    prevSeats.map((seat) => ({
                        ...seat,
                        status: bookedSeats.some((bookedSeat) => bookedSeat.seatId === getSeatCode(seat.id))
                            ? "Đã mua"
                            : "Còn trống",
                    }))
                );
            } else {
                await fetchBookedSeats();
            }
        });

        // Cleanup listener khi component unmount
        return () => {
            socket?.off('update-data-seat');
            socket?.off('delete-get-seat');
        };
    }, [tripId]);


    const fetchBookedSeats = async (tripId, date) => {

        setLoading(true)
        try {
            const formattedDepartureTime = moment(date, ['ww, DD/MM/YYYY', ' DD/MM/YYYY'], 'vi')
                .isValid()
                ? moment(date, ['ww, DD/MM/YYYY', ' DD/MM/YYYY'], 'vi').format('YYYY-MM-DD')
                : 'Ngày không hợp lệ';

            const response = await getData(`tripsRoutes/getBooked-seats`, {
                tripId,
                bookingDate: formattedDepartureTime,
            });
            console.log(response.data);


            const bookedSeats = response.data.bookedSeats || [];
            setSeats((prevSeats) =>
                prevSeats.map((seat) => ({
                    ...seat,
                    status: bookedSeats.some((bookedSeat) => bookedSeat.seatId === getSeatCode(seat.id))
                        ? 'Đã mua'
                        : 'Còn trống',
                }))
            );
            setLoading(false)
        } catch (error) {
            console.error('Lỗi khi lấy ghế đã đặt:', error);
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchBookedSeats(tripId, departureDate);
    }, [tripId, ngaydi]);

    useEffect(() => {
        if (index === 1 && tripIdve) { // Chỉ thực hiện fetching khi tab "ngày về" được chọn
            setSelectedSeatsReturn([])
            fetchBookedSeats(tripIdve, destinationDate);

        } else if (index === 0) {
            setSelectedSeats([])
            fetchBookedSeats(tripId, departureDate);
        }
    }, [index]);

    const renderScene = SceneMap({
        departure: () => renderSeatsForTrip(),
        return: () => renderSeatsForTrip(),
    });

    const renderSeatsForTrip = () => (

        <ScrollView

        >
            <View style={styles.body}>
                <View >
                    <View style={styles.seatContainer}>
                        {/* Tầng dưới */}
                        <View style={styles.levelContainer}>
                            <Text style={styles.levelLabel}>Tầng dưới</Text>
                            {renderSeats(seats.slice(0, 15), 0, 3)}
                            {renderSeats(seats.slice(15, 20), 15, 5)}
                        </View>

                        {/* Tầng trên */}
                        <View style={styles.levelContainer}>
                            <Text style={styles.levelLabel}>Tầng trên</Text>
                            {renderSeats(seats.slice(20, 35), 20, 3)}
                            {renderSeats(seats.slice(35, 40), 35, 5)}
                        </View>
                    </View>
                </View>


                <View>
                    <View style={styles.radioIcon}>
                        <View style={styles.chosing}>
                            <Icon name='ellipse' type='ionicon' color={"#757575"} />
                            <Text>Đã bán</Text>
                        </View>
                        <View style={styles.chosing}>
                            <Icon name='ellipse' type='ionicon' color={"#BDD8F1"} />
                            <Text>Còn trống</Text>
                        </View>
                        <View style={styles.chosing}>
                            <Icon name='ellipse' type='ionicon' color={"#ffc9b9"} />
                            <Text>Đang chọn</Text>
                        </View>

                    </View>



                </View>
            </View>
        </ScrollView>

    );

    const getSeatCode = (id) => {
        return id <= 20 ? `A${id}` : `B${id - 20}`;
    };

    const totalAmountAll = (selectedSeats?.length * totalFareAndPrice);

    const handleSeatClick = (seatId) => {
        // Check if the current tab is "departure" or "return"
        if (index === 0) { // Departure trip
            setSeats((prevSeats) =>
                prevSeats.map((seat) => {
                    if (seat.id === seatId) {
                        if (seat.status === 'Đã mua') {
                            return seat; // Don't do anything if the seat is already booked
                        }
                        const newStatus = seat.status === 'Còn trống' ? 'Đã chọn' : 'Còn trống';
                        return { ...seat, status: newStatus };
                    }
                    return seat;
                })
            );

            setSelectedSeats((prevSelected) =>
                prevSelected.includes(seatId)
                    ? prevSelected.filter((id) => id !== seatId)
                    : [...prevSelected, seatId]
            );
        } else if (index === 1) { // Return trip
            setSeats((prevSeats) =>
                prevSeats.map((seat) => {
                    if (seat.id === seatId) {
                        if (seat.status === 'Đã mua') {
                            return seat; // Don't do anything if the seat is already booked
                        }
                        const newStatus = seat.status === 'Còn trống' ? 'Đã chọn' : 'Còn trống';
                        return { ...seat, status: newStatus };
                    }
                    return seat;
                })
            );

            setSelectedSeatsReturn((prevSelected) =>
                prevSelected.includes(seatId)
                    ? prevSelected.filter((id) => id !== seatId)
                    : [...prevSelected, seatId]
            );
        }
    };

    const [loading, setLoading] = useState(true); // Loading state
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false); // Set loading to false after data is processed/fetched
        }, 200);
        // Set the header with dynamic data
        nav.setOptions({
            headerTitle: () => (
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
    }, [nav, diemdi, diemden]);

    if (loading) {
        return <Loading />
    }


    const handleInfoPayment = () => {
        const SeatCodeSelectDeparture = selectedSeats.map((id) => getSeatCode(id));
        const SeatCodeSelectReturn = selectedSeatsReturn.map((id) => getSeatCode(id));

        if (show && (selectedSeatsReturn === null || selectedSeatsReturn.length === 0)) {

            Alert.alert("Thông báo", "Bạn phải chọn ghế lượt về.");
            return;
        }

        const totalAmountAllDeparture = selectedSeats.length * totalFareAndPrice;
        const totalAmountAllReturn = selectedSeatsReturn.length * totalFareAndPrice;
        const totalAmountAll = totalAmountAllDeparture + totalAmountAllReturn;
        const SeatCode = selectedSeats?.length === 0 ? "" : selectedSeats.map(id => getSeatCode(id)).join(", ");

        const SeatCodeReturn = selectedSeatsReturn?.length === 0 ? "" : selectedSeatsReturn.map(id => getSeatCode(id)).join(", ");
        // Combine selected seats for both trips
        const allSeatsSelected = {
            departure: SeatCodeSelectDeparture,
            return: SeatCodeSelectReturn,
        };

        console.log(SeatCodeSelectDeparture);
        console.log(SeatCodeSelectReturn);

        console.log(totalAmountAllDeparture);
        console.log(totalAmountAllReturn);

        console.log(totalAmountAll);

        nav.navigate("InfoPayment", {
            show,
            trip,
            tripIdve,
            tripve: tripve || null,
            ngaydi,
            ngayve,
            diemdi,
            diemden,
            allSeatsSelected, // Pass selected seats for both trips
            totalAmountAllDeparture,
            totalAmountAllReturn,
            totalAmountAll,
            SeatCode,
            SeatCodeReturn
        });
        // nav.navigate("InfoPayment", { trip, ngaydi, diemdi, diemden, SeatCodeSelect, totalAmountAll, SeatCode })
    }

    const renderSeats = (seats, startIndex, columnsPerRow) => {
        const rows = [];
        for (let i = 0; i < seats.length; i += columnsPerRow) {
            rows.push(seats.slice(i, i + columnsPerRow));
        }

        return rows.map((row, rowIndex) => (
            <View key={`row-${startIndex + rowIndex}`} style={styles.row}>
                {row.map((seat) => (
                    <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => seat.status !== 'Đã mua' && handleSeatClick(seat.id)}
                    >
                        <View style={styles.seatWrapper}>
                            <Icon
                                name="chair"
                                type="material"
                                color={
                                    seat.status === 'Đã mua'
                                        ? '#ccc'
                                        : seat.status === 'Đã chọn'
                                            ? '#ffc9b9'
                                            : '#b1dffb'
                                }
                                size={34}
                            />
                            <Text style={[styles.seatNumber, {
                                color:
                                    seat.status === "Đã mua"
                                        ? "#888585"
                                        : seat.status === "Đã chọn"
                                            ? "#f06843"
                                            : "#2b7ecc"
                            }]}>{getSeatCode(seat.id)}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                ))
                }
            </View >
        ));
    };


    return (
        <View style={styles.container}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                tabBarStyle={{
                    backgroundColor: 'white',  // Màu nền của tab bar
                }}
                indicatorStyle={{
                    backgroundColor: '#f95300',  // Màu của thanh chỉ báo dưới tab
                }}
                renderTabBar={(props) => (
                    <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                        {props.navigationState.routes.map((route, i) => {
                            const isActive = i === props.navigationState.index;
                            return (
                                <TouchableOpacity
                                    key={route.key}
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: isActive ? 'white' : 'transparent',
                                        paddingVertical: 10,
                                        borderBottomWidth: isActive ? 2 : 0,
                                        borderBottomColor: '#f95300',
                                    }}
                                    onPress={() => props.jumpTo(route.key)}
                                >
                                    <Text
                                        style={{
                                            color: isActive ? '#f95300' : 'gray',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {route.title}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            />
            <View style={styles.bottom}>
                <View style={{ flexDirection: "row", }}>
                    <View style={{ marginLeft: 20, paddingVertical: 10 }}>
                        <Text style={{ fontWeight: 500 }} >Chiều đi</Text>
                        <Text style={{ fontWeight: '300' }}>{selectedSeats?.length || 0} vé</Text>
                        <Text style={{ fontWeight: '300' }}>{selectedSeats?.length === 0 ? "" : selectedSeats?.map(id => getSeatCode(id)).join(", ")}</Text>
                    </View>

                    {show && (
                        <View style={{ marginLeft: 100, paddingVertical: 10 }}>
                            <Text style={{ fontWeight: 500 }}>Chiều về</Text>
                            <Text style={{ fontWeight: '300' }}>{selectedSeatsReturn?.length || 0} vé</Text>
                            <Text style={{ fontWeight: '300' }}>
                                {selectedSeatsReturn?.length === 0 ? "" : selectedSeatsReturn?.map(id => getSeatCode(id)).join(", ")}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={{ marginLeft: 20, paddingVertical: 15 }}>
                    <Text style={{ fontSize: 20, fontWeight: 450 }}>Số tiền: {totalAmountAll?.toLocaleString("vi-VN") || 0}đ</Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleInfoPayment()}
                    style={styles.btnContinue}>
                    <Text style={styles.textbtn}>Tiếp tục</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default ChooseSeat

