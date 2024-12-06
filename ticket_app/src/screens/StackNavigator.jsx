
import React, { createRef, useEffect } from 'react'
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
import ResultSearch from './result_search/ResultSearch'
import ChooseSeat from './chooseSeat/ChooseSeat'
import { checkTokenExpiration } from '../utils/auth'
import ListProvinces from './home/ListProvinces/ListProvinces'
import TripRoute from './TripRoute/TripRoute'
import Setting from './setting/Setting'
import Payment from './Payment/Payment'
import InfoPayment from './Payment/infoPayment/InfoPayment'
import PaymentScreen from './Payment/PaymentScreen'
import Toast from 'react-native-toast-message'
import { SocketProvider } from '../context/SocketProvider'
import ReturnTrip from './result_search/returnTrips/ReturnTrip'
import ForgotPassword from './forgotPassword/ForgotPassword'
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function HomeScreen() {

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{

        tabBarActiveTintColor: "#FE9B4B",
        tabBarStyle: {
          display: "flex",
          padding: 8,
          paddingBottom: 10,
          height: 58
        },
      }}
    >
      <Tab.Screen name='HomeTab' component={Home}
        options={{
          headerShown: false,
          title: 'Trang Chủ',
          tabBarIcon: ({ focused, size, color }) => (
            <Icon name={focused ? "home" : "home-outline"} type='ionicon' size={size} color={color} />
          )
        }} />
      <Tab.Screen name='Ticket' component={Ticket} options={{
        title: 'Vé Xe',
        headerShown: true,
        tabBarIcon: ({ focused, size, color }) => (
          <Icon name={focused ? "ticket" : "ticket-outline"} type='ionicon' size={size} color={color} />
        )
      }} />
      <Tab.Screen name='Account' component={Account} options={{
        title: 'Tài Khoản',
        headerShown: false,
        tabBarIcon: ({ focused, size, color }) => (
          <Icon name={focused ? "person-circle" : "person-circle-outline"} type='ionicon' size={size} color={color} />
        )
      }} />
    </Tab.Navigator>
  )
}


const StackNavigator = () => {
  const navigationRef = createRef();

  useEffect(() => {
    if (navigationRef.current) {
      checkTokenExpiration(navigationRef.current);
    }
  }, []);


  return (
    <NavigationContainer
    >
      <SocketProvider>
        <Toast />
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name='Welcome' options={{ headerShown: false }} component={Welcome} />
          <Stack.Screen name='Login' options={{ headerShown: false }} component={Login} />
          <Stack.Screen name='Register' options={{ headerShown: false }} component={Register} />
          <Stack.Screen name='ForgotPassword' component={ForgotPassword} />

          <Stack.Screen name='Home' options={{ headerShown: false, }} component={HomeScreen} />
          <Stack.Screen name='DetailAccount'
            component={DetailAccount}
          />
          <Stack.Screen name='ListProvinces' component={ListProvinces} />
          <Stack.Screen name='TripRoute' component={TripRoute} />
          <Stack.Screen name='RSearch' component={ResultSearch} />
          <Stack.Screen name='ChooseSeat' component={ChooseSeat} />
          <Stack.Screen name='Setting' component={Setting} />
          <Stack.Screen name='ReturnTrip' component={ReturnTrip} />
          <Stack.Screen name='InfoPayment' component={InfoPayment} />
          <Stack.Screen name='Payment' component={Payment} />
          <Stack.Screen name='PaymentScreen' component={PaymentScreen} />

        </Stack.Navigator>
      </SocketProvider>
    </NavigationContainer>
  )
}

export default StackNavigator
