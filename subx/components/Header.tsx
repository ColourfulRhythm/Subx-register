import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/constants/colors';

export const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Subx</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Early Access</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: colors.secondary,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: colors.buttonText,
    fontWeight: '600',
  },
});