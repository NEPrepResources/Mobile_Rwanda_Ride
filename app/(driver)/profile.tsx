import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function DriverProfileScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.settings);


  return (
    <ScrollView 
      style={[
        styles.container, 
        { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
        <TouchableOpacity onPress={() => router.push('./profile/edit')}>
          <MaterialIcons name="edit" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        {user?.profilePicture ? (
          <Image source={{ uri: user.profilePicture }} style={styles.profilePic} />
        ) : (
          <View style={styles.profilePicPlaceholder}>
            <Text style={styles.profilePicText}>
              {user?.fullName?.charAt(0) || ''}
            </Text>
          </View>
        )}
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <MaterialIcons name="phone" size={24} color={COLORS.PRIMARY} />
          <Text style={styles.infoText}>{user?.phone || 'Not provided'}</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="directions-car" size={24} color={COLORS.PRIMARY} />
          <Text style={styles.infoText}>{user?.vehicleType || 'Not provided'}</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="confirmation-number" size={24} color={COLORS.PRIMARY} />
          <Text style={styles.infoText}>{user?.licensePlate || 'Not provided'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profilePicPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profilePicText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.SECONDARY,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.SECONDARY_DARK,
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: COLORS.ERROR_LIGHT,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.ERROR,
    fontSize: 16,
    fontWeight: 'bold',
  },
});