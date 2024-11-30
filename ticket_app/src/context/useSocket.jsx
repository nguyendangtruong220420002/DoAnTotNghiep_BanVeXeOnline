import React, { useContext } from 'react';
import { SocketContext } from './SocketProvider';


// Use Auth
export const useSocket = () => useContext(SocketContext)?.socket.get;
