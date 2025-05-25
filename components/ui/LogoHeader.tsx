import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface LogoHeaderProps {
  small?: boolean;
}

export default function LogoHeader({ small = false }: LogoHeaderProps) {
  return (
    <View style={[styles.container, small && styles.containerSmall]}>
      <View style={styles.logoContainer}>
        <MaterialIcons name="directions-car" size={small ? 32 : 48} color={COLORS.PRIMARY} />
        <View style={styles.logoTextContainer}>
          <Text style={[styles.logoText, small && styles.logoTextSmall]}>Rwanda</Text>
          <Text style={[styles.logoTextAccent, small && styles.logoTextSmall]}>Ride</Text>
        </View>
      </View>
      <Text style={[styles.tagline, small && styles.taglineSmall]}>
        Your trusted ride partner in Rwanda
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  containerSmall: {
    marginTop: 20,
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoTextContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
  },
  logoTextAccent: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  logoTextSmall: {
    fontSize: 24,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.SECONDARY,
  },
  taglineSmall: {
    fontSize: 14,
  },
});