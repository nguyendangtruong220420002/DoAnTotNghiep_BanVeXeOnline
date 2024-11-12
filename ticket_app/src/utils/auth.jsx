import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

export const checkTokenExpiration = async (navigation) => {
  try {
    const token = await AsyncStorage.getItem("token");      

    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp > currentTime) {
        // Token is valid, navigate to Home screen
        navigation.navigate("Home");
      } else {
        // Token is expired, clear AsyncStorage and navigate to Login screen
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        navigation.navigate("Login");
      }
    } else {
      // No token, navigate to Login screen
      navigation.navigate("Login");
    }
  } catch (error) {
    console.error("Error checking token:", error);
    navigation.navigate("Login");
  }
};