
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './src/screens/StackNavigator';
import { AuthProvider } from './src/context/useContext';
import Toast from 'react-native-toast-message';



export default function App() {
  return (
    <>
      <AuthProvider>
        <StackNavigator />
        <Toast />
      </AuthProvider>


    </>
  );
}

