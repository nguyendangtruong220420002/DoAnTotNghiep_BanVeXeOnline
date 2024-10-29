import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, KeyboardAvoidingViewBase, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import { styles } from "./styles";
import { Icon } from 'react-native-elements';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { OtpInput } from 'react-native-otp-entry';
// import { auth } from '../../config/firebase';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from '../../config/firebase';
import firebase from "firebase/compat/app";

const Welcome = () => {


    const recaptchaRef = useRef();
    const [verification, setVerification] = useState();

    const nav = useNavigation();

    const [isPhoneInput, setIsPhoneInput] = useState(true)
    const [showOTP, setshowOTP] = useState(false)

    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [OTP, setOTP] = useState("");


    const handleContinue = () => {

        console.log(phone);
        // if else xem số điện thoại đã tồn tại chưa nếu có thì chuyển sang trang đăng nhập 
        // nếu chưa thì tiếp tục đăng ký
        if (!phone) {
            nav.navigate("Login")
        } else {
            setIsPhoneInput(false);
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

        try {
            // if (phone) {
            //     const phoneProvider = new firebase.auth.PhoneAuthProvider();
            //     phoneProvider
            //         .verifyPhoneNumber(
            //             phone,
            //             recaptchaRef.current
            //         )
            //         .then((confirmation) => {
            //             setVerification(confirmation)
            //             setshowOTP(true)
            //         });
            // }
        } catch (error) {
            Alert.alert('Error', error.message);
            console.error('Error sending OTP: ', error);
        }
    };


    const handleSubmitOTP = async () => {

        // if (isOTPValid?.status == 200) {
        nav.navigate("Register", {
            phone: phone,
            name: name,
        });
        // } else {
        //     console.error('Invalid OTP');
        // }
        console.log("Xác nhận OTP: ", OTP);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
                style={styles.container}
            >
                <Image
                    source={showOTP ? require("../../img/wel-pass.png") : require("../../img/welcome-template.png")}
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
                                <Text style={styles.welcomeText}> {showOTP ? "Vui lòng nhập mã OTP" : "Họ Tên của bạn ?"}</Text>
                                <Text style={{ textAlign: 'center', marginTop: 10, color: "green" }} >{showOTP ? "Mã OTP đã được gửi về số: " + phone : ""} </Text>
                                <FirebaseRecaptchaVerifierModal
                                    ref={recaptchaRef}
                                    firebaseConfig={firebaseConfig}
                                />
                            </View>
                        )
                }

                {showOTP ? (
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
                    <View style={{ height: 350, marginTop: 20 }}>

                        <View style={styles.viewInput}>

                            <Icon name={isPhoneInput ? 'phone' : 'person'} color={"#ced4da"} size={40} />

                            <TextInput
                                style={styles.TextInput}
                                placeholder={isPhoneInput ? "Nhập số điện thoại" : 'Nhập họ và tên'}
                                value={isPhoneInput ? phone : name}
                                onChangeText={(text) => isPhoneInput ? setPhone(text) : setName(text)}
                                keyboardType={isPhoneInput ? "numeric" : "default"}
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
                <View id="recaptcha-container" />
            </View>
        </TouchableWithoutFeedback >
    );
}

export default Welcome

