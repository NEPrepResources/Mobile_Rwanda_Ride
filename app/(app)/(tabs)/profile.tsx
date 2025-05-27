import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState, AppDispatch } from '@/store/store';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import FormInput from '@/components/ui/FormInput';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.settings);
  
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture);
  
  const selectImage = async () => {
    if (!isEditing) return;
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to change profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Implement profile update logic
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={[
          styles.container,
          { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={selectImage}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
            ) : (
              <View style={styles.profilePicturePlaceholder}>
                <Text style={styles.profilePicturePlaceholderText}>
                  {user?.fullName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
            {isEditing && (
              <View style={styles.editPictureOverlay}>
                <MaterialIcons name="camera-alt" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={[styles.name, { color: theme === 'dark' ? 'white' : COLORS.PRIMARY }]}>
              {user?.fullName}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>
            {user?.isDriver && (
              <View style={styles.driverBadge}>
                <MaterialIcons name="verified" size={16} color="white" />
                <Text style={styles.driverBadgeText}>Driver</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {isEditing ? (
            <>
              <FormInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
              />
              <FormInput
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
              <FormInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
              />
              {user?.isDriver && (
                <FormInput
                  label="License Number"
                  value={user.licenseNumber}
                  editable={false}
                  style={styles.disabledInput}
                />
              )}
            </>
          ) : (
            <>
              <InfoItem icon="person" label="Full Name" value={user?.fullName} />
              <InfoItem icon="phone" label="Phone" value={user?.phone} />
              <InfoItem icon="location-on" label="Address" value={user?.address} />
              {user?.isDriver && (
                <InfoItem icon="badge" label="License Number" value={user?.licenseNumber} />
              )}
            </>
          )}
        </View>

        <View style={styles.actions}>
          {isEditing ? (
            <>
              <PrimaryButton title="Save Changes" onPress={handleSave} />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <PrimaryButton
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <MaterialIcons name="settings" size={24} color={COLORS.PRIMARY} />
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoItem = ({ icon, label, value }: { icon: string, label: string, value?: string }) => (
  <View style={styles.infoItem}>
    <MaterialIcons name={icon as any} size={24} color={COLORS.PRIMARY} />
    <View style={styles.infoItemContent}>
      <Text style={styles.infoItemLabel}>{label}</Text>
      <Text style={styles.infoItemValue}>{value || 'Not provided'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicturePlaceholderText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  editPictureOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 15,
    padding: 6,
  },
  headerInfo: {
    alignItems: 'center',
    marginTop: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: COLORS.SECONDARY,
    marginBottom: 8,
  },
  driverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  driverBadgeText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoItemContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoItemLabel: {
    fontSize: 14,
    color: COLORS.SECONDARY,
    marginBottom: 4,
  },
  infoItemValue: {
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  actions: {
    padding: 20,
  },
  cancelButton: {
    marginTop: 12,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.SECONDARY,
    fontSize: 16,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: COLORS.GREY_LIGHT,
  },
  settingsButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  disabledInput: {
    opacity: 0.7,
  },
});
