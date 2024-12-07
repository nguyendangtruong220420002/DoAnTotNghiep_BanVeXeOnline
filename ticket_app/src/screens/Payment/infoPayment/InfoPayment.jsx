import { View, Text, Image, TouchableWithoutFeedback, Modal, TouchableOpacity, ScrollView, TextInput, Button, Alert, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import moment from 'moment-timezone';
import useAuthData from '../../../context/useAuth';
import { showErrorToast } from '../../../utils/toast';
import { postData } from '../../../utils/fetching';
import { useSocket } from '../../../context/useSocket';
import { TabView, SceneMap } from 'react-native-tab-view';

const InfoPayment = () => {

    const nav = useNavigation();
    const route = useRoute();

    const { user } = useAuthData();

    const socket = useSocket();
    const [fullName, setFullName] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [email, setEmail] = useState(null);

    const trip = route.params?.trip;
    const show = route.params?.show;
    const tripType = show && "Khứ hồi";

    const tripve = route.params?.tripve;

    const tripId = route.params?.trip?._id;
    const tripIdve = route.params?.tripve?._id;

    const ngaydi = route?.params?.ngaydi;
    const ngayve = route?.params?.ngayve;

    const date = new Date(ngaydi);
    const dateve = new Date(ngayve);


    const departureDate = new Intl.DateTimeFormat('vi-VN', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        weekday: "short"
    }).format(date);

    const returnDate = new Intl.DateTimeFormat('vi-VN', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        weekday: "short"
    }).format(dateve);

    const diemdi = route.params?.diemdi;
    const diemden = route.params?.diemden;
    const seatCode = route.params?.SeatCode;

    const SeatCodeSelect = route.params?.allSeatsSelected.departure;
    const totalAmountAll = route.params?.totalAmountAll;
    const totalAmountAllDeparture = route.params?.totalAmountAllDeparture;

    const SeatCodeReturn = route.params?.SeatCodeReturn;
    const totalAmountAllReturn = route.params?.totalAmountAllReturn;
    const SeatCodeSelectReturn = route.params?.allSeatsSelected.return;



    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    // Conditional routes for TabView
    const routes = [
        { key: 'first', title: `Chuyến đi - ${moment(ngaydi).format('DD/MM/YYYY')}` },
        ...(show ? [{ key: 'second', title: `Chiều về - ${moment(ngayve).format('DD/MM/YYYY')}` }] : [])
    ];


    const Timehouse = moment(trip?.departureTime, 'DD/MM/YYYY, HH:mm')
        .tz('Asia/Ho_Chi_Minh')
        .format('HH:mm')


    const formattedDepartureTime = moment(departureDate, ['ww, DD/MM/YYYY', ' DD/MM/YYYY'], 'vi')
        .isValid()
        ? moment(departureDate, ['ww, DD/MM/YYYY', ' DD/MM/YYYY'], 'vi')
            .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        : 'Ngày không hợp lệ'
    const FirstRoute = () => (

        <ScrollView
            showsVerticalScrollIndicator={false}

            style={styles.body}>
            <View style={styles.viewTrip}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: '450', padding: 8 }}>
                        Thông tin chuyến đi
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {trip?.departureTime && (
                            <Text style={styles.timeText}>
                                {moment(trip.departureTime, 'DD/MM/YYYY, HH:mm')
                                    .tz('Asia/Ho_Chi_Minh')
                                    .format('HH:mm')}
                            </Text>
                        )}
                        <Icon type='material' name='radio-button-checked' color={"green"} />

                        <Text style={styles.locationText}>
                            {trip?.routeId.from}
                        </Text>
                    </View>
                    <View style={styles.dashedLine} />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {trip?.endTime && (
                            <Text style={styles.timeText}>
                                {moment(trip.endTime, 'DD/MM/YYYY, HH:mm')
                                    .tz('Asia/Ho_Chi_Minh')
                                    .format('HH:mm')}
                            </Text>
                        )}
                        <Icon type='material' name='radio-button-checked' color={"darkorange"} />

                        <Text style={{ color: "darkorange", marginLeft: 9 }}>
                            {trip?.routeId.to}
                        </Text>
                    </View>
                    <TouchableWithoutFeedback
                        onPress={() => handleTripRoute(trip)}
                    >
                        <View style={styles.tripsRoute}>
                            <Icon type='ionicon' name='alert-circle-outline' size={24} />
                            <Text style={{ fontFamily: "inter", fontSize: 16, color: "darkblue" }}>Lịch trình</Text>
                        </View>
                    </TouchableWithoutFeedback>

                </View>

            </View>
            <View style={styles.viewSeat}>
                <View style={styles.headerInfoCus}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: '450' }}>
                            Ghế của bạn
                        </Text>
                    </View>
                    <View>
                        <TouchableWithoutFeedback
                            onPress={() => nav.goBack()}
                        >
                            <Icon type='material' name='border-color' color={"#f95300"} />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={{ paddingLeft: 5 }}>
                    <Text>{SeatCodeSelect}</Text>
                </View>
            </View>
            <View style={styles.ViewPickUp_Drop_Info}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: '450', padding: 8 }}>
                        Thông tin đón trả
                    </Text>
                </View>

                <View style={styles.ContentPickUp_Drop_Info}>
                    <View>
                        <Text style={styles.textDiemDon_Tra}>Điểm đón</Text>

                        <View>
                            <TouchableOpacity
                                style={styles.ContentPickUp_Drop_Info}
                                onPress={() => openModal("pickup")}
                            >

                                <View style={styles.modalTitleContainer}>
                                    <Text style={styles.textSelected}>
                                        {pickupPoint ? `${pickupPoint}` : "Chọn điểm đón"}
                                    </Text>
                                    <Icon type="ionicon" name="caret-down" size={16} color="#333" />
                                </View>
                            </TouchableOpacity>

                            <Text style={{ color: "#F95300", fontSize: 16, padding: 5 }}>
                                {pickupPoint ? (
                                    <Text style={{ color: "#F95300", fontSize: 16, padding: 5 }}>
                                        Quý khách vui lòng có mặt tại "{pickupPoint}" trước 15ph để được trung chuyển hoặc kiểm tra thông tin trước khi lên xe!
                                    </Text>
                                ) : (
                                    <Text style={{ color: "red", fontSize: 14, paddingTop: 5 }}>
                                        Vui lòng chọn Điểm đón.
                                    </Text>
                                )}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.textDiemDon_Tra}>Điểm trả</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.ContentPickUp_Drop_Info}
                        onPress={() => openModal("dropoff")}
                    >

                        <View style={styles.modalTitleContainer}>
                            <Text style={styles.textSelected}>
                                {dropOffPoint ? `${dropOffPoint}` : "Chọn điểm trả"}
                            </Text>
                            <Icon type="ionicon" name="caret-down" size={16} color="#333" />
                        </View>
                    </TouchableOpacity>
                    {!dropOffPoint && (
                        <Text style={{ color: "red", fontSize: 14, paddingTop: 5 }}>
                            Vui lòng chọn Điểm trả.
                        </Text>
                    )}
                </View>

            </View>
            <View style={{ paddingHorizontal: 15, paddingTop: 8, flexDirection: "row" }}>
                <Text>Băng việc tiếp tục, bạn đã đồng ý với </Text>
                <Text style={{ color: "#F95300" }}>điều khoản sử dụng </Text>
                <Text>của</Text>
                <Text style={{ paddingHorizontal: 15 }}>nhà Xe</Text>
            </View>

        </ScrollView>
    );

    const SecondRoute = () => (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 18, padding: 10 }}>Ngày về</Text>
            <View style={styles.viewTrip}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: '450', padding: 8 }}>
                        Thông tin chuyến về
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {tripve?.departureTime && (
                            <Text style={styles.timeText}>
                                {moment(tripve.departureTime, 'DD/MM/YYYY, HH:mm')
                                    .tz('Asia/Ho_Chi_Minh')
                                    .format('HH:mm')}
                            </Text>
                        )}
                        <Icon type='material' name='radio-button-checked' color={"green"} />

                        <Text style={styles.locationText}>
                            {tripve?.routeId.from}
                        </Text>
                    </View>
                    <View style={styles.dashedLine} />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {tripve?.endTime && (
                            <Text style={styles.timeText}>
                                {moment(tripve.endTime, 'DD/MM/YYYY, HH:mm')
                                    .tz('Asia/Ho_Chi_Minh')
                                    .format('HH:mm')}
                            </Text>
                        )}
                        <Icon type='material' name='radio-button-checked' color={"darkorange"} />

                        <Text style={{ color: "darkorange", marginLeft: 9 }}>
                            {tripve?.routeId.to}
                        </Text>
                    </View>
                    <TouchableWithoutFeedback
                        onPress={() => handleTripRoute(tripve)}
                    >
                        <View style={styles.tripsRoute}>
                            <Icon type='ionicon' name='alert-circle-outline' size={24} />
                            <Text style={{ fontFamily: "inter", fontSize: 16, color: "darkblue" }}>Lịch trình</Text>
                        </View>
                    </TouchableWithoutFeedback>

                </View>

            </View>
            <View style={styles.viewSeat}>
                <View style={styles.headerInfoCus}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: '450' }}>
                            Ghế của bạn
                        </Text>
                    </View>
                    <View>
                        <TouchableWithoutFeedback
                            onPress={() => nav.goBack()}
                        >
                            <Icon type='material' name='border-color' color={"#f95300"} />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={{ paddingLeft: 5 }}>
                    <Text>{SeatCodeSelectReturn}</Text>
                </View>
            </View>
            <View style={styles.ViewPickUp_Drop_Info}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: '450', padding: 8 }}>
                        Thông tin đón trả
                    </Text>
                </View>

                <View style={styles.ContentPickUp_Drop_Info}>
                    <View>
                        <Text style={styles.textDiemDon_Tra}>Điểm đón</Text>

                        <View>
                            <TouchableOpacity
                                style={styles.ContentPickUp_Drop_Info}
                                onPress={() => openModal("pickup")}
                            >

                                <View style={styles.modalTitleContainer}>
                                    <Text style={styles.textSelected}>
                                        {returnPickupPoint ? `${returnPickupPoint}` : "Chọn điểm đón"}
                                    </Text>
                                    <Icon type="ionicon" name="caret-down" size={16} color="#333" />
                                </View>
                            </TouchableOpacity>

                            <Text style={{ color: "#F95300", fontSize: 16, padding: 5 }}>
                                {returnPickupPoint ? (
                                    <Text style={{ color: "#F95300", fontSize: 16, padding: 5 }}>
                                        Quý khách vui lòng có mặt tại "{returnPickupPoint}" trước 15ph để được trung chuyển hoặc kiểm tra thông tin trước khi lên xe!
                                    </Text>
                                ) : (
                                    <Text style={{ color: "red", fontSize: 14, paddingTop: 5 }}>
                                        Vui lòng chọn Điểm đón.
                                    </Text>
                                )}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.textDiemDon_Tra}>Điểm trả</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.ContentPickUp_Drop_Info}
                        onPress={() => openModal("dropoff")}
                    >

                        <View style={styles.modalTitleContainer}>
                            <Text style={styles.textSelected}>
                                {returnDropOffPoint ? `${returnDropOffPoint}` : "Chọn điểm trả"}
                            </Text>
                            <Icon type="ionicon" name="caret-down" size={16} color="#333" />
                        </View>
                    </TouchableOpacity>
                    {!returnDropOffPoint && (
                        <Text style={{ color: "red", fontSize: 14, paddingTop: 5 }}>
                            Vui lòng chọn Điểm trả.
                        </Text>
                    )}
                </View>

            </View>
            <View style={{ paddingHorizontal: 15, paddingTop: 8, flexDirection: "row" }}>
                <Text>Băng việc tiếp tục, bạn đã đồng ý với </Text>
                <Text style={{ color: "#F95300" }}>điều khoản sử dụng </Text>
                <Text>của</Text>
            </View>
            <Text style={{ paddingHorizontal: 15 }}>nhà Xe</Text>
        </ScrollView>
    );
    const [modalVisible, setModalVisible] = useState(false);
    const [modalEditVisible, setModalEditVisible] = useState(false);


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
                        source={require('../../../../img/imageheader.png')}
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

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute, // Ensure these components are defined and exported correctlyF
    });
    const [currentSelection, setCurrentSelection] = useState(null);
    const [pickupPoint, setPickupPoint] = useState(null);
    const [dropOffPoint, setDropOffPoint] = useState(null);
    const [returnPickupPoint, setReturnPickupPoint] = useState(null);
    const [returnDropOffPoint, setReturnDropOffPoint] = useState(null);

    const handleTripRoute = (trip) => {
        nav.navigate("TripRoute", { trip });
    };
    const closeModal = () => setModalVisible(false);

    const openModal = (selection) => {
        setCurrentSelection(selection);
        setModalVisible(true);
    };

    const handleSelect = (point) => {
        console.log(point);

        if (currentSelection === "pickup") {
            if (index === 1) {
                setReturnPickupPoint(point); // Điểm đón cho Ngày về
            } else {
                setPickupPoint(point); // Điểm đón cho Chuyến đi
            }
        } else if (currentSelection === "dropoff") {
            if (index === 1) {
                setReturnDropOffPoint(point); // Điểm trả cho Ngày về
            } else {
                setDropOffPoint(point); // Điểm trả cho Chuyến đi
            }
        }
        setModalVisible(false);
    };


    const handlePayment = async () => {

        const CustomerInfo = {
            fullName: fullName || user?.fullName,
            phoneNumber: phoneNumber || user?.phoneNumber,
            email: email || user?.email,
        }

        if (!pickupPoint || !dropOffPoint) {

            showErrorToast("Vui lòng nhập Điểm đón và Điểm trả", "Vui lòng chọn đầy đủ Điểm đón và Điểm trả trước khi tiếp tục")

            return; // Dừng việc tiếp tục điều hướng
        }

        const TimehouseReturn = moment(tripve?.departureTime, 'DD/MM/YYYY, HH:mm')
            .tz('Asia/Ho_Chi_Minh')
            .format('HH:mm')
        const formattedReturnTime = moment(returnDate, ['ww, DD/MM/YYYY', ' DD/MM/YYYY'], 'vi')
            .isValid()
            ? moment(returnDate, ['ww, DD/MM/YYYY', ' DD/MM/YYYY'], 'vi')
                .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
            : 'Ngày không hợp lệ'
        const bookingDataForPayment = {
            tripId,
            userId: user?._id,
            seatId: seatCode,
            totalFare: totalAmountAllDeparture,
            selectedDepartureName: pickupPoint,
            selectedDestinationName: dropOffPoint,
            Timehouse: Timehouse,
            departureDate: departureDate,
            passengerInfo: {
                fullName: fullName || user?.fullName,
                phoneNumber: phoneNumber || user?.phoneNumber,
                email: email || user?.email,
            },
        };
        const bookingDataReturn = tripType === 'Khứ hồi' ? {
            tripId: tripIdve,
            seatId: SeatCodeReturn,
            userId: user?._id,
            totalFare: totalAmountAllReturn,
            selectedDepartureName: returnPickupPoint,
            selectedDestinationName: returnDropOffPoint,
            Timehouse: TimehouseReturn,
            departureDate: returnDate,
            passengerInfo: {
                fullName: fullName || user?.fullName,
                phoneNumber: phoneNumber || user?.phoneNumber,
                email: email || user?.email,
            },
        } : null;

        console.log(bookingDataForPayment);
        console.log(bookingDataReturn);

        try {
            const createBookingResponse = await postData(`/bookingRoutes/add`, bookingDataForPayment);
            let bookingId2;

            if (tripType === 'Khứ hồi' && bookingDataReturn) {
                const createBookingReturnResponse = await postData(`/bookingRoutes/addRoutTrip`, bookingDataReturn);

                bookingId2 = createBookingReturnResponse.data.bookingReturn._id;
                console.log("bookingId2", bookingId2);
            }

            const bookingData = {
                tripId,
                bookingDate: formattedDepartureTime,
                seats: SeatCodeSelect,
                userId: user?._id,
                selectedDepartureName: pickupPoint,
                selectedDestinationName: dropOffPoint,
                Timehouse: Timehouse,
                departureDate: departureDate,
            };

            // console.log("bookingData", bookingData);     
            await postData(`/tripsRoutes/book-seats`, bookingData);
            socket?.emit('update-get-seat', { tripId, bookingDate: formattedDepartureTime })


            if (tripType === 'Khứ hồi') {

                console.log("formattedReturnTime", formattedReturnTime)


                const bookingDataReturn = {
                    tripId: tripIdve,
                    bookingDate: formattedReturnTime,
                    seats: SeatCodeSelectReturn,
                    userId: user._id,
                    selectedDepartureName: returnPickupPoint,
                    selectedDestinationName: returnDropOffPoint,
                    Timehouse: TimehouseReturn,
                    departureDate: returnDate,
                };

                await postData(`/tripsRoutes/book-SeatsRoutTrip`, bookingDataReturn);
                socket?.emit('update-get-seat', { tripId: tripIdve, bookingDate: formattedReturnTime })
            }
            const bookingId = createBookingResponse.data.booking._id;
            const bookingID = createBookingResponse.data.booking.BookingID;

            console.log(bookingId)
            console.log(bookingID)

            setTimeout(() => {
                nav.navigate("Payment", {
                    bookingId,
                    bookingID,
                    trip,
                    pickupPoint,
                    dropOffPoint,
                    CustomerInfo,
                    SeatCode: seatCode,
                    SeatCodeSelect,
                    totalAmountAll: totalAmountAll,
                    ngaydi,
                    ngayve,
                    tripve,
                    tripId,
                    bookingId2,
                    tripIdve,
                    SeatCodeReturn,
                    SeatCodeSelectReturn,
                    returnPickupPoint,
                    returnDropOffPoint
                })
            }, 2000);

        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            Alert.alert(
                'Lỗi đặt chỗ',
                'Số ghế bạn chọn đã có người đặt chỗ! Vui lòng chọn ghế khác',
                [
                    { text: 'Hủy', style: 'cancel', onPress: () => { } },
                    {
                        text: 'Đồng ý',
                        style: 'destructive',
                        onPress: () => nav.goBack(),
                    },
                ]
            );
        }

    }

    const handleEditInfo = () => {

        setModalEditVisible(true)
    }
    const handleSave = (fullName, phoneNumber, email) => {


        setFullName(fullName ? fullName : user?.fullName);
        setPhoneNumber(phoneNumber ? phoneNumber : user?.phoneNumber);
        setEmail(email ? email : user?.email);

        setModalEditVisible(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <View style={styles.viewInfoCustomer}>
                    <View style={styles.headerInfoCus}>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: '450', padding: 8 }}>
                                Thông tin hành khách
                            </Text>
                        </View>
                        <View>
                            <TouchableWithoutFeedback
                                onPress={() => handleEditInfo()}
                            >
                                <Icon type='material' name='border-color' color={"#f95300"} />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>

                    <View style={styles.ListItem}>
                        <ListItem containerStyle={{ padding: 5 }}>

                            <ListItem.Content>
                                <ListItem.Title><Text style={styles.textListItem}>Họ và tên</Text></ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Title><Text>{fullName ? fullName : user?.fullName}</Text></ListItem.Title>
                        </ListItem>
                        <ListItem containerStyle={{ padding: 5 }}>

                            <ListItem.Content >
                                <ListItem.Title><Text style={styles.textListItem}>Số điện thoại</Text></ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Title><Text>{phoneNumber ? phoneNumber : user?.phoneNumber}</Text></ListItem.Title>
                        </ListItem>
                        <ListItem containerStyle={{ padding: 5 }}>
                            <ListItem.Content >
                                <ListItem.Title><Text style={styles.textListItem}>Email</Text></ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Title><Text>{email ? email : user?.email}</Text></ListItem.Title>
                        </ListItem>
                    </View>

                </View>

            </View>

            <TabView
                navigationState={{ index, routes }}  // Đảm bảo có index và routes
                onIndexChange={setIndex}  // Cập nhật index khi chuyển tab
                renderScene={renderScene}  // Render các scene tương ứng với từng tab
                initialLayout={{ width: layout.width }}  // Đảm bảo layout ban đầu đúng
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
                                            color: isActive ? '#f95300' : 'gray', // Màu của title khi active và không active
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
            <Modal
                onDismiss={() => setModalVisible(false)}
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {currentSelection === "pickup"
                                ? "Đón tại Trạm/văn phòng"
                                : "Trả tại Trạm/văn phòng"}
                        </Text>

                        {(index === 1 ? tripve : trip)?.schedule.map((stop, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.radioButton}
                                onPress={() => handleSelect(stop.name)}
                            >
                                <View style={styles.radioIcon}>
                                    {/* Đánh dấu tùy chọn đã chọn nếu trùng */}
                                </View>

                                <View>
                                    <Text>
                                        {moment(stop?.time, "HH:mm")
                                            .tz("Asia/Ho_Chi_Minh")
                                            .format("HH:mm")}
                                    </Text>
                                    <Text style={styles.radioTextName}>{stop?.name}</Text>
                                    <Text style={styles.radioTextAddress}>{stop?.address}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        {currentSelection === "pickup" && (
                            <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => handleSelect(currentSelection === "pickup" && index === 0 ? trip?.routeId?.from : tripve?.routeId?.from)}
                            >
                                <View style={styles.radioIcon}>
                                    {/* Đánh dấu tùy chọn đã chọn nếu trùng */}
                                </View>

                                <View>
                                    <Text>  {moment(trip.departureTime, 'DD/MM/YYYY, HH:mm')
                                        .tz('Asia/Ho_Chi_Minh')
                                        .format('HH:mm')}
                                    </Text>
                                    <Text style={styles.radioTextName}>
                                        {currentSelection === "pickup" && index === 0 ? trip?.routeId?.from : tripve?.routeId?.from}
                                    </Text>
                                    <Text style={styles.radioTextAddress}>
                                        {currentSelection === "pickup" && index === 0 ? trip?.routeId?.from : tripve?.routeId?.from}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {currentSelection === "dropoff" && (
                            <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => handleSelect(currentSelection === "dropoff" && index === 0 ? trip?.routeId?.to : tripve?.routeId?.to)}
                            >
                                <View style={styles.radioIcon}>
                                    {/* Đánh dấu tùy chọn đã chọn nếu trùng */}
                                </View>

                                <View>
                                    <Text>  {moment(trip.endTime, 'DD/MM/YYYY, HH:mm')
                                        .tz('Asia/Ho_Chi_Minh')
                                        .format('HH:mm')}
                                    </Text>
                                    <Text style={styles.radioTextName}>
                                        {currentSelection === "dropoff" && index === 0 ? trip?.routeId?.to : tripve?.routeId?.to}
                                    </Text>
                                    <Text style={styles.radioTextAddress}>
                                        {currentSelection === "dropoff" && index === 0 ? trip?.routeId?.to : tripve?.routeId?.to}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.btnClose} onPress={closeModal}>
                            <Text style={styles.btnCloseText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <Modal
                onDismiss={() => setModalEditVisible(false)}
                animationType="slide"
                transparent={true}
                visible={modalEditVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Thông tin khách hàng</Text>



                        <Text style={styles.label}>Họ và tên</Text>
                        <TextInput
                            style={styles.input}
                            value={fullName ? fullName : user?.fullName}
                            onChangeText={(text) => setFullName(text)}
                            placeholder="Nhập họ và tên"
                        />

                        <Text style={styles.label}>Số điện thoại</Text>
                        <TextInput
                            style={styles.input}
                            value={phoneNumber ? phoneNumber : user?.phoneNumber}
                            onChangeText={(text) => setPhoneNumber(text)}
                            placeholder="Nhập số điện thoại"
                            keyboardType="phone-pad"
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email ? email : user?.email}
                            onChangeText={(text) => setEmail(text)}
                            placeholder="Nhập email"
                            keyboardType="email-address"
                        />

                        <Button title="Lưu" onPress={() => handleSave(
                            fullName ? fullName : user?.fullName,
                            phoneNumber ? phoneNumber : user?.phoneNumber,
                            email ? email : user?.email)}
                            color="#f95300"
                        />

                        <TouchableOpacity style={styles.btnClose} onPress={() => setModalEditVisible(false)}>

                            <Text style={styles.btnCloseText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.viewBtn}>
                <TouchableOpacity
                    onPress={() => handlePayment()}
                    style={styles.btnContinue}>
                    <Text style={styles.textbtn}>Tiếp tục</Text>
                </TouchableOpacity>
            </View>

        </View >

    )
}

export default InfoPayment