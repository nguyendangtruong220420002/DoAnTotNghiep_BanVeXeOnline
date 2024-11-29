import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Linking from 'expo-linking'
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const PaymentScreen = (data) => {
    const nav = useNavigation()
    const orderInfo = data?.data?.orderInfo;

    return (
        <View style={styles.container}>
            <Text style={{ padding: 15, color: orderInfo?.status === 'CANCELLED' ? "red" : "green" }}> {orderInfo?.status === 'CANCELLED' ? "Thanh toán thất bại (Bạn đã hủy thanh toán)" : "Bạn đã thanh toán thành công"} </Text>

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
    },
});

export default PaymentScreen;
