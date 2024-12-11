import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { deleteAsyncStorage, getAsyncStorage } from './cookie';

export const checkTokenExpiration = async (navigation) => {
  try {
    const token = await getAsyncStorage("token");

    if (token) {

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded?.exp > currentTime) {
        // Token is valid, navigate to Home screen
        navigation.navigate("Home");
      } else {
        // Token is expired, clear AsyncStorage and navigate to Login screen
        await deleteAsyncStorage("token");
        await deleteAsyncStorage("user");
        navigation.navigate("Welcome");
      }
    } else {
      // No token, navigate to Login screen
      navigation.navigate("Welcome");
    }
  } catch (error) {
    console.error("Error checking token:", error);
    navigation.navigate("Welcome");
  }
};