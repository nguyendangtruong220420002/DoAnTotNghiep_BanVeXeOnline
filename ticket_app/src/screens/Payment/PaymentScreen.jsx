import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Linking from 'expo-linking'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { getData, postData } from '../../utils/fetching';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { Icon } from 'react-native-elements';

const PaymentScreen = (data) => {

    const nav = useNavigation()
    const route = useRoute();
    const bookingId = data?.bookingId;
    const [orderInfo, setOrderInfo] = useState(data?.data)
    const bookingId2 = data?.bookingId2;

    useEffect(() => {
        const processPayment = async () => {
            try {
                if (orderInfo?.status === 'CANCELLED') {
                    if (bookingId) {
                        const response = await getData('addPaymentRoute/cancel', { bookingId: bookingId2 });
                        console.log(response.data);

                    }

                    if (bookingId2) {
                        const response = await getData('addPaymentRoute/cancel', { bookingId });
                        console.log(response.data);

                    }
                    showErrorToast("Thanh toán thất bại");

                } else if (orderInfo?.status === 'PAID') {

                    if (bookingId) {
                        const response = await getData('addPaymentRoute/success', { bookingId });
                        console.log(response.data);

                    }

                    if (bookingId2) {

                        const response = await getData('addPaymentRoute/success', { bookingId: bookingId2 });
                        console.log("as", response.data);
                    }
                    showSuccessToast("Thanh toán thành công");
                }


            } catch (error) {
                console.error("Lỗi khi xử lý thanh toán:", error);
            }
        };


        processPayment();

    }, [bookingId, bookingId2])



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
