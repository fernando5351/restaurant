import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import useWebSocket from 'react-native-use-websocket';

const WebSocketScreen = () => {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket('ws://storeonline-production.up.railway.app/comments');

  const handleSendMessage = () => {
    if (message) {
      sendJsonMessage({
        author: 'User',
        comment: message,
        pets: "juanito",
      });
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios en tiempo real</Text>
      <View style={styles.chatContainer}>
        {lastJsonMessage && (
          <View style={styles.chatMessage}>
            <Text style={styles.chatAuthor}>{lastJsonMessage.author}: </Text>
            <Text style={styles.chatComment}>{lastJsonMessage.comment}</Text>
          </View>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu comentario"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.status}>{`Estado: ${readyState}`}</Text>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  chatMessage: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  chatAuthor: {
    fontWeight: 'bold',
  },
  chatComment: {
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#00bcd4',
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  status: {
    marginTop: 20,
  },
};

export default WebSocketScreen;
