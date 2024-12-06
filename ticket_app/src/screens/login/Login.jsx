import { Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { styles } from './styles'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import CookieUtils, { getAsyncStorage, setAsyncStorage } from '../../utils/cookie';
import { postData } from '../../utils/fetching'
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import auth from '@react-native-firebase/auth';

const Login = () => {

  const nav = useNavigation();

  const route = useRoute();
  const { phoneNumber, fullName } = route.params

  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleLogin = async () => {

    const userInfo = { phoneNumber, password }
    if (!password) {
      showErrorToast("Mật khẩu trống", "Vui lòng nhập mật khẩu")
    }
    try {

      const response = await postData("users/login", userInfo);

      const { user, token } = response?.data;

      console.log("Thông tin người dùng:", user);
      console.log("token", token);


      await setAsyncStorage("token", token)

      await setAsyncStorage("user", user)


      if (response.status === 200) {

        showSuccessToast('Đăng nhập thành công');

        nav.navigate("Home");

      }
      // Gọi onSubmit chỉ sau khi lưu thành công
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
      alert('Đã xảy ra lỗi khi đăng nhập.'); // Hiển thị lỗi cho người dùng
    }

  }
  const [confirm, setConfirm] = useState(null);

  const handleSendOTP = async () => {

  };

  const handleForgotPassword = async () => {
    const internationalPhoneNumber = `+84${phoneNumber.slice(1)}`;
    console.log(internationalPhoneNumber);

    try {
      const confirmation = await auth().signInWithPhoneNumber(internationalPhoneNumber);

      if (confirmation) {
        nav.navigate("ForgotPassword", { confirm: confirmation, phoneNumber: phoneNumber });
      }

    } catch (error) {
      console.log("Error send otp", error);
    }
  }


  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >


          <View
            style={styles.container}
          >

            <Image
              source={require("../../../img/wel-pass.png")}
              style={styles.imgWel2}
            />

            <View>
              <Text style={styles.welcomeText}>Xin chào,{fullName}</Text>

            </View>

            <View style={{ height: 340, marginTop: 20 }}>

              <View style={styles.viewInput}>

                <View style={{ marginBottom: 20 }}>
                  <Text style={{ left: 45, marginBottom: 5 }}>Mật Khẩu</Text>
                  <TextInput
                    style={[styles.TextInput, { borderColor: isFocused ? "#FE9B4B" : "#ced4da" }]}
                    placeholder={'Nhập mật khẩu'}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={!isPasswordVisible}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </View>

                <TouchableOpacity
                  style={{ position: 'absolute', right: 50, top: 33 }}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Icon
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    type='ionicon'
                    size={28}
                    color={isFocused ? "#FE9B4B" : "#ced4da"} />
                </TouchableOpacity>
              </View>
              <View style={{
                flexDirection: 'row',
                width: "83%",
                justifyContent: "space-between",
                alignSelf: "center"
              }}>

                <View>
                  <TouchableOpacity
                    onPress={() => handleForgotPassword()}
                  >
                    <Text style={{ textDecorationLine: 'underline' }}>Quên/Tạo mật khẩu ?</Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <TouchableOpacity
                    onPress={() => { nav.navigate("Welcome") }}
                  >
                    <Text style={{ textDecorationLine: 'underline' }}>Không phải tôi?</Text>
                  </TouchableOpacity>
                </View>

              </View>

              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.btn_submit}
                  onPress={handleLogin}
                >
                  <Text style={styles.text_btn}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback >

  )
}

export default Login

