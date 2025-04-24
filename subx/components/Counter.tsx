import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '@/store/userStore';
import { colors } from '@/constants/colors';

export const Counter = () => {
  const signupCount = useUserStore(state => state.signupCount);
  const countRef = useRef<Text>(null);
  
  useEffect(() => {
    // Animate the counter for visual effect
    if (countRef.current) {
      // Simple animation effect could be added here
    }
  }, [signupCount]);

  return (
    <View style={styles.container}>
      <Text style={styles.counterText}>
        <Text ref={countRef} style={styles.count}>{signupCount.toLocaleString()}</Text>
        <Text style={styles.label}> people already joined!</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  counterText: {
    textAlign: 'center',
  },
  count: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 18,
  },
  label: {
    color: colors.text,
    fontSize: 16,
  },
});