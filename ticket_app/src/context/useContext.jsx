import React, { createContext, useState, useEffect } from 'react';
import { deleteAsyncStorage, getAsyncStorage, setAsyncStorage } from '../utils/cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const storedUser = await getAsyncStorage('user');
            const storedToken = await getAsyncStorage('token');
            if (storedUser && storedToken) {
                setUser(storedUser); // Make sure to parse the user object
                setToken(storedToken);
            }
        };

        fetchData();
    }, []); // Chạy khi component mount

    const login = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
        setAsyncStorage('user', userData); // Lưu vào AsyncStorage
        setAsyncStorage('token', tokenData); // Lưu token vào AsyncStorage
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        deleteAsyncStorage('user');
        deleteAsyncStorage('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
