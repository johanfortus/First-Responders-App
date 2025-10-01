import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Chat() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const incidentId = params.incidentId as string || 'demo';
  const severity = params.severity as string || '0.82';

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: "Hi there. How are you feeling after that call? I'm here to listen and support you.",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendToGemini = async (userMessage: string): Promise<string> => {
    try {
      // Simulate Gemini API call - replace with actual Gemini API
      const response = await fetch('http://127.0.0.1:5000/test-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: `Emergency responder after a ${severity} severity call. Be supportive and assess their mental state.`,
          incidentId: incidentId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Backend response:', data); // Debug log
        return data.response;
      } else {
        throw new Error('Failed to get response from Gemini');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      // Fallback responses for demo
      return getFallbackResponse(userMessage);
    }
  };

  const getFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    console.log('Using fallback response for:', userMessage); // Debug log
    
    // Mental health assessment keywords
    if (lowerMessage.includes('not good') || lowerMessage.includes('terrible') || 
        lowerMessage.includes('awful') || lowerMessage.includes('horrible') ||
        lowerMessage.includes('can\'t cope') || lowerMessage.includes('overwhelmed') ||
        lowerMessage.includes('depressed') || lowerMessage.includes('suicidal') ||
        lowerMessage.includes('want to die') || lowerMessage.includes('end it all')) {
      console.log('Fallback: Crisis detected'); // Debug log
      return 'CRISIS_DETECTED';
    }
    
    if (lowerMessage.includes('struggling') || lowerMessage.includes('hard time') ||
        lowerMessage.includes('difficult') || lowerMessage.includes('stress') ||
        lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
      return "I can hear that you're going through a tough time right now. It's completely understandable to feel this way after a difficult call. You're not alone in this. Would you like me to connect you with someone who can provide additional support?";
    }
    
    if (lowerMessage.includes('okay') || lowerMessage.includes('fine') ||
        lowerMessage.includes('alright') || lowerMessage.includes('good')) {
      return "I'm glad to hear you're doing okay. It's important to check in with yourself regularly after these kinds of calls. Is there anything specific about the call that's on your mind?";
    }
    
    // Default supportive response
    return "Thank you for sharing that with me. It takes courage to talk about these experiences. How are you feeling physically right now? Are you getting enough rest?";
  };

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await sendToGemini(userMessage.text);
      console.log('Chat response:', response); // Debug log
      
      // Check if it's a crisis response that should redirect to contacts
      if (response === 'CRISIS_DETECTED') {
        console.log('Crisis detected, redirecting to contacts'); // Debug log
        // Redirect to contacts immediately
        setTimeout(() => {
          router.push('/(tabs)/contacts');
        }, 1000);
        return;
      }

      // Simulate typing delay
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderMessage = (msg: Message) => (
    <View key={msg.id} style={styles.messageContainer}>
      <View style={[
        styles.messageBubble,
        msg.isUser ? styles.userMessage : styles.botMessage
      ]}>
        <Text style={[
          styles.messageText,
          msg.isUser ? styles.userMessageText : styles.botMessageText
        ]}>
          {msg.text}
        </Text>
      </View>
    </View>
  );

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
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer} 
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View style={styles.messageContainer}>
              <View style={styles.botMessage}>
                <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color={COLORS.navy} />
                  <Text style={styles.typingText}>Support is typing...</Text>
                </View>
              </View>
            </View>
          )}
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
              editable={!isTyping}
            />
            <Pressable 
              style={[
                styles.sendButton, 
                (!message.trim() || isTyping) && styles.sendButtonDisabled
              ]}
              onPress={handleSend}
              disabled={!message.trim() || isTyping}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={(message.trim() && !isTyping) ? COLORS.white : COLORS.steelBlue} 
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
    paddingTop: 50,
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
  messageBubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 16,
  },
  botMessage: {
    backgroundColor: COLORS.softGray,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: COLORS.safetyOrange,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botMessageText: {
    color: COLORS.navy,
  },
  userMessageText: {
    color: COLORS.white,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14,
    color: COLORS.navy,
    marginLeft: 8,
    fontStyle: 'italic',
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