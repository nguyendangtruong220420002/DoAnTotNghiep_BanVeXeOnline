// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getAsyncStorage } from '../utils/cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const storedToken = await getAsyncStorage("token");
            const storedUser = await getAsyncStorage("user");

            setToken(storedToken);
            setUser(storedUser);
        };

        fetchData();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
