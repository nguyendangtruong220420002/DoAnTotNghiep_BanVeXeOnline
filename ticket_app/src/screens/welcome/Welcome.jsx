import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, KeyboardAvoidingViewBase, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import { styles } from "./styles";
import { Icon } from 'react-native-elements';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { OtpInput } from 'react-native-otp-entry';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import { getData, postData } from '../../utils/fetching';


const Welcome = () => {

    const nav = useNavigation();

    const [isPhoneInput, setIsPhoneInput] = useState(true)
    const [showOTP, setshowOTP] = useState(false)
    const [confirm, setConfirm] = useState(null);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [name, setName] = useState("");
    const [OTP, setOTP] = useState("");
    const [isFocused, setIsFocused] = useState(false);


    const handleContinue = async () => {
        const regexPhone = /^0\d{9}$/;
        if (!regexPhone.test(phoneNumber)) {
            alert('Vui lòng nhập số điện thoại hợp lệ');
        } else {
            try {
                const response = await postData("users/check-phone", { phoneNumber })

                const fullName = response?.data?.user?.fullName;
                console.log(response.data);

                if (response.status === 200 && response.data.exists) {
                    nav.navigate("Login", { phoneNumber, fullName });
                } else if (response.status === 201) {
                    setIsPhoneInput(false); // Trigger registration dialog
                }
            } catch (error) {
                console.error("Error when find phoneNumber:", error);
                alert("Có lỗi xảy ra khi kiểm tra số điện thoại");
            }
        }
    };

    const handleBack = () => {
        setIsPhoneInput(true);
    }
    const handleBackName = () => {
        setshowOTP(false);
        handleContinue();
    }

    const handleSendOTP = async () => {
        const internationalPhoneNumber = `+84${phoneNumber.slice(1)}`;
        console.log(internationalPhoneNumber);

        try {
            const confirmation = await auth().signInWithPhoneNumber(internationalPhoneNumber);
            console.log(confirmation.confirm());
            
            setConfirm(confirmation);
        } catch (error) {
            console.log("Error send otp", error);
        }
    };

    const handleSubmitOTP = async () => {

        try {
            await confirm.confirm(OTP);
            console.log("OTP verification successful");

            nav.navigate("Register", {
                phoneNumber: phoneNumber,
                fullName: name,
            });
        } catch (error) {
            console.log('Invalid code:', error);
        }
    };

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <View
                style={styles.container}
            >
                <Image
                    source={showOTP ? require("../../../img/wel-pass.png") : require("../../../img/welcome-template.png")}
                    style={showOTP ? styles.imgWel2 : styles.imgWel}
                />

                {
                    isPhoneInput ?
                        (<View>
                            <Text style={styles.welcomeText}>Chào mừng bạn đến với</Text>
                            <Text style={styles.welcomeText}>Vé Xe Online</Text>


                        </View>
                        ) : (
                            <View>
                                <Text style={styles.welcomeText}> {confirm ? "Vui lòng nhập mã OTP" : "Họ Tên của bạn ?"}</Text>
                                <Text style={{ textAlign: 'center', marginTop: 10, color: "green" }} >{confirm ? "Mã OTP đã được gửi về số: " + phoneNumber : ""} </Text>

                            </View>
                        )
                }

                {confirm ? (
                    <View style={{
                        height: 350,
                        marginTop: 20,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <View style={{
                            marginVertical: 22,
                            width: '80%'

                        }}
                        >

                            <OtpInput
                                numberOfDigits={6}
                                onTextChange={(text) => setOTP(text)}
                            />
                        </View>

                        <View style={{
                            marginTop: 10,
                            flexDirection: 'row'
                        }}>
                            <Text style={{}}>Không nhận được mã !</Text>
                            <TouchableOpacity style={{}}
                                onPress={handleSendOTP}
                            >
                                <Text style={{ color: '#3399FF' }}>Gửi lại</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ marginTop: 80, backgroundColor: "white", width: 60, height: 60, alignSelf: 'center', justifyContent: 'center', borderRadius: 50 }}>
                            <TouchableOpacity onPress={handleBackName}>
                                <Icon name='arrow-back-outline' type='ionicon' color={'#FE9B4B'} size={38} />

                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>

                            <TouchableOpacity style={styles.btn_submit}
                                onPress={handleSubmitOTP}
                            >
                                <Text style={styles.text_btn}>Xác Nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={{ height: 300, marginTop: 20 }}>

                        <View style={styles.viewInput}>

                            <Icon name={isPhoneInput ? 'phone' : 'person'} color={isFocused ? "#FE9B4B" : "#ced4da"} size={40} />

                            <TextInput
                                style={[styles.TextInput, { borderColor: isFocused ? "#FE9B4B" : "#ced4da" }]}
                                placeholder={isPhoneInput ? "Nhập số điện thoại" : 'Nhập họ và tên'}
                                value={isPhoneInput ? phoneNumber : name}
                                onChangeText={(text) => isPhoneInput ? setPhoneNumber(text) : setName(text)}
                                keyboardType={isPhoneInput ? "numeric" : "default"}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />

                        </View>

                        {isPhoneInput ? (
                            <View>
                                <Text></Text>
                            </View>
                        ) : (
                            <View style={{ marginTop: 80, backgroundColor: "white", width: 60, height: 60, alignSelf: 'center', justifyContent: 'center', borderRadius: 50 }}>
                                <TouchableOpacity onPress={handleBack}>
                                    <Icon name='arrow-back-outline' type='ionicon' color={'#FE9B4B'} size={38} />
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={styles.btn_submit}
                                onPress={isPhoneInput ? handleContinue : handleSendOTP}
                            >
                                <Text style={styles.text_btn}>Tiếp Tục</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                )}

            </View>

        </TouchableWithoutFeedback >

    );
}

export default Welcome

