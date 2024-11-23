import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { styles } from './styles'
import React, { useContext, useEffect, useState } from 'react'
import { Icon, ListItem } from 'react-native-elements'
import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native';
import CookieUtils, { deleteAsyncStorage, getAsyncStorage } from '../../utils/cookie'
import {useAuth } from '../../context/useAuth'

const Account = () => {

  const nav = useNavigation();

  const { user } = useAuth();

  const handleDetailAccount = () => {
    nav.navigate("DetailAccount")
  }

  const handleSingOut = async () => {

    deleteAsyncStorage("token")
    deleteAsyncStorage("user")


    nav.navigate("Welcome")
    alert("Đã đăng xuất")

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
            <Icon name='person-circle' type='ionicon' size={58} color={"#FE9B4B"} />
            <View style={styles.ViewText_Wel}>
              <Text style={{ fontSize: 18, color: "black", marginBottom: 8 }}>{user?.fullName}</Text>
              <Text style={{ color: "gray" }}>{user?.phoneNumber}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.ListItem}>
            <ListItem >
              <Icon name="settings-outline" type="ionicon" color="#FE9B4B" />
              <ListItem.Content>
                <ListItem.Title>Cài đặt</ListItem.Title>
                <ListItem.Subtitle style={{ fontSize: 12 }}>Đổi mật khẩu,...</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            <ListItem >
              <Icon name="person" type="ionicon" color="#FE9B4B" />
              <ListItem.Content >
                <ListItem.Title>Cập nhật thông tin</ListItem.Title>
                <ListItem.Subtitle style={{ fontSize: 12 }}></ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            <ListItem onPress={handleSingOut}>
              <Icon name="log-out-outline" type="ionicon" color="#FE9B4B" />
              <ListItem.Content >
                <ListItem.Title>Đăng xuất </ListItem.Title>
                <ListItem.Subtitle style={{ fontSize: 12 }}></ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          </View>

        </View>
      </ScrollView>

    </View>

  )
}

export default Account

