import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function Chat() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');

  const incidentId = params.incidentId as string || 'demo';
  const severity = params.severity as string || '0.82';

  const handleSend = () => {
    if (message.trim()) {
      // Placeholder for sending message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Responder Support</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Chat content */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
          {/* Welcome message */}
          <View style={styles.messageContainer}>
            <View style={styles.botMessage}>
              <Text style={styles.messageText}>
                Hi there. How are you feeling after that call?
              </Text>
            </View>
          </View>

          {/* Debug info (remove in production) */}
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              Incident ID: {incidentId}
            </Text>
            <Text style={styles.debugText}>
              Severity: {severity}
            </Text>
          </View>
        </ScrollView>

        {/* Message input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor={COLORS.steelBlue}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <Pressable 
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={message.trim() ? COLORS.white : COLORS.steelBlue} 
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50, // Add padding for status bar
    paddingBottom: 16,
    backgroundColor: COLORS.steelBlue,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.navy,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
  },
  botMessage: {
    backgroundColor: COLORS.softGray,
    padding: 16,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: COLORS.navy,
    lineHeight: 22,
  },
  debugContainer: {
    backgroundColor: COLORS.steelBlue,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    opacity: 0.7,
  },
  debugText: {
    fontSize: 12,
    color: COLORS.white,
    fontFamily: 'monospace',
  },
  inputContainer: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: COLORS.navy,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.navy,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.safetyOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.softGray,
  },
});
