import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';

const InfoTicket = () => {
    const nav = useNavigation()
    const [loading, setLoading] = useState(true);
    const route = useRoute()
    const item = route?.params;

    useEffect(() => {

        // Set the header with dynamic data
        nav.setOptions({
            headerTitle: () => (
                <View style={styles.viewTitle}>
                    <Text style={styles.headerText}>Thông tin chi tiết vé</Text>
                </View>
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
    }, [nav]);

    return (
        <View style={styles.body}>

            {/* Thông tin hành khách */}
            <View style={styles.viewInfoPassenger}>
                <Text style={styles.title}>Thông tin hành khách</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Họ và tên:</Text>
                    <Text style={styles.infoValue}>{item?.passengerInfo?.fullName || 'N/A'}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Số điện thoại:</Text>
                    <Text style={styles.infoValue}>{item?.passengerInfo?.phoneNumber || 'N/A'}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{item?.passengerInfo?.email || 'N/A'}</Text>
                </View>
            </View>

            <View style={styles.viewInfoTrip}>
                <Text style={styles.title}>Thông tin chuyến đi</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Trạng thái thanh toán:</Text>
                    <Text style={{ color: item?.paymentStatus === "Đã thanh toán" ? "green" : "Red" }}>
                        {item?.paymentStatus}
                    </Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Tuyến xe: </Text>
                    <Text style={{ color: "green" }}>
                        {item?.tripId?.routeId.departure} - {item?.tripId?.routeId.destination}
                    </Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Vị trí ghế:</Text>
                    <Text style={styles.infoValue}>{item?.seatId || 'N/A'}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Điểm đón:</Text>
                    <Text style={styles.infoValue}>{item?.selectedDepartureName || 'N/A'}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Điểm trả:</Text>
                    <Text style={styles.infoValue}>{item?.selectedDestinationName || 'N/A'}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Thời gian khởi hành:</Text>
                    <Text style={{ color: "green" }}> {item.Timehouse} {item?.departureDate || 'N/A'}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Giá vé:</Text>
                    <Text style={styles.infoValue}>{item?.totalFare ? `${item.totalFare} VND` : 'N/A'}</Text>
                </View>
            </View>

        </View>
    )
}

export default InfoTicket

