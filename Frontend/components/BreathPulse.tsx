import React, { useEffect } from 'react';
import { View, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface BreathPulseProps {
  size?: number;
  duration?: number;
}

export default function BreathPulse({ size = 120, duration = 2500 }: BreathPulseProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [reduceMotionEnabled, setReduceMotionEnabled] = React.useState(false);

  useEffect(() => {
    // Check if reduce motion is enabled
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled);

    if (reduceMotionEnabled) {
      // Static state for reduced motion
      scale.value = 1;
      opacity.value = 0.3;
    } else {
      // Animated state
      scale.value = withRepeat(
        withTiming(1.3, { duration: duration / 2 }),
        -1,
        true
      );
      opacity.value = withRepeat(
        withTiming(0.8, { duration: duration / 2 }),
        -1,
        true
      );
    }
  }, [duration, reduceMotionEnabled]);

  const animatedRingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: reduceMotionEnabled ? 1 : interpolate(scale.value, [0, 1.3], [0.95, 1.05]) }],
    };
  });

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
          animatedRingStyle,
        ]}
      />
      
      {/* Shield heart icon */}
      <Animated.View style={animatedIconStyle}>
        <Ionicons 
          name="shield-heart" 
          size={size * 0.4} 
          color={COLORS.white} 
        />
      </Animated.View>
    </View>
  );
}