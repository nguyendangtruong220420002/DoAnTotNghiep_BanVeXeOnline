import { Image, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { styles } from './styles'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-elements';


const Login = () => {
  const nav = useNavigation();

  const route = useRoute();
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    nav.navigate("Home");
  }


  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={styles.container}
        >

          <Image
            source={require("../../img/wel-pass.png")}
            style={styles.imgWel2}
          />

          <View>
            <Text style={styles.welcomeText}>Xin Chào!</Text>
          </View>

          <View style={{ height: 340, marginTop: 20 }}>

            <View style={styles.viewInput}>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ left: 45, marginBottom: 5 }}>Mật Khẩu</Text>
                <TextInput
                  style={styles.TextInput}
                  placeholder={'Nhập mật khẩu'}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={!isPasswordVisible}
                />
              </View>

              <TouchableOpacity 
                style={{position:'absolute', right: 50, top:33}}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Icon 
                  name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
                  type='ionicon' 
                  size={28} 
                  color={'gray'}/>
              </TouchableOpacity>
            </View>
            <View style={{
              flexDirection: 'row',
              width: "83%",
              justifyContent: "space-between",
              alignSelf: "center"
            }}>

              <View>
                <TouchableOpacity >
                  <Text style={{ textDecorationLine: 'underline' }}>Quên/Tạo mật khẩu ?</Text>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => {nav.navigate("Welcome")}}
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
      </TouchableWithoutFeedback>
    </SafeAreaView >
  )
}

export default Login

