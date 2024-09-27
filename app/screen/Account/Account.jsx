import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { styles } from './styles'
import React from 'react'
import { Icon, ListItem } from 'react-native-elements'

const Account = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.viewHeader}>
        <View>
          <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>Tài khoản</Text>
        </View>
        <Image
          source={require('../../img/imageheader.png')} // Replace with your image path
          style={styles.headerImage}
          resizeMode="cover"
        />
      </SafeAreaView>

      <ScrollView style={styles.body}>
        <View style={styles.list}>
          <View style={styles.view_user}>
            <Icon name='person-circle' type='ionicon' size={58} color={"#FE9B4B"} />
            <View style={styles.ViewText_Wel}>
              <Text style={{ fontSize: 18, color: "black", marginBottom: 8 }}>Phem Sỹ Thái</Text>
              <Text style={{ color: "gray" }}>0911513297</Text>
            </View>
          </View>

          <View style={styles.ListItem}>
            <ListItem >
              <Icon name="settings-outline" type="ionicon" color="#FE9B4B" />
              <ListItem.Content>
                <ListItem.Title>Cài đặt</ListItem.Title>
                <ListItem.Subtitle><Text style={{ fontSize: 12, }}>Đổi mật khẩu,...</Text></ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem >
              <Icon name="log-out-outline" type="ionicon" color="#FE9B4B" />
              <ListItem.Content >
                <ListItem.Title>Đăng xuất </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          </View>

        </View>
      </ScrollView>

    </View>

  )
}

export default Account

