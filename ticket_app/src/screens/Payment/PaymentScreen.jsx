import { Linking, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const PaymentScreen = () => {

    const { paymentUrl } = route.params;

    useEffect(() => {
        // Tự động mở URL thanh toán khi màn hình được hiển thị
        if (paymentUrl) {
            Linking.openURL(paymentUrl).catch(err => console.error("Không thể mở URL:", err));
        }
    }, [paymentUrl]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đang chuyển đến trang thanh toán...</Text>
            {paymentUrl ? (
                <Button
                    title="Mở URL thanh toán"
                    onPress={() => Linking.openURL(paymentUrl)}
                />
            ) : (
                <Text>Đang xử lý...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default PaymentScreen
