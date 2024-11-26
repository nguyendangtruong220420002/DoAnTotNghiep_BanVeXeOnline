import { Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { styles } from './styles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect } from 'react'
import { Icon } from 'react-native-elements'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import useAuthData from '../../context/useAuth'
import { postData } from '../../utils/fetching'

const Setting = () => {
  const nav = useNavigation()

  const route = useRoute();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setReTypePassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isFocused1, setIsFocused1] = useState(false);

  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);


  const { user, setUser, token } = useAuthData();

  useEffect(() => {
    // Set the header with dynamic data
    nav.setOptions({
      headerTitle: () => (
        <View style={styles.viewTitle}>
          <Text style={styles.headerText}>Đổi mật khẩu</Text>
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
        height: 80,
        backgroundColor: "#f95300",
      },
      headerTitleAlign: "center",
      headerTintColor: 'white',
    });
  }, [nav]);

  const handleChangePassword = async () => {
    const data = { oldPassword, newPassword }

    console.log(user?._id);

    if (retypePassword !== newPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const response = await postData(`users/change-password/${user?._id}`, data)
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
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}>
      <View style={styles.body}>

        <View>
          {/* 0 */}
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.textlabel}>Mật Khẩu cũ</Text>
            <TextInput

              style={[styles.TextInput, { borderColor: isFocused ? "#FE9B4B" : "#ced4da" }]}
              placeholder={'Nhập mật khẩu'}
              value={oldPassword}
              onChangeText={(text) => setOldPassword(text)}
              secureTextEntry={!isPasswordVisible}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
          <TouchableOpacity
            style={{ position: 'absolute', right: 40, top: 40 }}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Icon
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              type='ionicon'
              size={28}
              color={isFocused ? "#FE9B4B" : "#ced4da"} />
          </TouchableOpacity>

          {/* 1 */}
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.textlabel}>Mật khẩu mới</Text>
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

          {/* 2 */}
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.textlabel}>Nhập lại mật khẩu mới</Text>
            <TextInput
              style={[styles.TextInput, { borderColor: isFocused2 ? "#FE9B4B" : "#ced4da" }]}
              placeholder={'Nhập lại mật khẩu mới'}
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
        </View>


        <View style={{ justifyContent: 'flex-end' }}>
          <TouchableOpacity style={styles.btn_submit}
            onPress={() => handleChangePassword()}
          >
            <Text style={styles.text_btn}>Cật nhật</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>

  )
}

export default Setting

