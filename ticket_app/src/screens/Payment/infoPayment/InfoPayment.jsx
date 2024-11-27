import { View, Text, Image, TouchableWithoutFeedback, Modal, TouchableOpacity, ScrollView, TextInput, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import moment from 'moment-timezone';
import useAuthData from '../../../context/useAuth';
import { showErrorToast } from '../../../utils/toast';

const InfoPayment = () => {

    const nav = useNavigation();
    const route = useRoute();

    const { user } = useAuthData();

    const [fullName, setFullName] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [email, setEmail] = useState(null);

    const trip = route.params?.trip;
    const diemdi = route.params?.diemdi;
    const diemden = route.params?.diemden;

    const gia = route.params?.price
    const price = gia.toLocaleString("vi-VN");



    const selectedSeatArray = route.params?.selectedSeatArray;
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

    const [currentSelection, setCurrentSelection] = useState(null); // 'pickup' hoặc 'dropoff'
    const [pickupPoint, setPickupPoint] = useState(null);
    const [dropOffPoint, setDropOffPoint] = useState(null);

    const handleTripRoute = (trip) => {
        nav.navigate("TripRoute", { trip });
    };
    const closeModal = () => setModalVisible(false);

    const openModal = (selection) => {
        setCurrentSelection(selection);
        setModalVisible(true);
    };

    const handleSelect = (point) => {
        if (currentSelection === "pickup") {
            setPickupPoint(point);
        } else if (currentSelection === "dropoff") {
            setDropOffPoint(point);
        }
        setModalVisible(false);
    };

    const handlePayment = () => {

        if (!pickupPoint || !dropOffPoint) {

            showErrorToast("Vui lòng nhập Điểm đón và Điểm trả", "Vui lòng chọn đầy đủ Điểm đón và Điểm trả trước khi tiếp tục")

            return; // Dừng việc tiếp tục điều hướng
        }
        const CustomerInfo = {
            fullName: fullName || user?.fullName,
            phoneNumber: phoneNumber || user?.phoneNumber,
            email: email || user?.email,
        };

        nav.navigate("Payment", { trip, pickupPoint, dropOffPoint, CustomerInfo, selectedSeatArray, price })
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
            <ScrollView style={styles.body}>
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
                        <Text>{selectedSeatArray?.map(seat => seat).join(', ')}</Text>
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
                                            {pickupPoint ? `${pickupPoint?.name} - ${pickupPoint?.address}` : "Chọn điểm đón"}
                                        </Text>
                                        <Icon type="ionicon" name="caret-down" size={16} color="#333" />
                                    </View>
                                </TouchableOpacity>

                                <Text style={{ color: "#F95300", fontSize: 16, padding: 5 }}>
                                    {pickupPoint ? (
                                        <Text style={{ color: "#F95300", fontSize: 16, padding: 5 }}>
                                            Quý khách vui lòng có mặt tại "{pickupPoint?.name}" trước {pickupPoint?.time} để được trung chuyển hoặc kiểm tra thông tin trước khi lên xe!
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
                                    {dropOffPoint ? `${dropOffPoint?.name} - ${dropOffPoint?.address}` : "Chọn điểm trả"}
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
                </View>
                <Text style={{ paddingHorizontal: 15 }}>nhà Xe</Text>
            </ScrollView>
            <Modal
                onDismiss={() => setModalVisible(false)}
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Đón tại Trạm/văn phòng</Text>

                        {(currentSelection === "pickup"
                            ? trip?.schedule.slice(0, -1) // Loại bỏ item cuối nếu là điểm đón
                            : trip?.schedule.slice(1)    // Loại bỏ item đầu nếu là điểm trả
                        ).map((stop, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.radioButton}
                                onPress={() => handleSelect(stop)}
                            >
                                <View style={styles.radioIcon}>
                                    {/* Đánh dấu tùy chọn đã chọn cho filter hiện tại */}
                                </View>

                                <View>
                                    <Text> {moment(stop?.time, "HH:mm").tz("Asia/Ho_Chi_Minh").format("HH:mm")}</Text>
                                    <Text style={styles.radioTextName}>{stop?.name}</Text>
                                    <Text style={styles.radioTextAddress}>{stop?.address}</Text>
                                </View>

                            </TouchableOpacity>
                        ))}

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