import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function PostCallPause() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const incidentId = params.incidentId as string || 'demo';
  const severity = params.severity as string || '0.82';
  const source = params.source as string || 'manual';
  const triggerId = params.triggerId as string;

  console.log('🎬 PostCallPause component loaded with params:', {
    incidentId,
    severity,
    source,
    triggerId
  });

  const navigateToChat = () => {
    console.log('navigateToChat called with params:', {
      incidentId,
      severity,
      source,
      triggerId,
    });
    
    try {
      router.push({
        pathname: '/chat',
        params: {
          incidentId,
          severity,
          source,
          triggerId,
        },
      });
      console.log('Navigation to chat initiated successfully');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleSkip = () => {
    // If this came from a trigger, acknowledge it when user skips
    if (source === 'trigger' && triggerId) {
      // You could call an API here to acknowledge the trigger
      console.log('Acknowledging trigger:', triggerId);
    }
    navigateToChat();
  };

  const handlePrivacyLearn = () => {
    console.log('Privacy info clicked');
  };

  // Auto-navigation effect
  useEffect(() => {
    console.log('PostCallPause useEffect triggered with:', { source, triggerId });
    
    // If this came from a trigger, acknowledge it and auto-navigate
    if (source === 'trigger' && triggerId) {
      console.log('Acknowledging trigger:', triggerId);
      // You could call an API here to acknowledge the trigger
    }

    // Auto-advance after 2 seconds (reduced for testing)
    console.log('Setting auto-navigation timer for 2 seconds...');
    const timer = setTimeout(() => {
      console.log('Auto-navigation timer triggered - navigating to chat');
      navigateToChat();
    }, 2000);

    return () => {
      console.log('Cleaning up timer');
      clearTimeout(timer);
    };
  }, [source, triggerId]);

  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        {/* Skip button */}
        {/* <Pressable 
          style={styles.skipButton}
          onPress={handleSkip}
          accessibilityLabel="Skip and proceed immediately"
          accessibilityRole="button"
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable> */}

        {/* Main content */}
        <View style={styles.content}>
          {/* Animation */}
          <View style={styles.animationContainer}>
            <View style={styles.pulseContainer}>
              <View style={styles.pulseRing} />
              <Ionicons name="heart" size={48} color={COLORS.white} />
            </View>
          </View>

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text 
              style={styles.headline}
              accessibilityRole="header"
            >
              Let's check in after that call.
            </Text>
            
            <Text style={styles.subtext}>
              Just a few quick questions to make sure you're okay.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable 
            onPress={handlePrivacyLearn}
            accessibilityLabel="Learn about privacy and data protection"
            accessibilityRole="button"
          >
            <Text style={styles.privacyLink}>Learn about privacy</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0, // Remove padding to eliminate white block
  },
  gradient: {
    flex: 1,
    backgroundColor: COLORS.navy, // Solid background instead of gradient
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  skipText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  animationContainer: {
    marginBottom: 48,
  },
  pulseContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: COLORS.safetyOrange,
    opacity: 0.5,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  headline: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtext: {
    fontSize: 18,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    alignItems: 'center',
  },
  privacyLink: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.7,
    textDecorationLine: 'underline',
  },
});
