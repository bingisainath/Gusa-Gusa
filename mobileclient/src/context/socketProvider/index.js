import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState({ individual: [], groups: [] });
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    const initializeSocketConnection = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const newSocket = io(process.env.BACKEND_URL, {
          auth: { token },
          transports: ['websocket'],
        });

        newSocket.on('connect', () => {
          console.log('Connected to socket:', newSocket.id);
        });

        newSocket.on('onlineUser', (users) => {
          setOnlineUsers(users);
        });

        newSocket.on('conversation', (conversationsData) => {
          setConversations(conversationsData);
        });

        newSocket.on('user-message', (messages) => {
          // Handle incoming individual messages
          console.log('New messages:', messages);
        });

        newSocket.on('group-message', (groupMessages) => {
          // Handle incoming group messages
          console.log('New group messages:', groupMessages);
        });

        newSocket.on('call-history', (history) => {
          setCallHistory(history);
        });

        newSocket.on('incomingCall', (data) => {
          setIncomingCall(data);
        });

        newSocket.on('callAccepted', () => {
          // Handle call accepted
        });

        newSocket.on('callRejected', () => {
          // Handle call rejected
        });

        newSocket.on('callEnded', () => {
          // Handle call ended
        });

        setSocket(newSocket);

        return () => {
          if (newSocket) {
            newSocket.disconnect();
          }
        };
      } catch (error) {
        console.error('Error initializing socket connection:', error);
      }
    };

    initializeSocketConnection();
  }, []);

  const startCall = (userToCall, signalData, name) => {
    socket.emit('callUser', { userToCall, signalData, from: socket.id, name });
  };

  const acceptCall = (to) => {
    socket.emit('accept-call', { to });
  };

  const rejectCall = (receiverId) => {
    socket.emit('rejectCall', { receiverId });
  };

  const endCall = (id) => {
    socket.emit('endCall', { id });
  };

  const fetchCallHistory = () => {
    socket.emit('get-call-history');
  };

  const fetchConversations = (userId) => {
    socket.emit('sidebar', userId);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        conversations,
        onlineUsers,
        incomingCall,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        fetchCallHistory,
        fetchConversations,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
