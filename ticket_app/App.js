
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './src/screens/StackNavigator';

export default function App() {
  return (
  <>
    <StackNavigator/>
  </>
  );
}

