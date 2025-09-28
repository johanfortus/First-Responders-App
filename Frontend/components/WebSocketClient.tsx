import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { io, Socket } from 'socket.io-client';

const HOST = 'http://10.108.81.95:5000';

export default function WebSocketClient({ userid, token }: { userid?: string; token?: string }) {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(HOST, {
      transports: ['polling', 'websocket'], // allow polling first
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 5,
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('socket connected', socket.id);

      if (token) {
        socket.emit('authenticate', { token, userid });
      } else if (userid) {
        socket.emit('subscribe', { userid });
      }
    });

    socket.on('response', (data: string) => {
      setReceivedMessages(prev => [...prev, data]);
    });

    socket.on('new_call', (call) => {
      console.log('new_call event', call);
      setReceivedMessages(prev => [...prev, JSON.stringify(call)]);
    });

    socket.on('connect_error', (err) => {
      console.warn('connect_error', err);
    });

    socket.on('disconnect', (reason) => {
      console.log('socket disconnected', reason);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, userid]);

  const sendMessage = () => {
    if (!message.trim() || !socketRef.current) return;
    socketRef.current.emit('message', message);
    setMessage('');
  };

  return (
    <View style={{ padding: 12 }}>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Enter message"
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <Button title="Send" onPress={sendMessage} />
      <View style={{ marginTop: 12 }}>
        {receivedMessages.map((msg, i) => (
          <Text key={i} style={{ marginBottom: 6 }}>{msg}</Text>
        ))}
      </View>
    </View>
  );
}