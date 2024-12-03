import { Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Icon } from 'react-native-elements';
import { styles } from './styles';
import axios from 'axios';
import { postData } from '../../utils/fetching';
import { setAsyncStorage } from '../../utils/cookie';
import { showErrorToast } from '../../utils/toast';


const Register = () => {
    const nav = useNavigation();

    const route = useRoute();
    const { phoneNumber, fullName } = route.params;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setReTypePassword] = useState("");

    const handleRegister = async () => {

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!regexEmail.test(email)) {
            showErrorToast("Đăng ký thất bại", 'Vui lòng nhập Email đúng định dạng!')

        }
        const userInfo = { fullName, email, password, phoneNumber };

        console.log("Thông tin:", userInfo);

        try {
            const response = await postData("users", userInfo); // Sử dụng userInfo

            const { user } = response?.data;

            await setAsyncStorage("user", user)

            nav.navigate("Home");

            alert('Đăng ký thành công');// Gọi onSubmit chỉ sau khi lưu thành công
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            alert('Đã xảy ra lỗi khi tạo tài khoản.'); // Hiển thị lỗi cho người dùng
        }

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
                style={styles.container}
            >

                <Image
                    source={require("../../../img/wel-pass.png")}
                    style={styles.imgWel2}
                />

                <View>
                    <Text style={styles.welcomeText}>Đăng Ký</Text>
                </View>

                <View style={{ height: 350, marginTop: 20 }}>

                    <View style={styles.viewInput}>

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ left: 45, marginBottom: 5 }}>Email</Text>
                            <TextInput
                                style={styles.TextInput}
                                placeholder={'Nhập email'}
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                keyboardType='email-address'
                            />
                        </View>


                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ left: 45, marginBottom: 5 }}>Mật Khẩu</Text>
                            <TextInput
                                style={styles.TextInput}
                                placeholder={'Nhập mật khẩu'}
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry
                            />
                        </View>

                        <View>
                            <Text style={{ left: 45, marginBottom: 5 }}>Nhập lại mật khẩu</Text>
                            <TextInput
                                style={styles.TextInput}
                                placeholder={'Nhập lại mật khẩu'}
                                value={retypePassword}
                                onChangeText={(text) => setReTypePassword(text)}
                                secureTextEntry
                            />
                        </View>

                    </View>

                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.btn_submit}
                            onPress={handleRegister}
                        >
                            <Text style={styles.text_btn}>Đăng Ký</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Register
