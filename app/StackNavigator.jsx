import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Welcome from './screen/Welcome/Welcome'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Register from './screen/Register/Register'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './screen/Home/Home'
import Ticket from './screen/Ticket/Ticket'
import Account from './screen/Account/Account'
import { color } from 'react-native-elements/dist/helpers'
import { Icon } from 'react-native-elements'
import Login from './screen/Login/Login'


const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();


function HomeScreen() {

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FE9B4B",
        tabBarStyle: {
          display: "flex",
        },
      }}
    >
      <Tab.Screen name='HomeTab' component={Home}
        options={{
          title: 'Trang Chủ',
          tabBarIcon: ({ focused, size, color }) => (
            <Icon name={focused ? "home" : "home-outline"} type='ionicon' size={size} color={color} />
          )
        }} />
      <Tab.Screen name='Ticket' component={Ticket} options={{
        title: 'Vé Xe',
        tabBarIcon: ({ focused, size, color }) => (
          <Icon name={focused ? "ticket" : "ticket-outline"} type='ionicon' size={size} color={color} />
        )
      }} />
      <Tab.Screen name='Account' component={Account} options={{
        title: 'Tài Khoản',
        tabBarIcon: ({ focused, size, color }) => (
          <Icon name={focused ? "person-circle" : "person-circle-outline"} type='ionicon' size={size} color={color} />
        )
      }} />
    </Tab.Navigator>
  )
}


const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Welcome' component={Welcome} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Home' component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator
