import React, { createContext, useEffect, useState } from 'react'
import { host, Socket_Port } from '../utils/fetching';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Calling connecting
        const socket = io(`http://${host}:${Socket_Port}`, {
            autoConnect: false,
        });
        socket.connect();
        
        // Set Client
        setSocket(socket);

        socket.on('message', (msg) => {
            console.log('Server says:', msg);
        });

        socket.emit('message', 'Hello from client!');
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
