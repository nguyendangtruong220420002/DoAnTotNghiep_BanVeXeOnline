import Toast from 'react-native-toast-message';

// Thông báo thành công
export const showSuccessToast = (text1, text2 = '', visibilityTime = 1900) => {
    Toast.show({
        type: 'success',
        text1: text1,
        text2: text2,
        visibilityTime: visibilityTime,
    });
};

// Thông báo lỗi
export const showErrorToast = (text1, text2 = '', visibilityTime = 1500) => {
    Toast.show({
        type: 'error',
        text1: text1,
        text2: text2,
        visibilityTime: visibilityTime,
    });
};

// Thông báo cảnh báo
export const showWarningToast = (text1, text2) => {
    Toast.show({
        type: 'info',
        text1: text1,
        text2: text2,
        visibilityTime: 1500
    });
};
