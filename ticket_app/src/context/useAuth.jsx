// useAuthData.js

import { useState, useEffect, useCallback } from 'react';
import { getAsyncStorage } from '../utils/cookie'; // Adjust the import according to your actual file structure
import { useFocusEffect } from '@react-navigation/native';

const useAuthData = () => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const fetchData = async () => {
        const storedToken = await getAsyncStorage('token');
        const storedUser = await getAsyncStorage('user');
        setToken(storedToken);
        setUser(storedUser);
    };

    // Fetch data initially
    useEffect(() => {
        fetchData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );
    // This can be used to trigger a fetch manually (if you want to refresh data on demand)
    const refreshUserData = async () => {
        await fetchData();
    };
    return { user, token, setUser, refreshUserData };
};

export default useAuthData;
