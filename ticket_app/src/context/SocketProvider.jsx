import React, { createContext, useEffect, useState } from 'react'
import { host_socket, Socket_Port, API_URL } from '../utils/fetching';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

    const [socket, setSocket] = useState(null);
    const http_local = `http://${host_socket}:${Socket_Port}`;
    const http_hosting = API_URL; // https://doantotnghiep-banvexeonline.onrender.com/
    useEffect(() => {
        // Calling connecting
        const socket = io(`${http_hosting}`, {
            autoConnect: false,
        });
        socket.connect();

        // Set Client
        setSocket(socket);

        socket.on('message', (msg) => {
            console.log('Server says:', msg);
        });

        // Return clean
        return () => {
            // Disconnect Socket
            socket.disconnect();
            // Clean
            setSocket(null);
        };
    }, []);
    const sharedData = {
        socket: { get: socket },
    };

    // Return
    return (
        <SocketContext.Provider value={sharedData}>
            {children}
        </SocketContext.Provider>
    );
};
