import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from './styles'
import { Icon, Tab, TabView } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

const Ticket = () => {
  const nav = useNavigation()

  useEffect(() => {
    // Set the header with dynamic data
    nav.setOptions({
      headerTitle: () => (
        <View style={styles.viewTitle}>
          <Text style={styles.headerText}>Vé xe</Text>
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
        height: 100,
        backgroundColor: "#f95300",
      },
      headerTitleAlign: "center",
      headerTintColor: 'white',
    });
  }, [nav]);

  const [index, setIndex] = useState(0);

  return (
    <>

      <View style={styles.container}>
        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          indicatorStyle={{
            backgroundColor: '#f95300',
            height: 3
          }}

        >
          <Tab.Item
            title="Sắp khởi hành"
            titleStyle={{ fontSize: 14, color: index === 0 ? "#f95300" : "#333", }}
            containerStyle={{ backgroundColor: "#fff" }}
          />
          <Tab.Item
            title="Lịch sử vé"
            titleStyle={{ fontSize: 14, color: index === 1 ? "#f95300" : "#333" }}
            containerStyle={{ backgroundColor: "#fff" }}
          />
        </Tab>
        <TabView value={index} onChange={setIndex} animationType="spring">
          <TabView.Item style={{ width: '100%' }}>
            <Text>Recent</Text>
          </TabView.Item>

          <TabView.Item style={{ width: '100%' }}>
            <Text>Favorite</Text>
          </TabView.Item>

        </TabView>
      </View>
    </>
  )
}

export default Ticket
