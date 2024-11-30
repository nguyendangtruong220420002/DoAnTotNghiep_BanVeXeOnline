import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { generateSeats, generate41Seats } from '../../config/seat'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute, tab, useFocusEffect } from '@react-navigation/native'
import { useEffect } from 'react'
import { styles } from './styles'
import Loading from '../loading/Loading'
import moment from 'moment-timezone';
import { getData } from '../../utils/fetching'



const ChooseSeat = () => {

    const nav = useNavigation();
    const route = useRoute();

    const trip = route.params?.trip;
    const tripId = route.params?.trip?._id;
    const ngaydi = route.params?.ngaydi

    const date = new Date(ngaydi);

    const departureDate = new Intl.DateTimeFormat('vi-VN', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        weekday: "short"
    }).format(date);

    const diemdi = route.params?.diemdi
    const diemden = route.params?.diemden

    const totalFareAndPrice = trip?.totalFareAndPrice;
    const [selectedSeats, setSelectedSeats] = useState([]);

    const [seats, setSeats] = useState(
        Array.from({ length: 40 }, (_, index) => ({
            id: index + 1,
            status: 'Còn trống',
        }))
    );

    const fetchBookedSeats = async () => {
        setSelectedSeats([]);
        try {
            const formattedDepartureTime = moment(departureDate, 'ww,DD/MM/YYYY')
                .tz("Asia/Ho_Chi_Minh")
                .format("YYYY-MM-DD");
            console.log(formattedDepartureTime);

            const response = await getData(`tripsRoutes/getBooked-seats`,
                { tripId, bookingDate: formattedDepartureTime },
            );

            const bookedSeats = response.data.bookedSeats || [];
            console.log("Booked Seats Data:", bookedSeats);

            setSeats((prevSeats) =>
                prevSeats.map((seat) => ({
                    ...seat,
                    status: bookedSeats.some((bookedSeat) => bookedSeat.seatId === getSeatCode(seat.id))
                        ? "Đã mua"
                        : "Còn trống",
                }))
            );

        } catch (error) {
            console.error("Lỗi khi lấy ghế đã đặt:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBookedSeats();
        }, []) // If deps go wrong update.
    );

    const getSeatCode = (id) => {
        return id <= 20 ? `A${id}` : `B${id - 20}`;
    };

    const SeatCodeSelect = selectedSeats.map((id) => getSeatCode(id));
    const SeatCode = selectedSeats?.length === 0 ? "" : selectedSeats.map(id => getSeatCode(id)).join(", ");
    const totalAmountAll = (selectedSeats?.length * totalFareAndPrice);

    const handleSeatClick = (seatId) => {
        setSeats((prevSeats) =>
            prevSeats.map((seat) => {
                if (seat.id === seatId) {
                    if (seat.status === 'Đã mua') {
                        return seat; // Không làm gì nếu ghế đã mua
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
        return <Loading />;
    }
    const handleInfoPayment = () => {
        nav.navigate("InfoPayment", { trip, ngaydi, diemdi, diemden, SeatCodeSelect, totalAmountAll, SeatCode })
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

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchBookedSeats();
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                <View style={styles.body}>
                    <View>
                        <View style={styles.topBody}>
                            <Text style={{ padding: 10 }}>Ngày đi</Text>
                            {trip?.departureTime && (
                                <Text style={styles.textTime}>
                                    {moment(trip.departureTime, 'DD/MM/YYYY, HH:mm')
                                        .tz('Asia/Ho_Chi_Minh')
                                        .format('HH:mm')} {departureDate}
                                </Text>
                            )}
                        </View>

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
            <View style={styles.bottom}>
                <View style={{ marginLeft: 20, paddingVertical: 10 }}>
                    <Text style={{ fontWeight: 500 }} >Chiều đi</Text>
                    <Text style={{ fontWeight: '300' }}>{selectedSeats?.length || 0} vé</Text>
                    <Text style={{ fontWeight: '300' }}>{selectedSeats?.length === 0 ? "" : selectedSeats?.map(id => getSeatCode(id)).join(", ")}</Text>
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

