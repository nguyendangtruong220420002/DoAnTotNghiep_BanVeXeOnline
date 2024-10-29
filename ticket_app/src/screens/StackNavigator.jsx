
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import Ticket from '../screens/ticket/Ticket'
import Home from '../screens/home/Home'
import Register from '../screens/register/Register'
import Login from '../screens/login/Login'
import Welcome from '../screens/welcome/Welcome'
import Account from '../screens/account/Account'
import DetailAccount from './detail_account/DetailAccount'

const Stack = createStackNavigator();
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
          padding:5
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
        <Stack.Screen name='DetailAccount' component={DetailAccount} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator
