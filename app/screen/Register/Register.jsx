import { Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Icon } from 'react-native-elements';
import { styles } from './styles';


const Register = () => {
    const nav = useNavigation();

    const route = useRoute();
    const { phone, name } = route.params;
    const [password, setPassword] = useState("");
    const [retypePassword, setReTypePassword] = useState("");

    const handleRegister = () => {
        nav.navigate("Home");
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
                style={styles.container}
            >
                
                <Image
                    source={require("../../img/wel-pass.png")}
                    style={styles.imgWel2}
                />

                <View>
                    <Text style={styles.welcomeText}>Tạo mật khẩu</Text>
                </View>

                <View style={{ height: 350, marginTop: 20 }}>

                    <View style={styles.viewInput}>

                        <View style={{marginBottom:20}}>
                            <Text style={{ left: 45, marginBottom:5 }}>Mật Khẩu</Text>
                            <TextInput
                                style={styles.TextInput}
                                placeholder={'Nhập mật khẩu'}
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry
                            />
                        </View>

                        <View>
                            <Text style={{ left: 45, marginBottom:5 }}>Nhập lại mật khẩu</Text>
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
