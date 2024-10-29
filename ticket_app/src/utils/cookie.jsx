import AsyncStorage from '@react-native-async-storage/async-storage';

// Set AsyncStorage with expired time
export const setAsyncStorage = async (key, data) => {
    try {
        // Convert data to string
        const strData = JSON.stringify(data);
        // Save data to AsyncStorage
        await AsyncStorage.setItem(key, strData);
        console.log("Data set in AsyncStorage for key:", key, "with data:", strData);
        
    } catch (error) {
        console.error('Error setting AsyncStorage:', error);
    }
};

export const getAsyncStorage = async (key) => {
    try {
        // Retrieve data from AsyncStorage
        const result = await AsyncStorage.getItem(key);
        console.log("Data retrieved from AsyncStorage for key:", key, "is:", result);
        if (result !== null) {
            // Parse the data
            return JSON.parse(result);
        } else {
            return null; // Return null if no data found
        }
    } catch (error) {
        console.error('Error getting AsyncStorage:', error);
        return null; // Return null if error occurs
    }
};

// delete AsyncStorage Data
export const deleteAsyncStorage = async (key) => {
    try {
        // Remove data from AsyncStorage
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error deleting AsyncStorage:', error);
    }
};