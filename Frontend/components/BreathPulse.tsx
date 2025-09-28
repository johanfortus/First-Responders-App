import React, { useEffect, useRef } from 'react';
import { View, AccessibilityInfo, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface BreathPulseProps {
  size?: number;
  duration?: number;
}

export default function BreathPulse({ size = 120, duration = 2500 }: BreathPulseProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const [reduceMotionEnabled, setReduceMotionEnabled] = React.useState(false);

  useEffect(() => {
    // Check if reduce motion is enabled
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled);

    if (!reduceMotionEnabled) {
      // Create pulsing animation
      const createPulse = () => {
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.3,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 0.8,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          // Loop the animation
          createPulse();
        });
      };

      createPulse();
    }
  }, [duration, reduceMotionEnabled, scaleAnim, opacityAnim]);

  return (
    <View 
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      accessibilityLabel="Calming pulse animation"
      accessibilityRole="image"
    >
      {/* Pulsing ring */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: (size * 0.8) / 2,
            borderWidth: 2,
            borderColor: COLORS.safetyOrange,
          },
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      />
      
      {/* Shield heart icon */}
      <View>
        <Ionicons 
          name="shield-heart" 
          size={size * 0.4} 
          color={COLORS.white} 
        />
      </View>
    </View>
  );
}
