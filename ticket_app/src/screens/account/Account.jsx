import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { styles } from './styles'
import React, { useContext, useEffect, useState } from 'react'
import { Icon, ListItem } from 'react-native-elements'
import auth from '@react-native-firebase/auth'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CookieUtils, { deleteAsyncStorage, getAsyncStorage } from '../../utils/cookie'
import useAuthData, { useAuth } from '../../context/useAuth'
import { showSuccessToast } from '../../utils/toast'

const Account = () => {

  const nav = useNavigation();

  const { user, token, setUser } = useAuthData();

  const handleDetailAccount = () => {
    nav.navigate("DetailAccount")
  }

  const handleSingOut = async () => {

    deleteAsyncStorage("user")
    deleteAsyncStorage("token")

    showSuccessToast("Đã đăng xuất")
    nav.navigate("Welcome")


  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.viewHeader}>
        <View>
          <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>Tài khoản</Text>
        </View>
        <Image
          source={require('../../../img/imageheader.png')} // Replace with your image path
          style={styles.headerImage}
          resizeMode="cover"
        />
      </SafeAreaView>

      <ScrollView style={styles.body}>
        <View style={styles.list}>
          <TouchableOpacity
            onPress={handleDetailAccount}
            style={styles.view_user}>
            {user?.img ? (
              <Image source={{ uri: user?.img }} style={{ width: 70, height: 70, borderRadius: 100 }} />
            ) : (
              <Icon name='person-circle' type='ionicon' size={58} color={"#FE9B4B"} />
            )}

            <View style={styles.ViewText_Wel}>
              <Text style={{ fontSize: 18, color: "black", marginBottom: 8 }}>{user?.fullName}</Text>
              <Text style={{ color: "gray" }}>{user?.phoneNumber}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.ListItem}>
            <ListItem onPress={handleDetailAccount}>
              <Icon name='edit' type='ionicons' color="#FE9B4B" />
              <ListItem.Content >
                <ListItem.Title> <Text>Cập nhật thông tin</Text></ListItem.Title>

              </ListItem.Content>
            </ListItem>
            <ListItem onPress={() => nav.navigate("Setting")}>
              <Icon name="lock-open-outline" type="ionicon" color="#FE9B4B" />
              <ListItem.Content>
                <ListItem.Title><Text>Đổi mật khẩu</Text></ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            <ListItem onPress={handleSingOut}>
              <Icon name="log-out-outline" type="ionicon" color="#FE9B4B" />
              <ListItem.Content >
                <ListItem.Title><Text>Đăng xuất</Text></ListItem.Title>
              </ListItem.Content>
            </ListItem>
          </View>

        </View>
      </ScrollView>

    </View>

  )
}

export default Account

