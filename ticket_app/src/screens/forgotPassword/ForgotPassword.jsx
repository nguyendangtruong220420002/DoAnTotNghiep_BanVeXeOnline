import { Image, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from './styles'
import { useNavigation, useRoute } from '@react-navigation/native'
import useAuthData from '../../context/useAuth'
import { OtpInput } from 'react-native-otp-entry';
import { showSuccessToast } from '../../utils/toast'
import { postData } from '../../utils/fetching'
import { Icon } from 'react-native-elements'

const ForgotPassword = () => {

    const nav = useNavigation()
    const route = useRoute();

    const confirm = route.params.confirm;
    const phoneNumber = route.params.phoneNumber;

    const [newPassword, setNewPassword] = useState("");
    const [retypePassword, setReTypePassword] = useState("");
    const [showInputPassword, setShowInputPassword] = useState(false);
    const { user, setUser, token } = useAuthData();

    const [OTP, setOTP] = useState(false);
    const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
    const [isFocused1, setIsFocused1] = useState(false);

    const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);

    useEffect(() => {
        // Set the header with dynamic data
        nav.setOptions({
            headerTitle: () => (
                <View style={styles.viewTitle}>
                    <Text style={styles.headerText}>Tìm tài khoản</Text>
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
                height: 95,
                backgroundColor: "#f95300",
            },
            headerTitleAlign: "center",
            headerTintColor: 'white',
        });
    }, [nav]);

    const handleSubmitOTP = async () => {

        try {
            await confirm.confirm(OTP);
            console.log("OTP verification successful");
            showSuccessToast("Xác thực OTP thành công")
            setShowInputPassword(true)
        } catch (error) {
            showErrorToast("Sai mã OTP", "Vui lòng nhập lại")
            console.log('Invalid code:', error);
        }
    };

    const handleChangePassword = async () => {
        const data = { phoneNumber, newPassword }
        if (retypePassword !== newPassword) {
            alert("Mật khẩu mới không khớp!");
            return;
        }
        try {
            const response = await postData(`users/forgot-password`, data)
            if (response?.status === 200) {
                setOldPassword("")
                setNewPassword("");
                setReTypePassword("");

                alert("Đổi mật khẩu thành công!");

            }
        } catch (error) {

        }


    }
    return (
        <View style={styles.container}>
            <Image
                source={require("../../../img/wel-pass.png")}
                style={styles.imgWel2}
            />
            <View style={styles.body}>
                {!showInputPassword ? (
                    <View style={{
                        height: 350,
                        marginTop: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <View style={{ marginVertical: 22, width: '80%' }}>
                            <OtpInput
                                numberOfDigits={6}
                                onTextChange={(text) => setOTP(text)}
                            />
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row' }}>
                            <Text>Không nhận được mã !</Text>
                            <TouchableOpacity >
                                <Text style={{ color: '#3399FF' }}>Gửi lại</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            marginTop: 80,
                            backgroundColor: "white",
                            width: 60,
                            height: 60,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            borderRadius: 50
                        }}>
                            {/* <TouchableOpacity onPress={handleBackName}>
            <Icon name='arrow-back-outline' type='ionicon' color={'#FE9B4B'} size={38} />
        </TouchableOpacity> */}
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={styles.btn_submit} onPress={handleSubmitOTP}>
                                <Text style={styles.text_btn}>Xác Nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View >
                        <View>

                            {/* 2 */}
                            <View style={{ marginBottom: 15 }}>
                                <Text style={styles.textlabel}>Nhập mật khẩu mới</Text>
                                <TextInput
                                    style={[styles.TextInput, { borderColor: isFocused2 ? "#FE9B4B" : "#ced4da" }]}
                                    placeholder={'Nhập mật khẩu mới'}
                                    value={newPassword}
                                    onChangeText={(text) => setNewPassword(text)}

                                    secureTextEntry={!isPasswordVisible2}
                                    onFocus={() => setIsFocused2(true)}
                                    onBlur={() => setIsFocused2(false)}
                                />
                            </View>
                            <TouchableOpacity
                                style={{ position: 'absolute', right: 45, top: 230 }}
                                onPress={() => setIsPasswordVisible2(!isPasswordVisible2)}
                            >
                                <Icon
                                    name={isPasswordVisible2 ? 'eye-off-outline' : 'eye-outline'}
                                    type='ionicon'
                                    size={28}
                                    color={isFocused2 ? "#FE9B4B" : "#ced4da"} />
                            </TouchableOpacity>
                            <View style={{ marginBottom: 15 }}>
                                <Text style={styles.textlabel}>Mật khẩu lại mới</Text>
                                <TextInput
                                    style={[styles.TextInput, { borderColor: isFocused1 ? "#FE9B4B" : "#ced4da" }]}
                                    placeholder={'Nhập lại mật khẩu'}
                                    value={retypePassword}
                                    onChangeText={(text) => setReTypePassword(text)}
                                    secureTextEntry={!isPasswordVisible1}
                                    onFocus={() => setIsFocused1(true)}
                                    onBlur={() => setIsFocused1(false)}
                                />
                            </View>

                            <TouchableOpacity
                                style={{ position: 'absolute', right: 45, top: 135 }}
                                onPress={() => setIsPasswordVisible1(!isPasswordVisible1)}
                            >
                                <Icon
                                    name={isPasswordVisible1 ? 'eye-off-outline' : 'eye-outline'}
                                    type='ionicon'
                                    size={28}
                                    color={isFocused1 ? "#FE9B4B" : "#ced4da"} />
                            </TouchableOpacity>
                        </View>


                        <View style={{ justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={styles.btn_submit}
                                onPress={() => handleChangePassword()}
                            >
                                <Text style={styles.text_btn}>Cật nhật</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>



        </View>
    )
}

export default ForgotPassword

