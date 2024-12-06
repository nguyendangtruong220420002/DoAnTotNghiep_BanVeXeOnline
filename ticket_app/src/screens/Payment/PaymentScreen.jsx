import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Linking from 'expo-linking'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getData, postData } from '../../utils/fetching';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { Icon } from 'react-native-elements';

const PaymentScreen = (data) => {
    const nav = useNavigation()
    const bookingId = data?.bookingId;
    const [orderInfo, setOrderInfo] = useState(data?.data)
    const bookingID = data?.bookingID;

    console.log("data payment", orderInfo);

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

    useEffect(() => {
        if (orderInfo?.status === 'CANCELLED') {
            getData('addPaymentRoute/cancel', { bookingId })
                .then((response) => {
                    console.log(response.data);
                    showErrorToast("Thanh toán thất bại")
                })
        } else if (orderInfo?.status === 'PAID') {
            getData('addPaymentRoute/success', { bookingId })
                .then((response) => {
                    console.log(response.data);
                    showSuccessToast("Thanh toán thành công")
                })
        } 
    }, [bookingId, orderInfo])

    return (
        <View style={styles.container}>
            <View style={{ position: 'absolute', top: 80 }}>
                {orderInfo?.status === 'CANCELLED' && <Icon type='ionicon' name='ban-outline' color={"red"} size={100} />}
                {orderInfo?.status === 'PAID' && <Icon type='ionicon' name='checkmark-circle-outline' color={"green"} size={100} />}
                {orderInfo?.status === 'PENDING' && <Icon type='ionicon' name='ban-outline' color={"red"} size={100} />}

            </View>

            <View style={{ position: 'absolute', top: 200 }}>
                <Text style={{ padding: 15, fontSize: 20, textAlign: "center", color: orderInfo?.status === 'CANCELLED' || orderInfo?.status === 'PENDING' ? 'red' : 'green' }}>
                    {orderInfo?.status === 'CANCELLED' && "Thanh toán thất bại (Bạn đã hủy thanh toán)"}
                    {orderInfo?.status === 'PAID' && "Bạn đã thanh toán thành công"}
                    {orderInfo?.status === 'PENDING' && "Thanh toán thất bại (Bạn đã hủy thanh toán)"}
                </Text>
            </View>

            <View>
                <TouchableOpacity
                    onPress={() => nav.navigate("Home")}
                >
                    <Text>Trở về</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white"
    },
});

export default PaymentScreen;
